import React, { ReactElement, ReactNode } from 'react'
import { Box, Checkbox, FormControlLabel } from '@mui/material'
import { map } from 'lodash'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'

export type CheckBoxListVM = {
  label: string
  value: string
}

type MthCheckboxListProps = {
  title?: string
  checkboxLists: CheckBoxListVM[]
  values: string[]
  setValues: (value: string[]) => void
  haveSelectAll: boolean
  error?: ReactNode
  showError?: boolean
}
const MthCheckboxList: React.FC<MthCheckboxListProps> = ({
  title,
  checkboxLists,
  values,
  setValues,
  haveSelectAll,
  error,
  showError,
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
          <FormControlLabel
            key={index}
            sx={{ height: 30, width: 'max-content' }}
            control={
              <Checkbox checked={values.includes(list.value)} value={list.value} onChange={handleChangeValues} />
            }
            label={
              <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                {list.label}
              </Paragraph>
            }
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
        <FormControlLabel
          sx={{ height: 30, width: 'max-content' }}
          control={<Checkbox value='all' checked={values.includes('all')} onChange={handleChangeAll} />}
          label={
            <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
              Select All
            </Paragraph>
          }
        />
      )}
      {renderLists()}
    </Box>
  )
}

export default MthCheckboxList
