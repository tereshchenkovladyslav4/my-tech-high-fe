import React from 'react'
import { Box, FormControl, MenuItem, Typography, Select, Divider, FormHelperText } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useStyles } from './style'
import { ImmunizationsData } from '../../Immunizations'
import { useFormikContext } from 'formik'

const MinimumGrade: React.FC = () => {
  const styles = useStyles()
  const { values: formikValues, handleChange, errors, touched } = useFormikContext<ImmunizationsData>()
  const values: Array<string> = ['OR-K', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  const parseValue = (value: string) => {
    if (value === 'OR-K') return 'OR - Kindergarten (5)'
    if (value === 'K') return 'Kindergarten (5)'
    const numberValue = parseInt(value)
    if (numberValue === 1) return '1st grade (6)'
    if (numberValue === 2) return '2nd grade (7)'
    if (numberValue === 3) return '3rd grade (8)'

    return `${value}th grade (${value !== '12' ? numberValue + 5 : `${numberValue + 5}/${numberValue + 6}`})`
  }

  return (
    <Box
      sx={{
        display: 'flex',
        padding: '5px',
        marginY: '10px',
        marginX: '33px',
        bgcolor: '#FAFAFA',
        height: '35px',
        borderRadius: '10px',
        textAlign: 'center',
        width: 'auto',
      }}
    >
      <Typography component='span' sx={{ width: '200px', textAlign: 'left' }}>
        Minimum Grade
      </Typography>
      <Divider sx={{ borderColor: 'black' }} orientation='vertical' flexItem />
      <FormControl variant='outlined' classes={{ root: styles.formRoot }}>
        <Select
          name='min_grade_level'
          IconComponent={KeyboardArrowDownIcon}
          classes={{ root: styles.selectRoot, icon: styles.icon }}
          MenuProps={{ classes: { paper: styles.selectPaper } }}
          value={formikValues.min_grade_level || 'N/A'}
          onChange={handleChange}
        >
          {!formikValues.min_grade_level && (
            <MenuItem key={-1} value='N/A'>
              Select
            </MenuItem>
          )}
          {values.map((item, index) => (
            <MenuItem key={index} value={item}>
              {parseValue(item)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormHelperText error>{touched.min_grade_level && errors.min_grade_level}</FormHelperText>
    </Box>
  )
}

export { MinimumGrade as default }
