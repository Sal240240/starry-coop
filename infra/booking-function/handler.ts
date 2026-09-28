/**
 * Reservation-request endpoint: AWS Lambda (Function URL) → Amazon SES email.
 *
 * Validation is imported from the website's own module so the browser and the
 * server enforce identical rules. Deployed with infra/booking-function/template.yaml.
 *
 * Abuse controls (layered, all cheap):
 *   1. Origin allow-list (+ Function URL CORS)            → blocks casual cross-site posts
 *   2. Honeypot field + minimum fill time                 → silently drops simple bots
 *   3. Per-IP limit (hashed IP, DynamoDB TTL, 5/hour)     → caps repeat submissions
 *   4. Reserved concurrency + CloudWatch alarm (template) → caps cost, alerts the owner
 *
 * Env vars (set by the SAM template):
 *   ALLOWED_ORIGINS   comma-separated site origins
 *   TO_EMAIL          restaurant inbox that receives requests
 *   FROM_EMAIL        SES-verified sender identity
 *   RATE_TABLE        DynamoDB table for the per-IP limit
 */
import { createHash, randomBytes } from 'node:crypto';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { DynamoDBClient, UpdateItemCommand, ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { buildSmsBody, formatBookingDate, validateBooking, type BookingInput } from '../../src/lib/booking';
import { localParts } from '../../src/lib/hours';
import { formatTime } from '../../src/data/site';

interface FunctionUrlEvent {
  requestContext: { http: { method: string; sourceIp: string } };
  headers: Record<string, string | undefined>;
  body?: string;
  isBase64Encoded?: boolean;
}

interface FunctionUrlResult {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

interface ApiResponse {
  success: boolean;
  data: { reference: string } | null;
  error: string | null;
  fields?: Record<string, string>;
}

interface ParsedBody extends BookingInput {
  startedAt: number;
}

const MAX_BODY_BYTES = 4_096;
const MIN_FILL_MS = 3_000;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;
const MAX_REQUESTS_PER_IP_PER_HOUR = 5;

const ses = new SESv2Client({});
const ddb = new DynamoDBClient({});

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable ${name}`);
  return value;
}

const allowedOrigins = (): string[] =>
  requireEnv('ALLOWED_ORIGINS').split(',').map((o) => o.trim()).filter(Boolean);

function respond(status: number, origin: string | null, payload: ApiResponse): FunctionUrlResult {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...(origin ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {}),
    },
    body: JSON.stringify(payload),
  };
}

const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);

const makeReference = (): string =>
  `SC-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`;

function parseBody(event: FunctionUrlEvent): ParsedBody | null {
  if (!event.body) return null;
  const raw = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    const record = parsed as Record<string, unknown>;
    const str = (key: string): string => (typeof record[key] === 'string' ? (record[key] as string) : '');
    return {
      name: str('name'),
      phone: str('phone'),
      email: str('email'),
      date: str('date'),
      time: str('time'),
      partySize: str('partySize'),
      occasion: str('occasion'),
      notes: str('notes'),
      company: str('company'),
      startedAt: Number(str('startedAt')) || 0,
    };
  } catch {
    return null;
  }
}

/** Returns false when this IP has already sent the hourly maximum. */
async function withinRateLimit(sourceIp: string): Promise<boolean> {
  const hour = Math.floor(Date.now() / 3_600_000);
  const ipHash = createHash('sha256').update(sourceIp).digest('hex').slice(0, 32);
  try {
    await ddb.send(
      new UpdateItemCommand({
        TableName: requireEnv('RATE_TABLE'),
        Key: { pk: { S: `${ipHash}#${hour}` } },
        UpdateExpression: 'ADD hits :one SET expiresAt = if_not_exists(expiresAt, :ttl)',
        ConditionExpression: 'attribute_not_exists(hits) OR hits < :max',
        ExpressionAttributeValues: {
          ':one': { N: '1' },
          ':max': { N: String(MAX_REQUESTS_PER_IP_PER_HOUR) },
          ':ttl': { N: String((hour + 2) * 3600) },
        },
      }),
    );
    return true;
  } catch (error: unknown) {
    if (error instanceof ConditionalCheckFailedException) return false;
    throw error;
  }
}

export async function handler(event: FunctionUrlEvent): Promise<FunctionUrlResult> {
  const requestOrigin = event.headers.origin ?? event.headers.Origin ?? '';
  const origin = allowedOrigins().includes(requestOrigin) ? requestOrigin : null;

  if (!origin) {
    return respond(403, null, { success: false, data: null, error: 'Origin not allowed.' });
  }
  if (event.requestContext.http.method !== 'POST') {
    return respond(405, origin, { success: false, data: null, error: 'Method not allowed.' });
  }

  const input = parseBody(event);
  if (!input) {
    return respond(400, origin, { success: false, data: null, error: 'Invalid request body.' });
  }

  const fillMs = Date.now() - input.startedAt;
  const looksAutomated = input.startedAt === 0 || fillMs < MIN_FILL_MS || fillMs > MAX_FORM_AGE_MS;

  const now = localParts(new Date());
  const result = validateBooking(input, now.isoDate, now.minutes);

  if (looksAutomated || (!result.ok && result.spam)) {
    // Pretend success so bots learn nothing.
    return respond(200, origin, { success: true, data: { reference: makeReference() }, error: null });
  }
  if (!result.ok) {
    return respond(422, origin, {
      success: false,
      data: null,
      error: 'Please check the highlighted fields.',
      fields: result.errors as Record<string, string>,
    });
  }

  try {
    if (!(await withinRateLimit(event.requestContext.http.sourceIp))) {
      return respond(429, origin, {
        success: false,
        data: null,
        error: 'We’ve received several requests from you already. Please call us to book.',
      });
    }
  } catch (error: unknown) {
    // Fail open on limiter errors, but record them.
    console.error('Rate limiter unavailable', { message: error instanceof Error ? error.message : String(error) });
  }

  const req = result.data;
  const reference = makeReference();
  const subject = `Table request ${reference}: ${req.partySize} guests, ${formatBookingDate(req.date)} ${formatTime(req.time)}`;
  const text = [
    buildSmsBody(req),
    `Phone: ${req.phone}`,
    req.email ? `Email: ${req.email}` : '',
    `Reference: ${reference}`,
    '',
    'Please call the guest to confirm. This request is not yet confirmed.',
  ]
    .filter((line, i, all) => line !== '' || all[i - 1] !== '')
    .join('\n');

  try {
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: requireEnv('FROM_EMAIL'),
        Destination: { ToAddresses: [requireEnv('TO_EMAIL')] },
        ReplyToAddresses: req.email ? [req.email] : undefined,
        Content: {
          Simple: {
            Subject: { Data: subject, Charset: 'UTF-8' },
            Body: {
              Text: { Data: text, Charset: 'UTF-8' },
              Html: { Data: `<pre style="font:15px/1.5 system-ui">${escapeHtml(text)}</pre>`, Charset: 'UTF-8' },
            },
          },
        },
      }),
    );
  } catch (error: unknown) {
    // Log context server-side only (no guest details); never echo internals to the client.
    console.error('SES send failed', { reference, message: error instanceof Error ? error.message : String(error) });
    return respond(502, origin, {
      success: false,
      data: null,
      error: 'We couldn’t send your request right now. Please call us to book.',
    });
  }

  return respond(200, origin, { success: true, data: { reference }, error: null });
}
