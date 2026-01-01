'use client';

import { useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    FormControlLabel,
    Checkbox,
    CircularProgress,
    Backdrop,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNoticeStore } from '@/features/wipApplication/notice/store/useNoticeStore';
import { useNoticeHandler } from '@/features/wipApplication/notice/hooks/useNoticeHandler';
import { createNoticeColumns } from '@/features/wipApplication/notice/components/NoticeColumns';
import NoticeGrid from "@/features/wipApplication/notice/components/NoticeGrid";
import CreateNewContent from "@/features/wipApplication/notice/components/CreateNewContent";
import NoticeEditModal from "@/features/wipApplication/notice/components/NoticeEditModal";
import NoticeCreateEditBox from "@/features/wipApplication/notice/components/NoticeCreateEditBox";

export default function NoticePage() {
    const { fetchContents, isLoading } = useNoticeStore();

    // 커스텀 훅에서 모든 state와 handler 가져오기
    const {
        open,
        editingContent,
        formData,
        setFormData,
        loading,
        handleOpen,
        handleDelete,
        handleClose,
        handleSave,
    } = useNoticeHandler();

    useEffect(() => {
        fetchContents();
    }, [fetchContents]);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">공지사항 관리</Typography>
                <CreateNewContent handleOpen={handleOpen} />
            </Box>

            <NoticeGrid handleOpen={handleOpen} handleDelete={handleDelete}/>
            <NoticeCreateEditBox
                open={open}
                editingContent={editingContent}
                formData={formData}
                loading={loading}
                handleClose={handleClose}
                handleSave={handleSave}
            />

            {/* 전역 로딩 오버레이 (삭제 시 사용) */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading && !open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
}
