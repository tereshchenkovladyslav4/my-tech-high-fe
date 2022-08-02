import React, { FunctionComponent, ReactElement } from 'react'
import { Box, Checkbox, FormControlLabel } from '@mui/material'
import { map } from 'lodash'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { checkBoxListClassess } from './styles'

export type CheckBoxListVM = {
  label: string
  value: string
}

type CheckBoxListProps = {
  title: string
  checkboxLists: CheckBoxListVM[]
  values: string[]
  setValues: (value: string[]) => void
  haveSelectAll: boolean
}
const CheckBoxList: FunctionComponent<CheckBoxListProps> = ({
  title,
  checkboxLists,
  values,
  setValues,
  haveSelectAll,
}) => {
  const handleChangeValues = (e: unknown) => {
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

  const handleChangeAll = (e: unknown) => {
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
            sx={{ height: 30 }}
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
    <Box sx={checkBoxListClassess.container}>
      <Paragraph size='large' fontWeight='700'>
        {title}
      </Paragraph>
      {haveSelectAll && (
        <FormControlLabel
          sx={{ height: 30 }}
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

export default CheckBoxList
