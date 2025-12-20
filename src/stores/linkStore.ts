import { mockLinks } from '@/mocks';
import type { LinkApiData } from '@/types/api/linkApi';
import { create } from 'zustand';

type LinkStoreState = {
  links: LinkApiData[];
  selectedLinkId: number | null;
  setLinks: (links: LinkApiData[]) => void;
  selectLink: (id: number | null) => void;
  updateLink: (id: number, updates: Partial<LinkApiData>) => void;
};

const useMockData = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export const useLinkStore = create<LinkStoreState>(set => ({
  links: useMockData ? mockLinks : [],
  selectedLinkId: null,
  setLinks: links => set({ links }),
  selectLink: id => set({ selectedLinkId: id }),
  updateLink: (id, updates) =>
    set(state => ({
      links: state.links.map(link => (link.id === id ? { ...link, ...updates } : link)),
    })),
}));
