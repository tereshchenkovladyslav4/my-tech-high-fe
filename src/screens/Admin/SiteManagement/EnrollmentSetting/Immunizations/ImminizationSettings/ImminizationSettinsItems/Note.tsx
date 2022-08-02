import React, { useState } from 'react'
import { Box, FormControl, Typography, Divider, TextField, Button, FormHelperText } from '@mui/material'
import { useFormikContext } from 'formik'
import { ImmunizationsData } from '../../Immunizations'
import { useStyles } from './style'

const MinimumGrade: React.FC = () => {
  const styles = useStyles()
  const { values, handleChange, errors, touched } = useFormikContext<ImmunizationsData>()
  const [focused, setFocused] = useState(false)

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
        width: '93%',
      }}
    >
      <Typography component='span' sx={{ marginRight: '110px', textAlign: 'left' }}>
        Note/Tooltip
      </Typography>
      <Divider sx={{ borderColor: 'black' }} orientation='vertical' flexItem />
      <FormControl sx={{ width: focused ? '80%' : undefined }} variant='outlined' classes={{ root: styles.formRoot }}>
        {!focused ? (
          values.tooltip === '' ? (
            <Button
              onClick={() => setFocused(true)}
              sx={{ color: '#4145FF', padding: 0, marginLeft: '-11px', fontSize: '16px' }}
            >
              Select
            </Button>
          ) : (
            <Typography onClick={() => setFocused(true)}>{values.tooltip || ''}</Typography>
          )
        ) : (
          <TextField
            name='tooltip'
            value={values.tooltip || ''}
            onChange={handleChange}
            id='standard-basic'
            variant='standard'
            InputProps={{
              disableUnderline: true,
            }}
            // sx={{ width: '60vw' }}
            fullWidth={true}
          />
        )}
      </FormControl>
      <FormHelperText error>{touched.tooltip && errors.tooltip}</FormHelperText>
    </Box>
  )
}

export { MinimumGrade as default }
