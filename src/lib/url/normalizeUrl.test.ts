import { describe, expect, it } from 'vitest';

import { normalizeUrlInput } from './normalizeUrl';

describe('normalizeUrlInput', () => {
  it.each([
    ['naver.com', 'https://naver.com'],
    ['www.naver.com', 'https://www.naver.com'],
    ['https://www.naver.com', 'https://www.naver.com'],
    ['http://old-site.com', 'http://old-site.com'],
    ['https://https://naver.com', 'https://naver.com'],
    ['  https://naver.com\n', 'https://naver.com'],
    ['https://youtube.com/watch?v=abc', 'https://youtube.com/watch?v=abc'],
    ['https://example.com/path#section', 'https://example.com/path#section'],
  ])('%s 입력을 %s로 정규화한다', (input, expected) => {
    expect(normalizeUrlInput(input)).toEqual({ success: true, url: expected });
  });

  it.each(['', ' \n ', '안녕하세요', 'https://localhost', 'ftp://example.com'])(
    '%s 입력을 거부한다',
    input => {
      expect(normalizeUrlInput(input).success).toBe(false);
    }
  );
});
