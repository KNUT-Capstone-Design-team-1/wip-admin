'use client';

import React from 'react';
import {DataGrid} from "@mui/x-data-grid";
import {Box} from "@mui/material";
import {createNoticeColumns} from "@/features/wipApplication/notice/components/NoticeColumns";
import {useNoticeStore, Content} from "@/features/wipApplication/notice/store/useNoticeStore";

interface NoticeGridProps {
    handleOpen: (content?: Content) => void;
    handleDelete: (id: number) => void;
}

const NoticeGrid = ({ handleOpen, handleDelete }: NoticeGridProps) => {
    const { contents, isLoading: storeLoading } = useNoticeStore();
    const columns = createNoticeColumns({ handleOpen, handleDelete });

    return (
        <Box sx={{ height: 600, width: '100%', position: 'relative' }}>
            <DataGrid
                rows={contents}
                columns={columns}
                loading={storeLoading}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[5, 10, 20]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
};

export default NoticeGrid;
