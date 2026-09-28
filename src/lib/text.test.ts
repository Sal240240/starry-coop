import { describe, expect, test } from 'vitest';
import { splitZh } from './text';

describe('splitZh', () => {
  test('separates a trailing Chinese label', () => {
    expect(splitZh('Menu 菜单')).toEqual([
      { text: 'Menu ', zh: false },
      { text: '菜单', zh: true },
    ]);
  });

  test('keeps a Chinese run with a middle dot together', () => {
    expect(splitZh('手工面 · 饭').map((r) => r.zh)).toEqual([true, false, true]);
  });

  test('handles Chinese in the middle of English', () => {
    const runs = splitZh('Skewers in Pot 冷锅串串香, $0.58 a stick');
    expect(runs).toEqual([
      { text: 'Skewers in Pot ', zh: false },
      { text: '冷锅串串香', zh: true },
      { text: ', $0.58 a stick', zh: false },
    ]);
  });

  test('returns a single English run when there is no Chinese', () => {
    expect(splitZh('Our story')).toEqual([{ text: 'Our story', zh: false }]);
  });
});
