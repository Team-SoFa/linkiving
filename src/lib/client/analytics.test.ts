import { afterEach, describe, expect, it, vi } from 'vitest';

const loadAnalytics = async (enabled = true, measurementId = 'G-TEST') => {
  vi.stubEnv('NEXT_PUBLIC_ANALYTICS_ENABLED', String(enabled));
  vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', measurementId);
  vi.resetModules();

  return import('./analytics');
};

describe('trackQueryFeedback', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it.each([
    ['up', 'up'],
    ['down', 'down'],
  ] as const)('%s 피드백을 app_query_id와 feedback_value로 전송한다', async (_, feedbackValue) => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag });
    const { trackQueryFeedback } = await loadAnalytics();

    trackQueryFeedback('query-123', feedbackValue);

    expect(gtag).toHaveBeenCalledOnce();
    expect(gtag).toHaveBeenCalledWith('event', 'query_feedback', {
      app_query_id: 'query-123',
      feedback_value: feedbackValue,
    });
    expect(gtag.mock.calls[0]?.[2]).not.toHaveProperty('value');
  });

  it('계측이 비활성화된 환경에서는 이벤트를 전송하지 않는다', async () => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag });
    const { trackQueryFeedback } = await loadAnalytics(false);

    trackQueryFeedback('query-123', 'up');

    expect(gtag).not.toHaveBeenCalled();
  });

  it('측정 ID가 없으면 이벤트를 전송하지 않는다', async () => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag });
    const { trackQueryFeedback } = await loadAnalytics(true, '');

    trackQueryFeedback('query-123', 'up');

    expect(gtag).not.toHaveBeenCalled();
  });
});

describe('trackFeedbackFormOpen', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('채팅 답변 제보에 해당 질의 ID를 연결한다', async () => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag });
    const { trackFeedbackFormOpen } = await loadAnalytics();
    trackFeedbackFormOpen('chat_answer_more', 'query-of-this-answer');
    expect(gtag).toHaveBeenCalledExactlyOnceWith('event', 'feedback_form_open', {
      entry_point: 'chat_answer_more',
      app_query_id: 'query-of-this-answer',
    });
  });

  it('질의 ID가 없는 과거 답변에는 임의 ID를 넣지 않는다', async () => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag });
    const { trackFeedbackFormOpen } = await loadAnalytics();
    trackFeedbackFormOpen('chat_answer_more', null);
    expect(gtag).toHaveBeenCalledExactlyOnceWith('event', 'feedback_form_open', {
      entry_point: 'chat_answer_more',
    });
  });

  it('프로필 경로에는 다른 질의의 ID가 섞이지 않는다', async () => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag });
    const { trackFeedbackFormOpen } = await loadAnalytics();
    trackFeedbackFormOpen('profile_menu', 'previous-query');
    expect(gtag).toHaveBeenCalledExactlyOnceWith('event', 'feedback_form_open', {
      entry_point: 'profile_menu',
    });
  });
});

describe('GA DB 식별자 계약', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it.each(['summary_regenerate', 'link_delete', 'query_result_click'] as const)(
    '%s는 분석용 ID를 정밀도 손실 없이 전송한다',
    async name => {
      const gtag = vi.fn();
      vi.stubGlobal('window', { gtag });
      const { trackLinkEvent } = await loadAnalytics();
      trackLinkEvent(name, '9007199254740993', { result_rank: 1 });
      expect(gtag).toHaveBeenCalledExactlyOnceWith('event', name, {
        link_id: '9007199254740993',
        result_rank: 1,
      });
    }
  );

  it.each([undefined, '', 'k13501E2'])(
    '구버전·잘못된 ID %s에 Hashids를 보내지 않는다',
    async id => {
      const gtag = vi.fn();
      vi.stubGlobal('window', { gtag });
      const { trackLinkEvent, setGaUserId } = await loadAnalytics();
      trackLinkEvent('summary_regenerate', id);
      setGaUserId(id);
      expect(gtag).toHaveBeenCalledWith('event', 'summary_regenerate', {});
      expect(gtag).toHaveBeenCalledWith('set', { user_id: null });
    }
  );

  it('회원 분석 ID 설정 후 로그아웃하면 사용자 식별을 해제한다', async () => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag });
    const { setGaUserId } = await loadAnalytics();
    setGaUserId('42');
    setGaUserId(null);
    expect(gtag.mock.calls).toEqual([
      ['set', { user_id: '42' }],
      ['set', { user_id: null }],
    ]);
  });
});
