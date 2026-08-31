import React from 'react';
import {Button, CircularProgress, Dialog, DialogActions, DialogTitle} from "@mui/material";
import NoticeEditModal from "@/features/wipApplication/notice/components/NoticeEditModal";
import type { Content } from "@/features/wipApplication/notice/store/useNoticeStore";

export interface NoticeFormData {
    title: string;
    description: string;
    mustRead?: number;
}

interface NoticeCreateEditBoxProps {
    open: boolean;
    editingContent: Content | null;
    formData: NoticeFormData;
    setFormData: React.Dispatch<React.SetStateAction<NoticeFormData>>;
    loading: boolean;
    handleClose: () => void;
    handleSave: () => void;
}

const NoticeCreateEditBox = ({
    open,
    editingContent,
    formData,
    setFormData,
    loading,
    handleClose,
    handleSave
}: NoticeCreateEditBoxProps) => {
    return (
        <Dialog open={open} onClose={loading ? undefined : handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {editingContent ? '콘텐츠 수정' : '새 콘텐츠 추가'}
            </DialogTitle>
            <NoticeEditModal formData={formData} setFormData={setFormData} loading={loading}/>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>취소</Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {loading ? '처리 중...' : (editingContent ? '수정' : '추가')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NoticeCreateEditBox;
