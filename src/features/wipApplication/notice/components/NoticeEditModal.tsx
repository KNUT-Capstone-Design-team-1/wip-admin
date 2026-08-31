import React from 'react';
import {Checkbox, DialogContent, FormControlLabel, TextField} from "@mui/material";
import type { NoticeFormData } from "@/features/wipApplication/notice/components/NoticeCreateEditBox";

interface NoticeEditModalProps {
    formData: NoticeFormData;
    setFormData: React.Dispatch<React.SetStateAction<NoticeFormData>>;
    loading: boolean;
}

const NoticeEditModal = ({ formData, setFormData, loading }: NoticeEditModalProps) => {
    return (
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="제목"
                fullWidth
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={loading}
                sx={{ mb: 2 }}
            />
            <TextField
                margin="dense"
                label="설명"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                }
                disabled={loading}
                sx={{ mb: 2 }}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={formData.mustRead === 1}
                        onChange={(e) =>
                            setFormData({ ...formData, mustRead: e.target.checked ? 1 : 0 })
                        }
                        disabled={loading}
                    />
                }
                label="필독 공지"
            />
        </DialogContent>
    );
};

export default NoticeEditModal;
