import React, { ReactElement, ReactNode } from 'react'
import { Theme } from '@emotion/react'
import { Box } from '@mui/material'
import { SxProps } from '@mui/system'
import { map } from 'lodash'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { AdditionalQuestionAction, MthColor } from '@mth/enums'

export type CheckBoxListVM = {
  label: string
  value: string
  action?: AdditionalQuestionAction
  disabled?: boolean
}

type MthCheckboxListProps = {
  title?: string
  checkboxLists: CheckBoxListVM[]
  values: string[]
  setValues: (value: string[]) => void
  haveSelectAll: boolean
  error?: ReactNode
  showError?: boolean
  disabled?: boolean
  labelSx?: SxProps<Theme>
  wrapSx?: SxProps<Theme>
}
const MthCheckboxList: React.FC<MthCheckboxListProps> = ({
  title,
  checkboxLists,
  values,
  setValues,
  haveSelectAll,
  error,
  showError,
  disabled,
  labelSx,
  wrapSx,
}) => {
  const handleChangeValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (haveSelectAll) {
      if (values.includes(e.target.value)) {
        setValues(values.filter((item) => item !== e.target.value).filter((item) => item !== 'all'))
      } else {
        const temp = [...values, e.target.value].filter((item) => !!item)
        if (temp.length == checkboxLists.length) {
          setValues(['all', ...values, e.target.value].filter((item) => !!item))
        } else {
          setValues(temp)
        }
      }
    } else {
      if (values.includes(e.target.value)) {
        setValues(values.filter((item) => item !== e.target.value && !!item))
      } else {
        setValues([...values, e.target.value].filter((item) => !!item))
      }
    }
  }

  const handleChangeAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setValues([...['all'], ...checkboxLists.map((item) => item.value.toString())])
    } else {
      setValues([])
    }
  }

  const renderLists = () =>
    map(checkboxLists, (list, index): ReactElement | undefined => {
      if (typeof list !== 'string') {
        return (
          <MthCheckbox
            key={index}
            label={list.label}
            checked={values.includes(list.value)}
            value={list.value}
            disabled={disabled || list.disabled === true}
            onChange={handleChangeValues}
            sx={{ my: '-4px' }}
            wrapSx={!!title ? { ...wrapSx, ml: -1.4 } : wrapSx}
            labelSx={labelSx}
          />
        )
      } else {
        return undefined
      }
    })

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 3,
        '.MuiFormControlLabel-root': {
          width: 'fit-content',
        },
      }}
    >
      {!!checkboxLists?.length && (
        <Box>
          {!!title && (
            <Paragraph size='large' fontWeight='700'>
              {title}
            </Paragraph>
          )}
          {showError && (
            <Subtitle size='small' color={MthColor.RED} fontWeight='700'>
              {error}
            </Subtitle>
          )}
        </Box>
      )}
      {haveSelectAll && !!checkboxLists?.length && (
        <MthCheckbox
          key={-1}
          label='Select All'
          checked={values.includes('all')}
          value='all'
          onChange={handleChangeAll}
          sx={{ my: '-4px' }}
          wrapSx={!!title ? { ...wrapSx, ml: -1.4 } : wrapSx}
          labelSx={labelSx}
        />
      )}
      {renderLists()}
    </Box>
  )
}

export default MthCheckboxList
