export type ChatReasoningStep = {
  step: string;
  linkIds: number[];
};

export type ChatReasoningResponse = {
  answer: string;
  linkIds: number[];
  reasoningSteps: ChatReasoningStep[];
  relatedLinks: number[];
  isFallback: boolean;
};

export const chatReasoningById: Record<number, ChatReasoningResponse> = {
  201: {
    answer:
      '웹 접근성 관련 핵심 내용을 저장된 링크에서 찾아 요약했습니다. 키보드 접근성, 대체 텍스트, 대비 기준을 중심으로 정리했어요. 아래 링크에서 자세한 가이드와 패턴을 확인할 수 있습니다.',
    linkIds: [1101, 1102],
    reasoningSteps: [
      {
        step: '접근성 기준이 요약된 가이드 링크를 선택',
        linkIds: [1101],
      },
      {
        step: '키보드 네비게이션 패턴을 포함한 링크를 추가로 매핑',
        linkIds: [1102],
      },
    ],
    relatedLinks: [1101, 1102],
    isFallback: false,
  },
  202: {
    answer:
      'Gemini 관련 링크 두 개를 기반으로 CLI 사용법과 모델 활성화 절차를 정리했습니다. 구독 조건과 실행 흐름이 포함된 문서를 우선 노출합니다.',
    linkIds: [1201, 1202],
    reasoningSteps: [
      {
        step: 'AI 로드맵 문서에서 Gemini Pro 사용 절차를 확인',
        linkIds: [1201],
      },
      {
        step: 'AI 트렌드 요약 링크에서 추가 설명을 연결',
        linkIds: [1202],
      },
    ],
    relatedLinks: [1201, 1202],
    isFallback: false,
  },
  203: {
    answer:
      '최근 IT 트렌드 요약을 위해 타입 시스템, 레이아웃, 브랜드 톤 관련 링크를 참고했습니다. 핵심 포인트만 추려 짧게 정리했어요.',
    linkIds: [1301, 1302, 1303],
    reasoningSteps: [
      {
        step: '타이포그래피 시스템 링크에서 UX 흐름 관련 포인트 추출',
        linkIds: [1301],
      },
      {
        step: '레이아웃 구성 링크를 통해 정보 밀도 관련 기준 보완',
        linkIds: [1302],
      },
      {
        step: '브랜드 톤 구축 링크로 요약 톤을 정리',
        linkIds: [1303],
      },
    ],
    relatedLinks: [1301, 1302, 1303],
    isFallback: false,
  },
};
