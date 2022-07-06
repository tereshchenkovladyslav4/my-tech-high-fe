import React from 'react'
import { Box, Checkbox, FormControlLabel } from '@mui/material'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { map } from 'lodash'
import { useStyles } from './styles'

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
const CheckBoxList = ({ title, checkboxLists, values, setValues, haveSelectAll }: CheckBoxListProps) => {
  const classes = useStyles
  const handleChangeValues = (e: any) => {
    if (haveSelectAll) {
      if (values.includes(e.target.value)) {
        setValues(values.filter((item) => item !== e.target.value).filter((item) => item !== 'all'))
      } else {
        let temp = [...values, e.target.value].filter((item) => !!item)
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

  const handleChangeAll = (e: any) => {
    if (e.target.checked) {
      setValues([...['all'], ...checkboxLists.map((item) => item.value.toString())])
    } else {
      setValues([])
    }
  }

  const renderLists = () =>
    map(checkboxLists, (list, index) => {
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
      }
    })

  return (
    <Box sx={classes.container}>
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
