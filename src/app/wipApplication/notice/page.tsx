'use client';

import { useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Backdrop,
} from '@mui/material';
import { Campaign } from '@mui/icons-material';
import { useNoticeStore } from '@/features/wipApplication/notice/store/useNoticeStore';
import { useNoticeHandler } from '@/features/wipApplication/notice/hooks/useNoticeHandler';
import NoticeGrid from "@/features/wipApplication/notice/components/NoticeGrid";
import CreateNewContent from "@/features/wipApplication/notice/components/CreateNewContent";
import NoticeCreateEditBox from "@/features/wipApplication/notice/components/NoticeCreateEditBox";

export default function NoticePage() {
    const { fetchContents, isLoading } = useNoticeStore();

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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                        }}
                    >
                        <Campaign sx={{ color: 'white', fontSize: 28 }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>
                            공지사항 관리
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            공지사항을 생성, 수정, 삭제할 수 있습니다
                        </Typography>
                    </Box>
                </Box>
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

            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backdropFilter: 'blur(4px)',
                }}
                open={loading && !open}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <CircularProgress color="inherit" size={48} />
                    <Typography variant="body1" fontWeight={500}>
                        처리 중...
                    </Typography>
                </Box>
            </Backdrop>
        </Box>
    );
}
