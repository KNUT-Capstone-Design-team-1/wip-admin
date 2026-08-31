import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { Content } from '@/features/wipApplication/notice/store/useNoticeStore';

interface NoticeColumnsParams {
    handleOpen: (content?: Content) => void;
    handleDelete: (id: number) => void;
}

export const createNoticeColumns = ({ handleOpen, handleDelete }: NoticeColumnsParams): GridColDef[] => [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: '제목', width: 250 },
    { field: 'description', headerName: '설명', width: 300 },
    {
        field: 'mustRead',
        headerName: '필독',
        width: 80,
        renderCell: (params) => (
            <Chip
                label={params.value === 1 ? '필독' : '일반'}
                color={params.value === 1 ? 'error' : 'default'}
                size="small"
                variant={params.value === 1 ? 'filled' : 'outlined'}
            />
        ),
    },
    { field: 'createdAt', headerName: '생성일', width: 120 },
    { field: 'views', headerName: '조회수', width: 100 },
    {
        field: 'actions',
        type: 'actions',
        headerName: '작업',
        width: 100,
        getActions: (params) => [
            <GridActionsCellItem
                key="edit"
                icon={<EditIcon />}
                label="수정"
                onClick={() => handleOpen(params.row as Content)}
                showInMenu={false}
            />,
            <GridActionsCellItem
                key="delete"
                icon={<DeleteIcon />}
                label="삭제"
                onClick={() => handleDelete(params.row.id)}
                showInMenu={false}
            />,
        ],
    },
];
