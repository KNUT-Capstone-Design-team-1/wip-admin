'use client';

import React from 'react';
import {DataGrid} from "@mui/x-data-grid";
import {Box} from "@mui/material";
import {createNoticeColumns} from "@/features/wipApplication/notice/components/NoticeColumns";
import {useNoticeStore} from "@/features/wipApplication/notice/store/useNoticeStore";

const NoticeGrid = ({ handleOpen, handleDelete }) => {
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
