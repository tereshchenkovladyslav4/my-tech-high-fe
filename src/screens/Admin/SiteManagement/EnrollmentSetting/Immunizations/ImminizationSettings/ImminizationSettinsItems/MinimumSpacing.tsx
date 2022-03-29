import React from 'react'
import { Box, FormControl, MenuItem, Typography, Select, Divider, TextField, FormHelperText } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useStyles } from './style'
import { useFormikContext } from 'formik'
import { ImmunizationsData } from '../../Immunizations'

const MinimumSpacing: React.FC = () => {
  const styles = useStyles()
  const localValues: Array<string> = ['NONE', 'DAYS', 'WEEKS', 'MONTHS']

  const { values, setFieldValue, handleChange, touched, errors } = useFormikContext<ImmunizationsData>()

  if (!values.consecutive_vaccine || values.consecutive_vaccine < 1) return null

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
        Minimum Spacing
      </Typography>
      <Divider sx={{ borderColor: 'black' }} orientation='vertical' flexItem />
      <FormControl variant='outlined' classes={{ root: styles.formRoot }}>
        <TextField
          name='min_spacing_interval'
          value={values.min_spacing_interval || ''}
          onChange={handleChange}
          sx={{ width: '50px' }}
          inputProps={{
            style: { padding: 0 },
            min: 1,
            inputMode: 'numeric',
            pattern: '[1-9]*'
          }}
          type='number'
          disabled={values.min_spacing_date < 1}
        />
      </FormControl>
      <FormControl variant='outlined' classes={{ root: styles.formRoot }}>
        <Select
          name='min_spacing_date'
          IconComponent={KeyboardArrowDownIcon}
          classes={{ root: styles.selectRoot, icon: styles.icon }}
          MenuProps={{ classes: { paper: styles.selectPaper } }}
          value={values.min_spacing_date || 0}
          onChange={(e) => {
            if(!e.target.value) setFieldValue('min_spacing_interval', 0);
            handleChange(e);
          }}
        >
          {localValues.map((item, index) => (
            <MenuItem key={index} value={index}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* <FormHelperText error>{!values.min_spacing_interval && 'This field is required!'}</FormHelperText> */}
      <FormHelperText error>{touched.min_spacing_interval && errors.min_spacing_interval}</FormHelperText>
    </Box>
  )
}

export { MinimumSpacing as default }
