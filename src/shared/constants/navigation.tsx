import {
  Dashboard as DashboardIcon,
  Article as ArticleIcon,
  BarChart as BarChartIcon,
  UploadFile as UploadFileIcon,
} from '@mui/icons-material';
import {JSX} from "react";

export interface MenuItem {
  text: string;
  icon: JSX.Element;
  path: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    text: '대시보드(임시)',
    icon: <DashboardIcon />,
    path: '/wipApplication',
  },
  {
    text: '통계(임시)',
    icon: <BarChartIcon />,
    path: '/wipApplication/statistics',
  },
  {
    text: '공지사항 관리',
    icon: <ArticleIcon />,
    path: '/wipApplication/notice',
  },
  {
    text: 'Excel to JSON',
    icon: <UploadFileIcon />,
    path: '/wipApplication/excel-converter',
  },
];
