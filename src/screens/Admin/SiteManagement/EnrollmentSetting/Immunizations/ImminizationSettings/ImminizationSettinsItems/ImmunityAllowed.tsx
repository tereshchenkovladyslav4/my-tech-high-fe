import React from 'react'
import { Box, FormControl, MenuItem, Typography, Select, Divider, FormHelperText } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useStyles } from './style'
import { ImmunizationsData } from '../../Immunizations'
import { useFormikContext } from 'formik'

const ImmunityAllowed: React.FC = () => {
  const styles = useStyles()
  const { values, handleChange, errors, touched } = useFormikContext<ImmunizationsData>()

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
        Immunity Allowed
      </Typography>
      <Divider sx={{ borderColor: 'black' }} orientation='vertical' flexItem />
      <FormControl variant='outlined' classes={{ root: styles.formRoot }}>
        <Select
          name='immunity_allowed'
          IconComponent={KeyboardArrowDownIcon}
          classes={{ root: styles.selectRoot, icon: styles.icon }}
          MenuProps={{ classes: { paper: styles.selectPaper } }}
          value={values.immunity_allowed !== undefined ? values.immunity_allowed : 'N/A'}
          onChange={handleChange}
        >
          {values.immunity_allowed === undefined && <MenuItem value='N/A'>Select</MenuItem>}
          <MenuItem value={1}>Yes</MenuItem>
          <MenuItem value={0}>No</MenuItem>
        </Select>
      </FormControl>
      <FormHelperText error>{touched.immunity_allowed && errors.immunity_allowed}</FormHelperText>
    </Box>
  )
}

export { ImmunityAllowed as default }
