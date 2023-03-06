import React, { useEffect, useState, useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Button, Checkbox, FormControlLabel, Grid, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { useFlag } from '@unleash/proxy-client-react'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { STATES_WITH_ABBREVIATION } from '@mth/constants'
import { EPIC_667_STORY_1387 } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { phoneFormat } from '@mth/utils'
import { getCountiesByRegionId, getSchoolDistrictsByRegionId } from '../services'
import { useStyles } from '../styles'

type ParentProfileProps = {
  userInfo: unknown
  setUserInfo: (_: unknown) => void
  phoneInfo: unknown
  setPhoneInfo: (_: unknown) => void
  notes: unknown
  setNotes: (_: unknown) => void
  applicationState: unknown
}
export const ParentProfile: React.FC<ParentProfileProps> = ({
  userInfo,
  setUserInfo,
  phoneInfo,
  setPhoneInfo,
  notes,
  setNotes,
  applicationState,
}) => {
  const { me } = useContext(UserContext)
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
  const [county, setCounty] = useState(0)
  const [school_district, setSchoolDistrict] = useState('')
  const [state, setState] = useState('')
  const [canMessage, setCanMessage] = useState(false)
  const classes = useStyles
  const infoctr1387 = useFlag(EPIC_667_STORY_1387)

  const { loading: countyLoading, data: countyData } = useQuery(getCountiesByRegionId, {
    variables: { regionId: Number(me?.selectedRegionId) },
    fetchPolicy: 'network-only',
  })

  const [counties, setCounties] = useState([])
  const [clickedEvent, setClickedEvent] = useState({})
  const [warningPopup, setWarningPopup] = useState(false)
  const [ableToEdit, setAbleToEdit] = useState(false)
  const [selectedDrop, setSelectedDrop] = useState('')
  const [selectedValue, setSelectedValue] = useState('')

  const setCancelWarningPopup = () => {
    setWarningPopup(false)
    setAbleToEdit(false)
  }

  const setConfirmWarningPopup = () => {
    setWarningPopup(false)
    if (selectedDrop == 'County') {
      setCounty(Number(selectedValue))
      setUserInfo({ ...userInfo, address: { ...userInfo.address, county_id: Number(selectedValue) } })
    } else if (selectedDrop == 'School District') {
      setSchoolDistrict(selectedValue)
      setUserInfo({ ...userInfo, address: { ...userInfo.address, school_district: selectedValue } })
    } else {
      setAbleToEdit(true)
    }
    setSelectedValue('')
    setSelectedDrop('')
  }

  useEffect(() => {
    if (ableToEdit == true) clickedEvent.target.focus()
  }, [ableToEdit])

  const setFocused = (event) => {
    if (!ableToEdit || clickedEvent.target != event.target) {
      event.preventDefault()
      event.target.blur()
      setClickedEvent(event)
      setWarningPopup(true)
    }
  }

  const setBlured = () => {
    setAbleToEdit(false)
  }

  useEffect(() => {
    if (!countyLoading && countyData?.getCounties) {
      setCounties(
        countyData.getCounties.map((v) => {
          return { label: v.county_name, value: Number(v.id) }
        }),
      )
    }
  }, [countyData])

  const { loading: schoolDistrictsDataLoading, data: schoolDistrictsData } = useQuery(getSchoolDistrictsByRegionId, {
    variables: {
      regionId: Number(me?.selectedRegionId),
    },
    skip: Number(me?.selectedRegionId) ? false : true,
    fetchPolicy: 'network-only',
  })
  const [schoolDistricts, setSchoolDistricts] = useState<Array<DropDownItem>>([])

  useEffect(() => {
    if (!schoolDistrictsDataLoading && schoolDistrictsData?.schoolDistrict.length > 0) {
      setSchoolDistricts(
        schoolDistrictsData?.schoolDistrict.map((d) => {
          return { label: d.school_district_name, value: d.school_district_name }
        }),
      )
    }
  }, [schoolDistrictsDataLoading])

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
      setCounty(userInfo.address.county_id || 0)
      setSchoolDistrict(userInfo.address.school_district || '')
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
            background: MthColor.BUTTON_LINEAR_GRADIENT,
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
            background: MthColor.BUTTON_LINEAR_GRADIENT,
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
          <Paragraph size='medium' textAlign='left' sx={infoctr1387 ? classes.label : undefined}>
            Preferred First Name
          </Paragraph>
          <TextField
            sx={infoctr1387 ? classes.text : undefined}
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
          <Paragraph size='medium' textAlign='left' sx={infoctr1387 ? classes.label : undefined}>
            Preferred Last Name
          </Paragraph>
          <TextField
            sx={infoctr1387 ? classes.text : undefined}
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
          <Paragraph size='medium' textAlign='left' sx={infoctr1387 ? classes.label : undefined}>
            Legal First Name
          </Paragraph>
          <TextField
            sx={infoctr1387 ? classes.text : undefined}
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
          <Paragraph size='medium' textAlign='left' sx={infoctr1387 ? classes.label : undefined}>
            Legal Middle Name
          </Paragraph>
          <TextField
            sx={infoctr1387 ? classes.text : undefined}
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
          <Paragraph size='medium' textAlign='left' sx={infoctr1387 ? classes.label : undefined}>
            Legal Last Name
          </Paragraph>
          <TextField
            sx={infoctr1387 ? classes.text : undefined}
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
          <Paragraph size='medium' textAlign='left' sx={infoctr1387 ? classes.label : undefined}>
            Phone
          </Paragraph>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <TextField
              sx={infoctr1387 ? classes.text : undefined}
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
              label={
                <Paragraph sx={infoctr1387 ? classes.checkBox : undefined}>
                  I can receive text messages via this number
                </Paragraph>
              }
            />
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left' sx={infoctr1387 ? classes.label : undefined}>
            Email
          </Paragraph>
          <TextField
            sx={infoctr1387 ? classes.text : undefined}
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
      </Grid>
      <Grid container marginTop={0} columnSpacing={4} rowSpacing={3}>
        <Grid item xs={6}>
          <Paragraph size='medium' textAlign='left' sx={infoctr1387 ? classes.label : undefined}>
            Address Line 1
          </Paragraph>
          <TextField
            sx={infoctr1387 ? classes.text : undefined}
            size='small'
            variant='outlined'
            fullWidth
            value={street1}
            onFocus={(e) => {
              if (infoctr1387) setFocused(e)
            }}
            onBlur={() => {
              if (infoctr1387) setBlured()
            }}
            onChange={(e) => {
              setStreet1(e.target.value)
              setUserInfo({ ...userInfo, address: { ...userInfo.address, street: e.target.value } })
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Paragraph size='medium' textAlign='left' sx={infoctr1387 ? classes.label : undefined}>
            Address Line 2
          </Paragraph>
          <TextField
            sx={infoctr1387 ? classes.text : undefined}
            size='small'
            variant='outlined'
            fullWidth
            value={street2}
            onFocus={(e) => {
              if (infoctr1387) setFocused(e)
            }}
            onBlur={() => {
              if (infoctr1387) setBlured()
            }}
            onChange={(e) => {
              setStreet2(e.target.value)
              setUserInfo({ ...userInfo, address: { ...userInfo.address, street2: e.target.value } })
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Paragraph size='medium' textAlign='left' sx={infoctr1387 ? classes.label : undefined}>
            City
          </Paragraph>
          <TextField
            sx={infoctr1387 ? classes.text : undefined}
            size='small'
            variant='outlined'
            fullWidth
            value={city}
            onFocus={(e) => {
              if (infoctr1387) setFocused(e)
            }}
            onBlur={() => {
              if (infoctr1387) setBlured()
            }}
            onChange={(e) => {
              setCity(e.target.value)
              setUserInfo({ ...userInfo, address: { ...userInfo.address, city: e.target.value } })
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left' sx={infoctr1387 ? classes.label : undefined}>
            State
          </Paragraph>
          <TextField
            sx={infoctr1387 ? classes.text : undefined}
            size='small'
            variant='outlined'
            fullWidth
            value={state}
            onFocus={(e) => {
              if (infoctr1387) setFocused(e)
            }}
            onBlur={() => {
              if (infoctr1387) setBlured()
            }}
            onChange={(e) => {
              setState(e.target.value)
              setUserInfo({ ...userInfo, address: { ...userInfo.address, state: e.target.value } })
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Paragraph size='medium' textAlign='left' sx={infoctr1387 ? classes.label : undefined}>
            Zip
          </Paragraph>
          <TextField
            sx={infoctr1387 ? classes.text : undefined}
            size='small'
            variant='outlined'
            fullWidth
            value={zip}
            onFocus={(e) => {
              if (infoctr1387) setFocused(e)
            }}
            onBlur={() => {
              if (infoctr1387) setBlured()
            }}
            onChange={(e) => {
              setZip(e.target.value)
              setUserInfo({ ...userInfo, address: { ...userInfo.address, zip: e.target.value } })
            }}
          />
        </Grid>
        {infoctr1387 && (
          <Grid item xs={6}>
            <Paragraph size='medium' textAlign='left' sx={infoctr1387 ? classes.label : undefined}>
              Country
            </Paragraph>
            <DropDown
              size='medium'
              sx={classes.dropdown}
              dropDownItems={counties}
              defaultValue={county}
              placeholder={'Select County'}
              auto={false}
              setParentValue={(e) => {
                setSelectedValue(String(e))
                setSelectedDrop('County')
                setWarningPopup(true)
              }}
            />
          </Grid>
        )}
        {infoctr1387 && (
          <Grid item xs={6}>
            <Paragraph size='medium' textAlign='left' sx={infoctr1387 ? classes.label : undefined}>
              School District
            </Paragraph>
            <DropDown
              size='medium'
              sx={classes.dropdown}
              dropDownItems={schoolDistricts}
              defaultValue={school_district}
              placeholder={'Select School District'}
              auto={false}
              setParentValue={(e) => {
                setSelectedValue(String(e))
                setSelectedDrop('School District')
                setWarningPopup(true)
              }}
            />
          </Grid>
        )}
      </Grid>
      <Grid container marginTop={0} columnSpacing={4} rowSpacing={3}>
        <Grid item xs={7}>
          <Subtitle fontWeight='700' size='large' textAlign='left' sx={classes.note}>
            Notes
          </Subtitle>
          <TextField
            sx={infoctr1387 ? classes.text : undefined}
            size='small'
            variant='outlined'
            fullWidth
            borderNone={true}
            value={notes || ''}
            onChange={(e) => {
              setNotes(e.target.value)
            }}
            multiline
            rows={8}
          />
        </Grid>
      </Grid>
      {warningPopup && (
        <CustomModal
          title='Warning'
          description='Updating the address will affect all children'
          onConfirm={setConfirmWarningPopup}
          onClose={setCancelWarningPopup}
          confirmStr='Update'
        />
      )}
    </Box>
  )
}
