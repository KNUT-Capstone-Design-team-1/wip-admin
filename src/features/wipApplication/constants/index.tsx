import {
    People as PeopleIcon,
    PhoneAndroid as PhoneAndroidIcon,
    Api as ApiIcon,
    Speed as SpeedIcon,
} from "@mui/icons-material";

export const WIP_ITEM = [
    {
        title: '평균 DAU',
        value: '1,234',
        icon: <PeopleIcon sx={{ fontSize: 40 }} />,
        color: '#3b82f6',
    }, {
        title: '전체 사용자',
        value: '3,456',
        icon: <PhoneAndroidIcon sx={{ fontSize: 40 }} />,
        color: '#10b981',
    }, {
        title: 'API 호출 수',
        value: '125,678',
        icon: <ApiIcon sx={{ fontSize: 40 }} />,
        color: '#f59e0b',
    }, {
        title: '평균 응답시간',
        value: '85ms',
        icon: <SpeedIcon sx={{ fontSize: 40 }} />,
        color: '#8b5cf6',
    },
];
