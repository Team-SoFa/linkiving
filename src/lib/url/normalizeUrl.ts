export const INVALID_URL_MESSAGE = '유효하지 않은 링크 주소입니다. URL을 다시 확인해 주세요.';
export const EMPTY_URL_MESSAGE = 'URL을 입력해 주세요.';

export type UrlNormalizationResult =
  | { success: true; url: string }
  | { success: false; reason: 'empty' | 'invalid' };

const PROTOCOL_PATTERN = /^(https?):\/\//i;
const EXPLICIT_SCHEME_PATTERN = /^[a-z][a-z\d+.-]*:(?!\d)/i;

export function normalizeUrlInput(value: string): UrlNormalizationResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return { success: false, reason: 'empty' };
  }

  const firstProtocol = trimmed.match(PROTOCOL_PATTERN);
  let normalized = trimmed;

  if (firstProtocol) {
    let remainder = trimmed.slice(firstProtocol[0].length);
    while (PROTOCOL_PATTERN.test(remainder)) {
      remainder = remainder.replace(PROTOCOL_PATTERN, '');
    }
    normalized = `${firstProtocol[1].toLowerCase()}://${remainder}`;
  } else {
    if (EXPLICIT_SCHEME_PATTERN.test(trimmed)) {
      return { success: false, reason: 'invalid' };
    }
    normalized = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(normalized);
    const isHttpProtocol = parsed.protocol === 'http:' || parsed.protocol === 'https:';
    const hasDomainDot = parsed.hostname.includes('.');

    if (!isHttpProtocol || !hasDomainDot) {
      return { success: false, reason: 'invalid' };
    }

    return { success: true, url: normalized };
  } catch {
    return { success: false, reason: 'invalid' };
  }
}
