import React from 'react'
import { Box, FormControl, MenuItem, Typography, Select, Divider, FormHelperText, ListItemText, Checkbox } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useStyles } from './style'
import { ImmunizationsData } from '../../Immunizations'
import { useFormikContext } from 'formik'
import { getValidGrade } from '../../../../../EnrollmentPackets/EnrollmentPacketModal/helpers'

const RequireUpdate: React.FC = () => {
  const styles = useStyles()
  const { values, setFieldValue, handleChange, touched, errors } = useFormikContext<ImmunizationsData>()
  function getAvailableGrades() {
    const all = ['OR-K', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

    const max = values.max_grade_level ? getValidGrade(values.max_grade_level) : -2
    const min = values.min_grade_level ? getValidGrade(values.min_grade_level) : -2
    return all.filter((v) => (getValidGrade(v) <= max && getValidGrade(v) >= min))
  }
  const levelExempt = () => {
    try {
      let val: any = values.level_exempt_update || []
      val = typeof val === 'string' ? JSON.parse(val) : val
      if (!(val instanceof Array)) val = []
      const all = getAvailableGrades()
      val = val.filter((v) => all.includes(v))
      return val
    } catch (e) {
      // console.error(e.message);
      return []
    }
  }

  const parseGrade = (value: string) => {
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
        bgcolor: 'white',
        height: '35px',
        borderRadius: '10px',
        width: 'auto',
      }}
    >
      <Typography component='span' sx={{ width: '200px', textAlign: 'left' }}>
        Require Update if Exempt
      </Typography>
      <Divider sx={{ borderColor: 'black' }} orientation='vertical' flexItem />
      <FormControl variant='outlined' classes={{ root: styles.formRoot }}>
        <Select
          IconComponent={KeyboardArrowDownIcon}
          classes={{ root: styles.selectRoot, icon: styles.icon }}
          MenuProps={{ classes: { paper: styles.selectPaper } }}
          value={values.exempt_update !== undefined ? values.exempt_update : 'N/A'}
          name='exempt_update'
          onChange={handleChange}
        >
          {typeof values.exempt_update === 'undefined' && <MenuItem value='N/A'>Select</MenuItem>}
          <MenuItem value={1}>Yes</MenuItem>
          <MenuItem value={0}>No</MenuItem>
        </Select>
      </FormControl>

      {values.exempt_update === 1 && (
        <FormControl variant='outlined' classes={{ root: styles.formRoot }}
          disabled={!getAvailableGrades().length}
        >
          <Select
            IconComponent={KeyboardArrowDownIcon}
            classes={{ root: styles.selectRoot, icon: styles.icon }}
            MenuProps={{ classes: { paper: styles.selectPaper } }}
            value={levelExempt()}
            onChange={(e) => {
              setFieldValue('level_exempt_update', JSON.stringify(e.target.value))
            }}
            multiple
            inputProps={{ 'aria-label': 'Select Grade' }}
            displayEmpty
            renderValue={(s) => {
              if (s instanceof Array && s.length > 0) {
                return s.join(', ');
              }
              return '-- Select Grade --'
            }}
          >
            {getAvailableGrades()
              .map((g) => (
                <MenuItem key={g} value={g}>
                  <Checkbox checked={levelExempt()?.indexOf(g) > -1} />
                  <ListItemText primary={parseGrade(g)} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      )}
      <FormHelperText error>{
        (touched.exempt_update && errors.exempt_update) ||
        (values.exempt_update === 1 && touched.level_exempt_update && errors.level_exempt_update)
      }</FormHelperText>
    </Box>
  )
}

export { RequireUpdate as default }
