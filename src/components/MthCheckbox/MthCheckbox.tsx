import React from 'react'
import { Theme } from '@emotion/react'
import { Checkbox, FormControlLabel } from '@mui/material'
import { CheckboxProps } from '@mui/material/Checkbox/Checkbox'
import { SxProps } from '@mui/system'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { MthColor } from '@mth/enums'

export interface MthCheckboxProps extends CheckboxProps {
  label?: string
  labelSx?: SxProps<Theme>
  wrapSx?: SxProps<Theme>
}

const MthCheckbox = (props: MthCheckboxProps): React.ReactElement => {
  const { label, labelSx, wrapSx, disabled, ...otherProps } = props

  const renderCheckbox = () => (
    <Checkbox
      {...otherProps}
      disabled={!!disabled}
      sx={{
        '&.Mui-checked, &.MuiCheckbox-indeterminate': {
          color: otherProps.color == 'secondary' ? MthColor.MTHBLUE : MthColor.SYSTEM_01,
        },
        '&:not(.Mui-disabled) .MuiSvgIcon-root': {
          color: otherProps.color == 'secondary' ? MthColor.MTHBLUE : MthColor.SYSTEM_01,
        },
        '&.Mui-disabled:not(.Mui-checked)': {
          position: 'relative',
          '&:before': {
            content: '""',
            position: 'absolute',
            width: otherProps.size == 'small' ? 16 : 18,
            height: otherProps.size == 'small' ? 16 : 18,
            borderRadius: '2px',
            border: 'solid 2px #A3A3A4',
            backgroundColor: MthColor.SYSTEM_07,
          },
          '& svg': {
            opacity: 0,
          },
        },
        '&.Mui-checked.Mui-disabled': {
          '& svg': {
            opacity: 0.5,
          },
        },
        ...otherProps.sx,
      }}
    />
  )

  return (
    <>
      {!!label ? (
        <FormControlLabel
          control={renderCheckbox()}
          label={
            <Paragraph
              size='large'
              sx={{ marginLeft: '12px', fontSize: '16px', fontWeight: '500', lineHeight: 1, ...labelSx }}
            >
              {label}
            </Paragraph>
          }
          sx={{
            '.MuiFormControlLabel-label.Mui-disabled': {
              color: 'unset',
            },
            ml: 0,
            mr: 0,
            ...wrapSx,
          }}
        />
      ) : (
        renderCheckbox()
      )}
    </>
  )
}

export default MthCheckbox
