import { afterEach, describe, expect, it, vi } from 'vitest';

import { trackQueryFeedback } from './analytics';

describe('trackQueryFeedback', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([
    ['up', 'up'],
    ['down', 'down'],
  ] as const)('%s 피드백을 feedback_value로 전송한다', (_, feedbackValue) => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag });

    trackQueryFeedback('query-123', feedbackValue);

    expect(gtag).toHaveBeenCalledOnce();
    expect(gtag).toHaveBeenCalledWith('event', 'query_feedback', {
      query_id: 'query-123',
      feedback_value: feedbackValue,
    });
    expect(gtag.mock.calls[0]?.[2]).not.toHaveProperty('value');
  });
});
