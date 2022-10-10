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
  const renderCheckbox = () => (
    <Checkbox
      {...props}
      sx={{
        '&.Mui-checked, &.MuiCheckbox-indeterminate': {
          color: props.color == 'secondary' ? MthColor.MTHBLUE : MthColor.SYSTEM_01,
        },
        '&:not(.Mui-disabled) .MuiSvgIcon-root': {
          color: props.color == 'secondary' ? MthColor.MTHBLUE : MthColor.SYSTEM_01,
        },
        '&.Mui-disabled': {
          position: 'relative',
          '&:before': {
            content: '""',
            position: 'absolute',
            width: props.size == 'medium' ? 18 : 16,
            height: props.size == 'medium' ? 18 : 16,
            borderRadius: '2px',
            border: 'solid 2px #A3A3A4',
            backgroundColor: MthColor.SYSTEM_07,
          },
          '& svg': {
            opacity: 0,
          },
        },
        ...props.sx,
      }}
    />
  )

  return (
    <>
      {!!props.label ? (
        <FormControlLabel
          control={renderCheckbox()}
          label={
            <Paragraph
              size='large'
              sx={{ marginLeft: '12px', fontSize: '16px', fontWeight: '500', lineHeight: 1, ...props.labelSx }}
            >
              {props.label}
            </Paragraph>
          }
          sx={{ ml: 0, mr: 0, ...props.wrapSx }}
        />
      ) : (
        renderCheckbox()
      )}
    </>
  )
}

export default MthCheckbox
