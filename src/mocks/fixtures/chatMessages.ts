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
        '웹 접근성은 누구나 웹을 사용할 수 있도록 만드는 기준입니다. 인지/운용/이해/견고성의 4원칙을 기준으로 대비, 키보드 접근성, 대체 텍스트 등을 확인합니다.',
      createdAt: iso(-89),
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
        'AI 도입 속도 증가, 보안/프라이버시 강화, 개인화 UX 확대, 그리고 개발 생산성 도구의 확산이 주요 흐름으로 보입니다.',
      createdAt: iso(-49),
    },
  ],
};
