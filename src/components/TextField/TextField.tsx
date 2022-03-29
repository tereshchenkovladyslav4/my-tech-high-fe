import styled from '@emotion/styled';
import { TextField as MuiTextField } from '@mui/material';
import React from 'react';
import { TextFieldTemplateType } from './types';

const CssTextField = styled(MuiTextField)({
    '& label.Mui-focused': {
        color: '#1a1a1a',
        background: "#ffffffc2"
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#1a1a1a36',
        borderRadius: 4
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: 4,
        '& fieldset': {
            borderColor: '#1a1a1a36',
        },
        '&:hover fieldset': {
            borderColor: '#0000003b',
            borderRadius: 4
        },
        '&.Mui-focused fieldset': {
            borderColor: '#1a1a1a69',
            borderRadius: 4
        },
    },
});

const TextField: TextFieldTemplateType = ({ value, onChange, label, size, variant, fullWidth, sx, style, placeholder }) => {
    return (
        <CssTextField
            label={label}
            placeholder={placeholder}
            size={size || "small"}
            variant={variant || "outlined"}
            fullWidth={fullWidth || true}
            value={value}
            onChange={(e: any) => onChange(e.target.value)}
            inputProps={{
                style: style
            }}
            sx={sx}
        />
    )
}

export { TextField as default };

