import React from 'react'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { Box, Stack, Tooltip } from '@mui/material'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { useStyles } from './styles'
import { CommonSelectType } from './types'

type CommonSelectProps = {
  index: number
  selectItem: CommonSelectType
  verticalDividHeight?: string
  hasDeleteIcon?: boolean
  dividerStyle?: { top?: string; bottom?: string; height?: string }
  handleDeleteAction?: () => void
  titleWidth?: string
  verticalLineHeight?: string
}

export const CommonSelect: React.FC<CommonSelectProps> = ({
  index,
  selectItem,
  verticalDividHeight,
  hasDeleteIcon,
  dividerStyle,
  titleWidth = '0px',
  handleDeleteAction,
  verticalLineHeight,
}) => {
  const classes = useStyles
  return (
    <Stack
      key={index}
      direction='row'
      spacing={1}
      sx={{ ...classes.selectBox, background: index % 2 == 0 ? '#FAFAFA' : '', position: 'relative' }}
    >
      <Subtitle
        size={16}
        fontWeight='600'
        textAlign='left'
        sx={{
          minWidth: hasDeleteIcon ? 150 : 200,
          width: hasDeleteIcon ? 150 : 200,
          paddingRight: titleWidth,
          color: MthColor.BLACK,
        }}
      >
        {selectItem?.name}
      </Subtitle>
      {hasDeleteIcon && handleDeleteAction && (
        <Box onClick={() => handleDeleteAction()}>
          <Tooltip title='Delete' placement='top'>
            <DeleteForeverOutlinedIcon
              sx={{ cursor: 'pointer', width: '40px', color: MthColor.GRAY }}
              fontSize='medium'
            />
          </Tooltip>
        </Box>
      )}
      {!(typeof selectItem?.name === 'string' && selectItem?.name.includes('Option')) && (
        <Box
          sx={{
            ...classes.verticalLine,
            height: verticalDividHeight ?? 'auto',
            ...dividerStyle,
            position: 'absolute',
            left: 215,
            minHeight: verticalLineHeight ? verticalLineHeight : '40px',
          }}
        ></Box>
      )}
      <Box sx={{ width: 'calc(100% - 230px)', paddingLeft: '8px' }}>{selectItem?.component}</Box>
    </Stack>
  )
}
