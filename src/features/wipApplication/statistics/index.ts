export const getStatusColor = (status: string) => {
    switch (status) {
        case 'published':
            return 'success';
        case 'draft':
            return 'warning';
        case 'archived':
            return 'default';
        default:
            return 'default';
    }
};

export const getStatusLabel = (status: string) => {
    switch (status) {
        case 'published':
            return '게시됨';
        case 'draft':
            return '임시저장';
        case 'archived':
            return '보관됨';
        default:
            return status;
    }
};
