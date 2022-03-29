import React, { useContext } from 'react'
import { Box, FormControl, MenuItem, Typography, Select, Divider, FormHelperText } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useStyles } from './style'
import { ImmunizationsData, SchoolYears, YearsContext } from '../../Immunizations'
import { useFormikContext } from 'formik'

const MinimumGrade: React.FC = () => {
  const styles = useStyles()
  const { values, handleChange, touched, errors } = useFormikContext<ImmunizationsData>()
  const schoolYears = useContext<SchoolYears[]>(YearsContext)

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
      <Typography component='span' sx={{ minWidth: '200px' }}>
        Minimum School Year
      </Typography>
      <Divider sx={{ borderColor: 'black' }} orientation='vertical' flexItem />
      <FormControl variant='outlined' classes={{ root: styles.formRoot }}>
        <Select
          labelId='lbb'
          name='min_school_year_required'
          IconComponent={KeyboardArrowDownIcon}
          classes={{ root: styles.selectRoot, icon: styles.icon }}
          MenuProps={{ classes: { paper: styles.selectPaper } }}
          value={values.min_school_year_required !== undefined ? values.min_school_year_required : 'N/A'}
          onChange={handleChange}
        >
          {values.min_school_year_required === undefined && <MenuItem value='N/A'>Select</MenuItem>}
          <MenuItem value={0}>No Minimum</MenuItem>
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
      <FormHelperText error>{touched.min_school_year_required && errors.min_school_year_required}</FormHelperText>
    </Box>
  )
}

export { MinimumGrade as default }
