import { create } from 'zustand';

export type ChatRightPanelLink = {
  id: number;
  title: string;
  url: string;
  summary: string;
  imageUrl?: string;
};

type ChatRightPanelState = {
  selectedLink: ChatRightPanelLink | null;
  setSelectedLink: (link: ChatRightPanelLink) => void;
  clearSelectedLink: () => void;
};

export const useChatRightPanelStore = create<ChatRightPanelState>(set => ({
  selectedLink: null,
  setSelectedLink: link => set({ selectedLink: link }),
  clearSelectedLink: () => set({ selectedLink: null }),
}));
