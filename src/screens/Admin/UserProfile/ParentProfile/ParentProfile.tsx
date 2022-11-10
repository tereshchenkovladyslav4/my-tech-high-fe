import React, { FunctionComponent, useEffect, useState } from 'react'
import { Button, Checkbox, FormControlLabel, Grid, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { BUTTON_LINEAR_GRADIENT } from '../../../../utils/constants'
import { STATES_WITH_ABBREVIATION } from '../../../../utils/states'
import { phoneFormat } from '../../../../utils/utils'

type ParentProfileProps = {
  userInfo: unknown
  setUserInfo: (_: unknown) => void
  phoneInfo: unknown
  setPhoneInfo: (_: unknown) => void
  notes: unknown
  setNotes: (_: unknown) => void
  applicationState: unknown
}
export const ParentProfile: FunctionComponent<ParentProfileProps> = ({
  userInfo,
  setUserInfo,
  phoneInfo,
  setPhoneInfo,
  notes,
  setNotes,
  applicationState,
}) => {
  const [preferedFirstName, setPreferredFirstName] = useState('')
  const [preferedLastName, setPreferredLastName] = useState('')

  const [legalFirstName, setLegalFirstName] = useState('')
  const [legalMiddleName, setLegalMiddleName] = useState('')
  const [legalLastName, setLegalLastName] = useState('')

  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')
  const [street1, setStreet1] = useState('')
  const [street2, setStreet2] = useState('')
  const [state, setState] = useState('')
  const [canMessage, setCanMessage] = useState(false)

  useEffect(() => {
    if (userInfo) {
      const stateSelected = userInfo.address.state || applicationState
      setEmail(userInfo.email)
      setPreferredFirstName(userInfo.preferred_first_name || '')
      setPreferredLastName(userInfo.preferred_last_name || '')
      setLegalFirstName(userInfo.first_name || '')
      setLegalLastName(userInfo.last_name || '')
      setLegalMiddleName(userInfo.middle_name || '')
      setCity(userInfo.address.city || '')
      setState(STATES_WITH_ABBREVIATION[stateSelected])
      setStreet1(userInfo.address.street || '')
      setStreet2(userInfo.address.street2 || '')
      setZip(userInfo.address.zip || '')
    }
    setPhone(phoneFormat(phoneInfo?.number + '') || '')
    if (phoneInfo?.ext) {
      setCanMessage(true)
    }
  }, [userInfo])
  return (
    <Box
      sx={{
        marginTop: '24px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Button
          sx={{
            background: BUTTON_LINEAR_GRADIENT,
            textTransform: 'none',
            color: 'white',
            marginRight: 5,
            width: '264px',
            height: '34px',
            borderRadius: 2,
          }}
        >
          Reimbursements
        </Button>
        <Button
          sx={{
            background: BUTTON_LINEAR_GRADIENT,
            textTransform: 'none',
            color: 'white',
            marginRight: 2,
            width: '264px',
            height: '34px',
            borderRadius: 2,
          }}
        >
          Homeroom Resources
        </Button>
      </Box>
      <Grid container marginTop={4} columnSpacing={4} rowSpacing={3}>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left'>
            Preferred First Name
          </Paragraph>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={preferedFirstName}
            onChange={(e) => {
              setPreferredFirstName(e.target.value)
              setUserInfo({ ...userInfo, ...{ preferred_first_name: e.target.value } })
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left'>
            Preferred Last Name
          </Paragraph>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={preferedLastName}
            onChange={(e) => {
              setPreferredLastName(e.target.value)
              setUserInfo({ ...userInfo, ...{ preferred_last_name: e.target.value } })
            }}
          />
        </Grid>
      </Grid>
      <Grid container marginTop={0} columnSpacing={4} rowSpacing={3}>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left'>
            Legal First Name
          </Paragraph>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={legalFirstName}
            onChange={(e) => {
              setLegalFirstName(e.target.value)
              setUserInfo({ ...userInfo, ...{ first_name: e.target.value } })
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left'>
            Legal Middle Name
          </Paragraph>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={legalMiddleName}
            onChange={(e) => {
              setLegalMiddleName(e.target.value)
              setUserInfo({ ...userInfo, ...{ middle_name: e.target.value } })
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left'>
            Legal Last Name
          </Paragraph>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={legalLastName}
            onChange={(e) => {
              setLegalLastName(e.target.value)
              setUserInfo({ ...userInfo, ...{ last_name: e.target.value } })
            }}
          />
        </Grid>
      </Grid>
      <Grid container marginTop={0} columnSpacing={4} rowSpacing={3}>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left'>
            Phone
          </Paragraph>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <TextField
              size='small'
              variant='outlined'
              fullWidth
              value={phoneFormat(phone + '')}
              onChange={(e) => {
                setPhone(phoneFormat(e.target.value + ''))
                setPhoneInfo({ ...phoneInfo, ...{ number: phoneFormat(e.target.value + '') } })
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={canMessage}
                  onChange={(e) => {
                    setCanMessage(e.target.checked)
                    setPhoneInfo({ ...phoneInfo, ...{ ext: e.target.checked ? '1' : null } })
                  }}
                />
              }
              label={<Paragraph>I can receive text messages via this number</Paragraph>}
            />
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left'>
            Email
          </Paragraph>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setUserInfo({ ...userInfo, ...{ email: e.target.value } })
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left'>
            City
          </Paragraph>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={city}
            onChange={(e) => {
              setCity(e.target.value)
              setUserInfo({ ...userInfo, address: { ...userInfo.address, city: e.target.value } })
            }}
          />
        </Grid>
      </Grid>
      <Grid container marginTop={0} columnSpacing={4} rowSpacing={3}>
        <Grid item xs={6}>
          <Paragraph size='medium' textAlign='left'>
            Address line 1
          </Paragraph>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={street1}
            onChange={(e) => {
              setStreet1(e.target.value)
              setUserInfo({ ...userInfo, address: { ...userInfo.address, street: e.target.value } })
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left'>
            State
          </Paragraph>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={state}
            onChange={(e) => {
              setState(e.target.value)
              setUserInfo({ ...userInfo, address: { ...userInfo.address, state: e.target.value } })
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left'>
            Zip
          </Paragraph>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={zip}
            onChange={(e) => {
              setZip(e.target.value)
              setUserInfo({ ...userInfo, address: { ...userInfo.address, zip: e.target.value } })
            }}
          />
        </Grid>
      </Grid>
      <Grid container marginTop={0} columnSpacing={4} rowSpacing={3}>
        <Grid item xs={6}>
          <Paragraph size='medium' textAlign='left'>
            Address line 2
          </Paragraph>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={street2}
            onChange={(e) => {
              setStreet2(e.target.value)
              setUserInfo({ ...userInfo, address: { ...userInfo.address, street2: e.target.value } })
            }}
          />
        </Grid>
      </Grid>
      <Grid container marginTop={0} columnSpacing={4} rowSpacing={3}>
        <Grid item xs={7}>
          <Subtitle fontWeight='700' size='large' textAlign='left'>
            Notes
          </Subtitle>
          <TextField
            size='small'
            variant='outlined'
            fullWidth
            value={notes || ''}
            onChange={(e) => {
              setNotes(e.target.value)
            }}
            multiline
            rows={8}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
