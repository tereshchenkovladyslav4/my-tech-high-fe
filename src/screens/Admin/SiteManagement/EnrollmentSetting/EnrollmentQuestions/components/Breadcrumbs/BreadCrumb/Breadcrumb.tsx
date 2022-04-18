import { Box, FormControlLabel, Checkbox } from '@mui/material'
import { useFormikContext } from 'formik'
import React, {useEffect, useState} from 'react'
import { EnrollmentQuestionTab } from '../../../types'
import { BreadcrumbTemplateType } from './types'

export const Breadcrumb: BreadcrumbTemplateType = ({ title, active, idx, handleClick }) => {
  const showBorder = active ? '#4145FF' : '#EEF4F8'
  const [checked, setChecked] = useState(true)

  const {values, setValues} = useFormikContext<EnrollmentQuestionTab[]>()

  useEffect(() => {
    values.map((v) => {
      if(v.tab_name === title) {
        setChecked(v.is_active)
      }
    })
  }, [values])

  const handleActiveTab = (event: React.ChangeEvent<HTMLInputElement>) => {
    const item = values.map((v) => {
      if(v.tab_name === title) {
        setChecked(event.target.checked)
        return {...v, is_active: !v.is_active}
      }
      return v
    })
    setValues(item)
  }

  return (
    <Box style={{ borderColor: showBorder, cursor:'pointer' }} borderBottom={4} display='inline-block' onClick={() => handleClick(idx)}>
      <FormControlLabel
        value="bottom"
        control={<Checkbox checked={checked} onChange={handleActiveTab}/>}
        label={title}
        labelPlacement="bottom"
        sx={{
          '& .MuiFormControlLabel-label': {
            fontSize: '0.7rem',
            fontWeight: '800',
          }
          
        }}
      />      
    </Box>
  )
}
