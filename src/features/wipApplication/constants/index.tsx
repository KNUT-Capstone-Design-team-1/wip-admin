import {
    Article as ArticleIcon,
    People as PeopleIcon,
    TrendingUp as TrendingUpIcon,
    Visibility as VisibilityIcon
} from "@mui/icons-material";

export const WIP_ITEM = [
    {
        title: '총 사용자',
        value: '1,234',
        icon: <PeopleIcon sx={{ fontSize: 40 }} />,
        color: '#1976d2',
    }, {
        title: '총 콘텐츠',
        value: '567',
        icon: <ArticleIcon sx={{ fontSize: 40 }} />,
        color: '#2e7d32',
    }, {
        title: '월간 조회수',
        value: '45,678',
        icon: <VisibilityIcon sx={{ fontSize: 40 }} />,
        color: '#ed6c02',
    }, {
        title: '성장률',
        value: '+12.5%',
        icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
        color: '#9c27b0',
    },
];
