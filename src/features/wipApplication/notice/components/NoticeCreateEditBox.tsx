import React from 'react';
import {Button, CircularProgress, Dialog, DialogActions, DialogTitle} from "@mui/material";
import NoticeEditModal from "@/features/wipApplication/notice/components/NoticeEditModal";

const NoticeCreateEditBox = ({
    open,
    editingContent,
    formData,
    loading,
    handleClose,
    handleSave
}: any) => {
    return (
        <Dialog open={open} onClose={loading ? undefined : handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {editingContent ? '콘텐츠 수정' : '새 콘텐츠 추가'}
            </DialogTitle>
            <NoticeEditModal formData={formData} loading={loading}/>
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
