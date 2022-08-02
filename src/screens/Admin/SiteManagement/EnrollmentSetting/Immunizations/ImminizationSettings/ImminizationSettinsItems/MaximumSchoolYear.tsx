import React, { useContext } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Box, FormControl, MenuItem, Typography, Select, Divider, FormHelperText } from '@mui/material'
import { useFormikContext } from 'formik'
import { ImmunizationsData, SchoolYears, YearsContext } from '../../Immunizations'
import { useStyles } from './style'

const MaximumSchoolYear: React.FC = () => {
  const styles = useStyles()
  const { values, handleChange, errors, touched } = useFormikContext<ImmunizationsData>()
  const schoolYears = useContext<SchoolYears[]>(YearsContext)

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
        textAlign: 'center',
        width: 'auto',
      }}
    >
      <Typography component='span' sx={{ width: '200px', textAlign: 'left' }}>
        Maximum School Year
      </Typography>
      <Divider sx={{ borderColor: 'black' }} orientation='vertical' flexItem />
      <FormControl variant='outlined' classes={{ root: styles.formRoot }}>
        <Select
          name='max_school_year_required'
          IconComponent={KeyboardArrowDownIcon}
          classes={{ root: styles.selectRoot, icon: styles.icon }}
          MenuProps={{ classes: { paper: styles.selectPaper } }}
          value={values.max_school_year_required !== undefined ? values.max_school_year_required : 'N/A'}
          onChange={handleChange}
        >
          {values.max_school_year_required === undefined && <MenuItem value='N/A'>Select</MenuItem>}
          <MenuItem value={0}>No Maximum</MenuItem>
          {schoolYears.map((year) => {
            const date_begin = new Date(year.date_begin).getFullYear().toString()
            const date_end = new Date(year.date_end).getFullYear().toString()
            return (
              <MenuItem key={year.school_year_id} value={parseInt(year.school_year_id)}>
                {`${date_begin}-${date_end.substring(2, 4)}`}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
      <FormHelperText error>{touched.max_school_year_required && errors.max_school_year_required}</FormHelperText>
    </Box>
  )
}

export { MaximumSchoolYear as default }
