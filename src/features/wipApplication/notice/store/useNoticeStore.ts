import { create } from 'zustand';

export interface Content {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  views: number;
  mustRead: number;
}

interface ContentState {
  contents: Content[];
  isLoading: boolean;
  error: string | null;
  fetchContents: () => Promise<void>;
  addContent: (content: Omit<Content, 'id'>) => void;
  updateContent: (id: number, content: Partial<Content>) => void;
  deleteContent: (id: number) => void;
  getContentById: (id: number) => Content | undefined;
}

export const useNoticeStore = create<ContentState>((set, get) => ({
  contents: [],
  isLoading: false,
  error: null,

  fetchContents: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/notices');

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to fetch notices');
      }

      const notices = await response.json();

      // API 데이터를 Content 형식에 맞게 변환
      const formattedContents: Content[] = notices.map((item: any) => ({
        id: item.idx,                     // idx → id
        title: item.title,
        description: item.contents,       // contents → description
        createdAt: item.createDate,        // createDate → createdAt
        views: 0,                          // API에 없으면 프론트 기본값
        mustRead: item.mustRead || 0,      // mustRead 추가
      }));

      set({ contents: formattedContents, isLoading: false });
    } catch (error) {
      console.error('Error fetching notices:', error);
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false
      });
    }
  },

  addContent: (content) =>
    set((state) => ({
      contents: [
        ...state.contents,
        { ...content, id: Math.max(...state.contents.map((c) => c.id)) + 1 },
      ],
    })),

  updateContent: (id, content) =>
    set((state) => ({
      contents: state.contents.map((c) =>
        c.id === id ? { ...c, ...content } : c
      ),
    })),

  deleteContent: (id) =>
    set((state) => ({
      contents: state.contents.filter((c) => c.id !== id),
    })),

  getContentById: (id) => get().contents.find((c) => c.id === id),
}));
