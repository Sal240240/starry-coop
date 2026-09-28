/** Splits mixed English/Chinese text so Chinese runs can carry lang="zh-Hans". */
export interface TextRun {
  text: string;
  zh: boolean;
}

const HAN_RUN = /([　-〿一-鿿＀-￯·]*[一-鿿][　-〿一-鿿＀-￯·]*)/u;

export function splitZh(input: string): TextRun[] {
  return input
    .split(HAN_RUN)
    .filter((part) => part.length > 0)
    .map((part) => ({ text: part, zh: /[一-鿿]/u.test(part) }));
}
