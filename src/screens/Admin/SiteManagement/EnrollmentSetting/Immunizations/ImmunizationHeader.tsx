import { Box, Button, IconButton, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import React from 'react'
import { SxProps } from '@mui/system'
import { useHistory } from 'react-router-dom'
import { useFormikContext } from 'formik'
import { ImmunizationsData } from './Immunizations'

export interface ImmunizationHeaderProps {
  title: string | null
  withSave: boolean
  enabledState: boolean
  onEnabledChange: (is_enabled: boolean) => void
  backUrl: string
}

export interface EnableDisableToggleProps {
  enabledState: boolean
  onEnabledChange: (is_enabled: boolean) => void
}

const EnableDisableToggle: React.FC<EnableDisableToggleProps> = ({ enabledState, onEnabledChange }) => {
  const toggleStyle: SxProps = {
    width: '240px',
    height: '46px',
    bgcolor: '#FAFAFA',
    '& .MuiToggleButtonGroup-grouped': {
      border: 0,
      '&:not(:first-of-type)': {
        borderRadius: '54px',
      },
      '&:first-of-type': {
        borderRadius: '54px',
      },
      '&.Mui-selected': {
        bgcolor: 'Black',
        color: 'white',
        '&:hover': {
          bgcolor: 'black',
        },
      },
      '&:hover': {
        bgcolor: 'unset',
      },
    },
    padding: '5px',
    borderRadius: '54px',
  }
  const formik = useFormikContext<ImmunizationsData>()

  return (
    <>
      <ToggleButtonGroup
        aria-label='Immunizations status'
        exclusive
        value={enabledState}
        onChange={(_, newState) => {
          if (newState !== null) {
            onEnabledChange(newState)
            if (formik) formik.setFieldValue('is_enabled', newState)
          }
        }}
        fullWidth
        sx={toggleStyle}
      >
        <ToggleButton value={true} aria-label='Enabled'>
          Enabled
        </ToggleButton>
        <ToggleButton value={false} aria-label='Enabled'>
          Disabled
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  )
}

const Title: React.FC = () => {
  const { values, handleChange, errors, touched } = useFormikContext<ImmunizationsData>()

  return (
    <TextField
      id='title'
      name='title'
      variant='standard'
      sx={{
        textAlign: 'center'
      }}
      InputProps={{
        disableUnderline: true,
      }}
      placeholder='Name'
      value={values.title || ''}
      onChange={handleChange}
      error={touched.title && !!errors.title}
      helperText={touched.title && errors.title}
    />
  )
}

const SaveButton = () => {
  const context = useFormikContext<ImmunizationsData>()
  if (!context) return null
  const { submitForm } = context

  return (
    <Button
      onClick={async () => submitForm()}
      sx={{
        background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%), #4145FF',
        color: 'white',
        marginLeft: '20px',
        width: '90px',
        height: '25px',
        '&:hover': {
          backgroundColor: '#4145FF',
        },
        borderRadius: '8px',
      }}
    >
      Save
    </Button>
  )
}

const ImmunizationHeader: React.FC<ImmunizationHeaderProps> = ({
  title,
  withSave,
  enabledState,
  onEnabledChange,
  backUrl,
}) => {
  const history = useHistory()

  return (
    <Box paddingY='13px' paddingX='20px' display='flex' justifyContent='space-between'>
      <Box>
        <IconButton
          onClick={() => history.push(backUrl)}
          sx={{
            position: 'relative',
            bottom: '2px',
          }}
        >
          <ArrowBackIosRoundedIcon sx={{ fontSize: '15px' }} />
        </IconButton>
        {withSave ? (
          <Title />
        ) : (
          <Typography paddingLeft='7px' fontSize='20px' component='span'>
            {title}
          </Typography>
        )}
        {withSave && <SaveButton />}
      </Box>
      <Box>
        <EnableDisableToggle enabledState={enabledState} onEnabledChange={onEnabledChange} />
      </Box>
    </Box>
  )
}

export { ImmunizationHeader as default, EnableDisableToggle }
