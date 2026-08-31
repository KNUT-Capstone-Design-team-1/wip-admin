import React from 'react';
import {Button} from "@mui/material";
import {Add as AddIcon} from "@mui/icons-material";

interface CreateNewContentProps {
    handleOpen: () => void;
}

const CreateNewContent = ({ handleOpen }: CreateNewContentProps) => {
    return (
        <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
        >
            새 콘텐츠
        </Button>
    );
};

export default CreateNewContent;
