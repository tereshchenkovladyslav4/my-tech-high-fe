import { FunctionComponent } from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material';

type TextFieldProps = {
    label?: string
    onChange: (value: React.SetStateAction<string>) => void
    sx?: SxProps<Theme> | undefined
    size?: 'small' | 'medium',
    defaultValue?: any
    value?: string,
    variant?: "outlined" | "filled" | "standard",
    disabled?: boolean
    fullWidth?: boolean
    style?: any
    placeholder?: string
}

export type TextFieldTemplateType = FunctionComponent<TextFieldProps>