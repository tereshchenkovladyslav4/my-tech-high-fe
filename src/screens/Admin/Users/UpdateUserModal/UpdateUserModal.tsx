import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import CloseIcon from '@mui/icons-material/Close'
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Modal,
  TextField,
} from '@mui/material'
import { Box } from '@mui/system'
import { map } from 'lodash'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { RECEIVE_EMAIL_GIVING_LINK_TO_CREATE_PASSWORD } from '@mth/constants'
import { updateUserMutation } from '@mth/graphql/mutation/user'
import { getAllAccess } from '@mth/graphql/queries/access'
import { getAllRegion } from '@mth/graphql/queries/region'
import { getAllRoles } from '@mth/graphql/queries/role'
import { getUser, getUsersByRegions } from '@mth/graphql/queries/user'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { sortRegions } from '@mth/utils'
import { BUTTON_LINEAR_GRADIENT, PROVIDERS, SOE, SOE_OPTIONS, SPED } from '../../../../utils/constants'
import { ApolloError, Region } from '../interfaces'
import { useStyles } from './styles'
import { UpdateModalTemplateType } from './types'

interface CheckBoxTemplate {
  value: number
  label: string
  selected: boolean
}

export const UpdateUserModal: UpdateModalTemplateType = ({ handleModem, userID, visible }) => {
  const classes = useStyles
  const { me } = useContext(UserContext)
  const [apolloError, setApolloError] = useState<ApolloError>({
    title: '',
    severity: '',
    flag: false,
  })
  const [currentUser, setCurrentUser] = useState(null)
  const [parentEmail, setParentEmail] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userLevel, setUserLevel] = useState('')

  const [regionAll, setRegionAll] = useState(false)
  const [accessAll, setAccessAll] = useState(false)
  const [, setCounter] = useState(0)
  const [soe, setSoe] = useState('')
  const [selectedState, setSelectedState] = useState<number | null>(null)

  const [regions, setRegions] = useState([])
  const [accesses, setAccesses] = useState([])
  const [role, setRole] = useState(0)

  const [rolesOption, setRolesOption] = useState([])
  const [regionOption, setRegionOption] = useState<CheckBoxTemplate[]>([])
  const [accessOption, setAccessOption] = useState<CheckBoxTemplate[]>([])

  const { loading: load1, data: data1 } = useQuery(getAllRegion)
  const { loading: load2, data: data2 } = useQuery(getAllRoles)
  const { loading: load3, data: data3 } = useQuery(getAllAccess)

  const {
    loading: userLoading,
    error: userError,
    data: currentUserData,
  } = useQuery(getUser, {
    variables: {
      user_id: userID,
    },
    fetchPolicy: 'cache-and-network',
  })

  const [updateUser, { data: responseData, loading: uploading, error: uploadingError }] =
    useMutation(updateUserMutation)

  useEffect(() => {
    if (!userLoading && currentUserData !== undefined) {
      const user = currentUserData.user
      setCurrentUser(user)
      setFirstName(user?.first_name)
      setLastName(user?.last_name)
      setEmail(user?.email)
      setCurrentUser(currentUserData.user)
      setRole(user?.level)
      setUserLevel(user?.role?.name)
      setParentEmail(user?.student[0]?.parent_email)

      const currentAccesses = map(user?.userAccess, (access) => {
        return access.access_id
      })
      if (currentAccesses.length === accessOption.length) {
        setAccessAll(true)
      }
      setAccesses(currentAccesses)
      if (user?.level !== 1 && user?.level !== 2 && user?.userRegion.length === 1) {
        setSelectedState(user?.userRegion[0]?.region_id)
      } else {
        const currentRegions = map(user?.userRegion, (region) => {
          return region.region_id
        })
        if (currentRegions.length === regionOption.length) {
          setRegionAll(true)
        }
        setRegions(currentRegions)
      }
    } else {
      if (!userLoading) {
        if (userError?.networkError || userError?.graphQLErrors?.length > 0 || userError?.clientErrors.length > 0) {
          setApolloError({
            title:
              userError?.clientErrors[0]?.message ||
              userError?.graphQLErrors[0]?.message ||
              userError?.networkError?.message,
            severity: 'Error',
            flag: true,
          })
        }
      }
    }
  }, [userLoading])

  useEffect(() => {
    if (currentUser && regionOption.length > 0) {
      map(regionOption, (region, index) => {
        const existed = regions.findIndex((regID) => regID == region.value)
        if (existed !== -1) {
          checkboxRegionChanged(index, false)
        }
      })
      map(accessOption, (access, index) => {
        const existed = accesses.findIndex((accessID) => accessID == access.value)
        if (existed !== -1) {
          checkboxAccessChanged(index, false)
        }
      })
    }
  }, [currentUser])

  useEffect(() => {
    if (!uploading && responseData !== undefined) {
      setApolloError({
        title: 'User has been updated',
        severity: 'Success',
        flag: true,
      })
      setTimeout(() => {
        handleModem()
      }, 1000)
    } else {
      if (!uploading) {
        if (
          uploadingError?.networkError ||
          uploadingError?.graphQLErrors?.length > 0 ||
          uploadingError?.clientErrors.length > 0
        ) {
          setApolloError({
            title:
              uploadingError?.clientErrors[0]?.message ||
              uploadingError?.graphQLErrors[0]?.message ||
              uploadingError?.networkError?.message,
            severity: 'Error',
            flag: true,
          })
        }
      }
    }
  }, [uploading])

  useEffect(() => {
    if (!load1 && data1 !== undefined) {
      const updatedRegions = map(sortRegions(data1?.regions || []), (region) => {
        return {
          value: region.id,
          label: region.name,
          selected: false,
        }
      })
      setRegionOption(updatedRegions)
    } else {
    }
  }, [load1])

  useEffect(() => {
    if (!load2 && data2 !== undefined) {
      const updatedRoles = data2?.roles?.map((role) => {
        return {
          label: role?.name,
          value: role?.id,
        }
      })
      setRolesOption(updatedRoles)
    }
  }, [load2])

  useEffect(() => {
    if (!load3 && data3 !== undefined) {
      const updatedAccess = map(data3?.getAllAccesses, (access) => {
        return {
          value: access.id,
          label: access.name,
          selected: false,
        }
      })
      setAccessOption(updatedAccess)
    }
  }, [load3])

  const dropDownSOE = map(SOE, (el) => ({
    label: el,
    value: el,
  }))

  const handleRoleChange = (value: unknown) => {
    const data = rolesOption.filter((role) => role.value == value)
    if (data.length > 0) {
      setUserLevel(data[0].label)
    }
    setRegions([])
    setAccesses([])
    toggleCheckBoxes('region')
    toggleCheckBoxes('access')
    setSelectedState(0)
    setParentEmail('')
  }

  const toggleCheckBoxes = (group: string, flag = false) => {
    if (group === 'region') {
      if (flag) {
        const updatedRegion = map(regionOption, (region) => {
          return {
            value: region.value,
            label: region.label,
            selected: true,
          }
        })
        const regions = []
        map(updatedRegion, (reg) => regions.push(Number(reg.value)))
        setRegions(regions)
        setRegionOption(updatedRegion)
      } else {
        const updatedRegion = map(regionOption, (region) => {
          return {
            value: region.value,
            label: region.label,
            selected: false,
          }
        })
        setRegionOption(updatedRegion)
        setRegions([])
      }
    } else if (group === 'access') {
      if (flag) {
        const updatedAccess = map(accessOption, (access) => {
          return {
            value: access.value,
            label: access.label,
            selected: true,
          }
        })
        setAccessOption(updatedAccess)
        const access = []
        map(updatedAccess, (acc) => access.push(Number(acc.value)))
        setAccesses(access)
      } else {
        const updatedAccess = map(accessOption, (access) => {
          return {
            value: access.value,
            label: access.label,
            selected: false,
          }
        })
        setAccessOption(updatedAccess)
        setAccesses([])
      }
    }
  }

  const handleRegionChange = (value: number, index: number, checked: boolean) => {
    checkboxRegionChanged(index, checked)
    const updatedRegions = regions
    const indexAt = updatedRegions.findIndex((r) => r == value)
    if (indexAt !== -1) {
      updatedRegions.splice(indexAt, 1)
    } else {
      updatedRegions.push(Number(value))
    }
    if (updatedRegions.length === regionOption.length) {
      setRegionAll(true)
    } else {
      setRegionAll(false)
    }
    setRegions(updatedRegions)
  }

  const handleAccessChange = (value: number, index: number, checked: boolean) => {
    checkboxAccessChanged(index, checked)
    const updatedAccesses = accesses
    const indexAt = updatedAccesses.findIndex((r) => r == value)
    if (indexAt !== -1) {
      updatedAccesses.splice(indexAt, 1)
    } else {
      updatedAccesses.push(Number(value))
    }
    if (updatedAccesses.length === accessOption.length) {
      setAccessAll(true)
    } else {
      setAccessAll(false)
    }
    setAccesses(updatedAccesses)
  }

  const checkboxAccessChanged = (index: number, checked: boolean) => {
    const updatedAccess = accessOption
    accessOption[index].selected = !checked
    setAccessOption(updatedAccess)
    setCounter((counter) => counter + 1)
  }

  const checkboxRegionChanged = (index: number, checked: boolean) => {
    const updatedRegion = regionOption
    regionOption[index].selected = !checked
    setRegionOption(updatedRegion)
    setCounter((counter) => counter + 1)
  }

  const handleSubmit = () => {
    if (!firstName) {
      setApolloError({
        title: 'First name is required',
        severity: 'Warning',
        flag: true,
      })
      return
    } else if (!email) {
      setApolloError({
        title: 'Email address is required',
        severity: 'Warning',
        flag: true,
      })
      return
    } else if (!role) {
      setApolloError({
        title: 'You must declare a role for user.',
        severity: 'Warning',
        flag: true,
      })
      return
    }
    const payload = {
      creator_id: Number(me.user_id),
      user_id: Number(userID),
      first_name: firstName,
      last_name: lastName,
      level: Number(role),
      parent_email: parentEmail,
      regions: selectedState ? [Number(selectedState)] : regions,
      access: accesses,
    }
    updateUser({
      variables: { input: payload },
      refetchQueries: [
        {
          query: getUsersByRegions,
          variables: {
            regions: map(me?.userRegion, (region: Region) => region.region_id),
          },
        },
      ],
    })
  }

  const conditionalUserForm = useCallback(() => {
    let form
    switch (userLevel) {
      case 'Teacher':
      case 'Super Admin':
        form = (
          <Grid item>
            <Subtitle fontWeight='700'>Regions</Subtitle>
            <FormGroup>
              {map(regionOption, (region, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={region.selected}
                      onChange={() => handleRegionChange(region.value, index, region.selected)}
                    />
                  }
                  label={region.label}
                />
              ))}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={regionAll}
                    onChange={(e) => {
                      setRegionAll(e.target.checked)
                      toggleCheckBoxes('region', e.target.checked)
                      setCounter((counter) => counter + 1)
                    }}
                  />
                }
                label='All'
              />
            </FormGroup>
          </Grid>
        )
        break
      case 'Admin':
        form = (
          <Grid item container xs={12}>
            <Grid item xs={6}>
              <Subtitle fontWeight='700'>Regions</Subtitle>
              <FormGroup>
                {map(regionOption, (region, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={region.selected}
                        onChange={() => handleRegionChange(region.value, index, region.selected)}
                      />
                    }
                    label={region.label}
                  />
                ))}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={regionAll}
                      onChange={(e) => {
                        setRegionAll(e.target.checked)
                        toggleCheckBoxes('region', e.target.checked)
                        setCounter((counter) => counter + 1)
                      }}
                    />
                  }
                  label='All'
                />
              </FormGroup>
            </Grid>
            <Grid item xs={6}>
              <Subtitle fontWeight='700'>Access</Subtitle>
              <FormGroup>
                {map(accessOption, (access, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={access.selected}
                        // onChange={() => checkboxAccessChanged(index)}
                        onChange={() => handleAccessChange(access.value, index, access.selected)}
                      />
                    }
                    label={access.label}
                  />
                ))}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={accessAll}
                      onChange={(e) => {
                        setAccessAll(e.target.checked)
                        toggleCheckBoxes('access', e.target.checked)
                        setCounter((counter) => counter + 1)
                      }}
                    />
                  }
                  label='All'
                />
              </FormGroup>
            </Grid>
          </Grid>
        )
        break
      case 'Parent':
        form = (
          <Grid container sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <DropDown
                size='small'
                dropDownItems={regionOption}
                placeholder='Select State'
                defaultValue={selectedState}
                setParentValue={(value) => setSelectedState(Number(value))}
              />
            </Grid>
          </Grid>
        )
        break
      case 'Observer':
        form = (
          <Grid container sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <DropDown
                size='small'
                dropDownItems={regionOption}
                placeholder='Select State'
                defaultValue={selectedState}
                setParentValue={(value) => {
                  setSelectedState(Number(value))
                }}
              />
              {!!selectedState && (
                <Box sx={{ mt: 2 }}>
                  <Subtitle>Parent Email</Subtitle>
                  <TextField
                    size='small'
                    variant='outlined'
                    fullWidth
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        )
        break
      case 'Student':
        form = (
          <Grid container sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <DropDown
                size='small'
                dropDownItems={regionOption}
                placeholder='Select State'
                defaultValue={selectedState}
                setParentValue={(value) => {
                  setSelectedState(Number(value))
                }}
              />
              {!!selectedState && (
                <Box sx={{ mt: 2 }}>
                  <Subtitle>Parent Email</Subtitle>
                  <TextField
                    size='small'
                    variant='outlined'
                    fullWidth
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={4}>
              <Subtitle fontWeight='700'>Access</Subtitle>
              <FormGroup>
                {map(accessOption, (access, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={access.selected}
                        onChange={() => handleAccessChange(access.value, index, access.selected)}
                      />
                    }
                    label={access.label}
                  />
                ))}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={accessAll}
                      onChange={(e) => {
                        setAccessAll(e.target.checked)
                        toggleCheckBoxes('access', e.target.checked ? true : false)
                      }}
                    />
                  }
                  label='All'
                />
              </FormGroup>
            </Grid>
          </Grid>
        )
        break
      case 'Teacher Assistant':
        form = (
          <Grid container justifyContent='space-between'>
            <Grid item xs={6}>
              <DropDown
                size='small'
                dropDownItems={regionOption}
                defaultValue={selectedState}
                placeholder='Select State'
                setParentValue={(value) => setSelectedState(Number(value))}
              />
              {!!selectedState && (
                <Box>
                  <DropDown
                    size='small'
                    dropDownItems={dropDownSOE}
                    defaultValue={soe}
                    placeholder='Select Type'
                    setParentValue={setSoe}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={4}>
              {conditionalTAForm()}
            </Grid>
          </Grid>
        )
        break
      case 'School Partner':
        form = (
          <Grid container>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <DropDown
                size='small'
                dropDownItems={regionOption}
                defaultValue={selectedState}
                placeholder='Select State'
                setParentValue={(value) => setSelectedState(Number(value))}
                sx={{ width: '100%' }}
              />
              {!!selectedState && (
                <Box sx={{ mt: 2 }}>
                  <DropDown
                    size='small'
                    dropDownItems={dropDownSOE}
                    defaultValue={dropDownSOE[0].value}
                    placeholder={'SOE'}
                    setParentValue={setSoe}
                    sx={{ width: '100%' }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        )
        break
      default:
        break
    }
    return form
  }, [userLevel, selectedState, regionAll, accessAll, parentEmail, soe])

  const conditionalTAForm = () => {
    let form
    switch (soe) {
      case 'School of Enrollment':
        form = (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Subtitle fontWeight='700'>School of Enrollment</Subtitle>
            {map(SOE_OPTIONS, (option) => (
              <FormControlLabel control={<Checkbox />} label={option} />
            ))}
          </Box>
        )
        break
      case 'Provider':
        form = (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Subtitle fontWeight='700'>Providers</Subtitle>
            {map(PROVIDERS, (provider) => (
              <FormControlLabel control={<Checkbox />} label={provider} />
            ))}
          </Box>
        )
        break
      case 'SPED':
        form = (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Subtitle fontWeight='700'>SPED</Subtitle>
            {map(SPED, (sped) => (
              <FormControlLabel control={<Checkbox />} label={sped} />
            ))}
          </Box>
        )
        break
    }
    return form
  }

  return (
    <Modal
      open={visible}
      onClose={() => handleModem()}
      aria-labelledby='Update User'
      aria-describedby='Update existing User'
    >
      <Box sx={classes.modalCard}>
        {apolloError.flag && (
          <WarningModal
            handleModem={() => setApolloError({ title: '', severity: '', flag: false })}
            title={apolloError.severity}
            subtitle={apolloError.title}
            btntitle='Close'
            handleSubmit={() => setApolloError({ title: '', severity: '', flag: false })}
          />
        )}
        {userLoading ? (
          <Box display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
            <CircularProgress />
          </Box>
        ) : (
          <Fragment>
            <Box sx={classes.header}>
              <Subtitle>{RECEIVE_EMAIL_GIVING_LINK_TO_CREATE_PASSWORD}</Subtitle>
              <IconButton onClick={handleModem}>
                <CloseIcon style={classes.close} />
              </IconButton>
            </Box>
            <Grid container rowSpacing={2}>
              <Grid item xs={12}>
                <Subtitle fontWeight='700' size='large'>
                  Email
                </Subtitle>
                <TextField
                  size='small'
                  variant='outlined'
                  disabled
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Subtitle fontWeight='700' size='large'>
                  First Name
                </Subtitle>
                <TextField
                  size='small'
                  variant='outlined'
                  fullWidth
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Subtitle fontWeight='700' size='large'>
                  Last Name
                </Subtitle>
                <TextField
                  size='small'
                  variant='outlined'
                  fullWidth
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid container item xs={9}>
                <Grid item xs={12} sx={{ mb: 3 }}>
                  <DropDown
                    dropDownItems={rolesOption}
                    placeholder='User Type'
                    defaultValue={role}
                    setParentValue={(value) => {
                      setRole(Number(value))
                      handleRoleChange(value)
                    }}
                    size='small'
                    sx={{ width: '70%' }}
                  />
                </Grid>
                {conditionalUserForm()}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'end',
                  height: '100%',
                  width: '100%',
                }}
              >
                <Button
                  onClick={handleSubmit}
                  sx={{
                    background: BUTTON_LINEAR_GRADIENT,
                    color: 'white',
                    width: '92px',
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 700,
                  }}
                >
                  Update
                </Button>
              </Box>
            </Grid>
          </Fragment>
        )}
      </Box>
    </Modal>
  )
}

/**
 * Partials
 * Super Admin
 * 	Regions
 * Admin
 * 	Regions
 * 	Access Options
 * New Parent + Student + Observer
 * 	State Drop Down
 * 	Parent Account Email
 * Teacher + TA + School Partner
 *
 *
 */
