import type { LinkApiData } from '@/types/api/linkApi';
import type { EntityId } from '@/types/id';
import { create } from 'zustand';

type LinkStoreState = {
  links: LinkApiData[];
  selectedLinkId: EntityId | null;
  /** 상세 패널이 열려 있는지. 모바일에서 전체화면을 덮으므로 사이드네비 트리거를 숨기는 데 쓴다. */
  isDetailPanelOpen: boolean;
  setLinks: (links: LinkApiData[]) => void;
  selectLink: (id: EntityId | null) => void;
  setDetailPanelOpen: (open: boolean) => void;
  updateLink: (id: EntityId, updates: Partial<LinkApiData>) => void;
};

export const useLinkStore = create<LinkStoreState>(set => ({
  links: [],
  selectedLinkId: null,
  isDetailPanelOpen: false,
  setLinks: links => set({ links }),
  selectLink: id => set({ selectedLinkId: id }),
  setDetailPanelOpen: open => set({ isDetailPanelOpen: open }),
  updateLink: (id, updates) =>
    set(state => ({
      links: state.links.map(link => (link.id === id ? { ...link, ...updates } : link)),
    })),
}));
