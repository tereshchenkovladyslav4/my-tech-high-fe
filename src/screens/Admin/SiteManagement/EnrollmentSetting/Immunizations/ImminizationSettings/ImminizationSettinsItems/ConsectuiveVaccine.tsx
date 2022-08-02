import React, { useContext, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Box, FormControl, MenuItem, Typography, Select, Divider, FormHelperText } from '@mui/material'
import { useFormikContext } from 'formik'
import { DataContext, ImmunizationsData } from '../../Immunizations'
import { useStyles } from './style'

const ConsecutiveVaccine: React.FC = () => {
  const { values, setFieldValue, handleChange, errors, touched } = useFormikContext<ImmunizationsData>()
  const [consecutiveVaccine, setConsecutiveVaccine] = useState(
    typeof values.consecutive_vaccine === 'undefined' ? 'Select' : values.consecutive_vaccine ? 'Yes' : 'No',
  )

  const styles = useStyles()

  const handleLocalChange = (event) => {
    const val = event.target.value
    setConsecutiveVaccine(val)
    if (val === 'No') {
      setFieldValue('consecutive_vaccine', 0)
    } else if (val === 'Yes') {
      setFieldValue('consecutive_vaccine', -1)
    }
  }
  const localValues: Array<string> = ['Yes', 'No']
  const data = useContext<ImmunizationsData[]>(DataContext)
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
      <Typography
        component='span'
        sx={{
          width: '200px',
          textAlign: 'left',
        }}
      >
        Consecutive Vaccine
      </Typography>
      <Divider sx={{ borderColor: 'black' }} orientation='vertical' flexItem />
      <FormControl variant='outlined' classes={{ root: styles.formRoot }}>
        <Select
          IconComponent={KeyboardArrowDownIcon}
          classes={{ root: styles.selectRoot, icon: styles.icon }}
          MenuProps={{ classes: { paper: styles.selectPaper } }}
          value={consecutiveVaccine}
          onChange={handleLocalChange}
        >
          {consecutiveVaccine === 'Select' && <MenuItem value='Select'>Select</MenuItem>}
          {localValues.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {consecutiveVaccine === 'Yes' && (
        <FormControl variant='outlined' classes={{ root: styles.formRoot }}>
          <Select
            name='consecutive_vaccine'
            IconComponent={KeyboardArrowDownIcon}
            classes={{ root: styles.selectRoot, icon: styles.icon }}
            MenuProps={{ classes: { paper: styles.selectPaper } }}
            value={values.consecutive_vaccine || 0}
            onChange={handleChange}
          >
            <MenuItem value={-1}>-- Select Immunization --</MenuItem>
            {data
              .filter((v) => v.is_enabled && values.id! !== v.id)
              .sort((a, b) => {
                return a.order - b.order
              })
              .map((item, index) => (
                <MenuItem key={index} value={Number(item.id)}>
                  {item.title}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      )}
      <FormHelperText error>{touched.consecutive_vaccine && errors.consecutive_vaccine}</FormHelperText>
    </Box>
  )
}

export { ConsecutiveVaccine as default }
