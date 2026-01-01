import { create } from 'zustand';

export interface Statistics {
  totalUsers: number;
  totalContent: number;
  monthlyViews: number;
  growthRate: number;
  dailyViews: { date: string; views: number }[];
  contentByStatus: { status: string; count: number }[];
}

interface StatisticsState {
  statistics: Statistics;
  updateStatistics: (stats: Partial<Statistics>) => void;
}

export const useStatisticsStore = create<StatisticsState>((set) => ({
  statistics: {
    totalUsers: 1234,
    totalContent: 567,
    monthlyViews: 45678,
    growthRate: 12.5,
    dailyViews: [
      { date: '2024-01-01', views: 1200 },
      { date: '2024-01-02', views: 1500 },
      { date: '2024-01-03', views: 1800 },
      { date: '2024-01-04', views: 1600 },
      { date: '2024-01-05', views: 2100 },
      { date: '2024-01-06', views: 2300 },
      { date: '2024-01-07', views: 2000 },
    ],
    contentByStatus: [
      { status: '게시됨', count: 45 },
      { status: '임시저장', count: 12 },
      { status: '보관됨', count: 8 },
    ],
  },

  updateStatistics: (stats) =>
    set((state) => ({
      statistics: { ...state.statistics, ...stats },
    })),
}));
