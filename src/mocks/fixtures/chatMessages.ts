export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  chatId: number;
  role: ChatRole;
  content: string;
  createdAt: string;
}

const now = new Date();
const iso = (offsetMinutes: number) =>
  new Date(now.getTime() + offsetMinutes * 60000).toISOString();

export const chatHistoryById: Record<number, ChatMessage[]> = {
  201: [
    {
      id: '201-1',
      chatId: 201,
      role: 'user',
      content: '웹 접근성 기준을 요약해줘.',
      createdAt: iso(-90),
    },
    {
      id: '201-2',
      chatId: 201,
      role: 'assistant',
      content:
        '웹 접근성은 누구나 웹을 사용할 수 있도록 만드는 기준입니다. 인지/운용/이해/견고성의 4원칙을 기준으로 대비, 키보드 접근성, 대체 텍스트 등을 확인합니다. 예를 들어 버튼/링크에는 의미 있는 라벨이 있어야 하고, 키보드만으로도 모든 기능을 사용할 수 있어야 합니다. 또한 색 대비는 최소 기준을 만족해야 하며, 상태 변화는 시각 외에도 텍스트로 전달되어야 합니다. 마지막으로 다양한 브라우저와 보조기기에서 일관되게 동작하는지 점검하는 것이 중요합니다. 특히 폼 오류 메시지는 입력 필드와 명확히 연결되어야 하고, 자동 재생되는 콘텐츠는 사용자가 멈출 수 있어야 합니다. 내비게이션은 반복되는 링크를 건너뛸 수 있는 방법을 제공하고, 동작이 긴 작업은 진행 상태를 알려주어야 합니다. 이런 항목을 체크리스트로 정리해 QA 단계에서 반복 점검하면 품질이 안정적으로 유지됩니다.',
      createdAt: iso(-89),
    },
    {
      id: '201-3',
      chatId: 201,
      role: 'user',
      content: '그럼 우리 서비스에서 우선순위로 볼 항목은 뭐야?',
      createdAt: iso(-80),
    },
    {
      id: '201-4',
      chatId: 201,
      role: 'assistant',
      content:
        '우선순위로는 1) 키보드 전용 탐색 가능 여부, 2) 이미지/아이콘의 대체 텍스트, 3) 색 대비와 포커스 표시, 4) 폼 에러 메시지의 명확한 안내 순서로 점검하는 것을 추천합니다. 특히 핵심 플로우(로그인/검색/저장)는 모든 상태에서 접근 가능해야 합니다. 추가로 모달이나 드로어 같은 레이어 UI는 포커스 트랩이 잘 걸리는지, 닫을 때 포커스가 원래 위치로 복귀하는지 확인하세요. 스크린 리더 사용자 입장에서는 버튼 텍스트가 컨텍스트를 포함해야 하므로, “저장”보다는 “링크 저장”처럼 의미가 분명한 레이블이 더 좋습니다.',
      createdAt: iso(-79),
    },
  ],
  202: [
    {
      id: '202-1',
      chatId: 202,
      role: 'user',
      content: 'AI 관련 링크 좀 찾아줘.',
      createdAt: iso(-70),
    },
    {
      id: '202-2',
      chatId: 202,
      role: 'assistant',
      content: '최근 저장된 링크 중 AI 로드맵과 트렌드 관련 자료를 정리해줄게요.',
      createdAt: iso(-69),
    },
  ],
  203: [
    {
      id: '203-1',
      chatId: 203,
      role: 'user',
      content: '요즘 IT 트렌드를 한 문단으로 요약해줘.',
      createdAt: iso(-50),
    },
    {
      id: '203-2',
      chatId: 203,
      role: 'assistant',
      content:
        'AI 도입 속도 증가, 보안/프라이버시 강화, 개인화 UX 확대, 그리고 개발 생산성 도구의 확산이 주요 흐름으로 보입니다. 기업들은 AI를 단순 자동화가 아니라 의사결정 보조와 콘텐츠 생성에 적극적으로 활용하고 있으며, 그에 따라 거버넌스와 데이터 품질 관리가 중요해졌습니다. 또한 사용자 경험은 맥락 기반 개인화가 강화되고, 개발 조직은 코파일럿류 도구로 생산성을 높이는 방향으로 움직이고 있습니다. 동시에 규제 대응과 데이터 주권 이슈로 인해 온프레미스/프라이빗 AI 수요가 증가하고, 평가/모니터링 체계까지 포함한 MLOps가 핵심 과제로 떠오르고 있습니다. 제품 전략 관점에서는 AI 기능의 ROI를 명확히 보여주는 지표 설계가 경쟁력의 핵심이 되고 있습니다.',
      createdAt: iso(-49),
    },
  ],
};
