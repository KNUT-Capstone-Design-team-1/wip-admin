import {
  Article as ArticleIcon,
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
