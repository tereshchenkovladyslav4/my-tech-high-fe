import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import CloseIcon from '@mui/icons-material/Close'
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Modal,
  TextField,
  IconButton,
  Divider,
} from '@mui/material'
import { Box } from '@mui/system'
import { map } from 'lodash'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { RECEIVE_EMAIL_GIVING_LINK_TO_CREATE_PASSWORD } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { createUserMutation } from '@mth/graphql/mutation/user'
import { getAllAccess } from '@mth/graphql/queries/access'
import { checkEmailQuery } from '@mth/graphql/queries/email-template'
import { getAllRegion } from '@mth/graphql/queries/region'
import { getAllRoles } from '@mth/graphql/queries/role'
import { getUsersByRegions, getParentDetailByEmail } from '@mth/graphql/queries/user'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { sortRegions } from '@mth/utils'
import { BUTTON_LINEAR_GRADIENT, PROVIDERS, SOE, SOE_OPTIONS, SPED } from '../../../../utils/constants'
import { StudentsModal } from '../../UserProfile/components/NewUserModal/StudentsModal'
import { ApolloError, Region } from '../interfaces'
import { AddedModal } from './AddedModal/AddedModal'
import { useStyles } from './styles'
import { NewModalTemplateType } from './types'

interface CheckBoxTemplate {
  value: number
  label: string
  selected: boolean
}

export const NewUserModal: NewModalTemplateType = ({ handleModem, visible }) => {
  const classes = useStyles
  const { me } = useContext(UserContext)
  const [apolloError, setApolloError] = useState<ApolloError>({
    title: '',
    severity: '',
    flag: false,
  })
  const [userAddedModal, setUserAddedModal] = useState(false)
  const [email, setEmail] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userLevel, setUserLevel] = useState('')

  const [regionAll, setRegionAll] = useState(false)
  const [accessAll, setAccessAll] = useState(false)
  const [, setCounter] = useState(0)
  const [soe, setSoe] = useState('')
  const [selectedState, setSelectedState] = useState<number | null>(null)
  const [showStudentModal, setShowStudentModal] = useState(false)
  const [students, setStudents] = useState([])
  const [regions, setRegions] = useState([])
  const [accesses, setAccesses] = useState([])
  const [role, setRole] = useState(0)
  const [payloadData, setPayloadData] = useState()

  const [rolesOption, setRolesOption] = useState([])
  const [regionOption, setRegionOption] = useState<CheckBoxTemplate[]>([])
  const [accessOption, setAccessOption] = useState<CheckBoxTemplate[]>([])

  const [showEmailError, setShowEmailError] = useState<boolean>(false)

  const { loading: load1, data: data1 } = useQuery(getAllRegion)
  const { loading: load2, data: data2 } = useQuery(getAllRoles)
  const { loading: load3, data: data3 } = useQuery(getAllAccess)

  const [createUser, { data: responseData, loading: uploading, error: uploadingError }] =
    useMutation(createUserMutation)

  const { loading: userLoading, data: parentData } = useQuery(getParentDetailByEmail, {
    variables: {
      email: parentEmail,
    },
    skip: !parentEmail ? true : false,
    fetchPolicy: 'cache-and-network',
  })
  useEffect(() => {
    if (!userLoading && parentData !== undefined) {
      setStudents(parentData.parentDetailByEmail.students)
    }
  }, [parentData])

  const handleCloseStudentModal = (status) => {
    setShowStudentModal(false)
    if (status) handleModem()
  }

  useEffect(() => {
    if (!uploading && responseData !== undefined) {
      setUserAddedModal(true)
    } else {
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
  }, [uploading])

  useEffect(() => {
    if (!load1 && data1 !== undefined) {
      const sortedData = map(sortRegions(data1?.regions || []), (region) => {
        return {
          value: region.id,
          label: region.name,
          selected: false,
        }
      })
      setRegionOption(sortedData)
    } else {
    }
  }, [load1])

  useEffect(() => {
    const sortedRole = [
      'Super Admin',
      'Admin',
      'Teacher',
      'Teacher Assistant',
      'School Partner',
      'Parent',
      'Observer',
      'Student',
    ]
    if (!load2 && data2 !== undefined) {
      const updatedRoles = data2?.roles?.map((role) => {
        return {
          label: role?.name,
          value: role?.id,
        }
      })
      const sortedData = updatedRoles.sort((a, b) => {
        return sortedRole.indexOf(a.label) - sortedRole.indexOf(b.label)
      })
      setRolesOption(sortedData)
    }
  }, [load2])

  useEffect(() => {
    if (!load3 && data3 !== undefined) {
      setAccessOption(data3?.getAllAccesses)
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
    const data = rolesOption.filter((role) => role?.value == value)
    if (data.length > 0) {
      setUserLevel(data[0]?.label)
    }
    setRegions([])
    setAccesses([])
    toggleCheckBoxes('region')
    toggleCheckBoxes('access')
    setSelectedState(null)
    setParentEmail('')
    setSoe('')
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
    if (showEmailError) {
      setApolloError({
        title: 'This email is already being used.',
        severity: 'Warning',
        flag: true,
      })
      return
    } else if (!firstName) {
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
    if (role) {
      const roleData = rolesOption.find((r) => Number(r.value) === role)
      if (roleData.label.toLowerCase() === 'admin' && (!accesses || accesses.length === 0)) {
        setApolloError({
          title: 'Need to select Access for Admin.',
          severity: 'Warning',
          flag: true,
        })
        return
      } else if (roleData.label.toLowerCase() === 'admin' && (!regions || regions.length === 0)) {
        setApolloError({
          title: 'Need to select State.',
          severity: 'Warning',
          flag: true,
        })
        return
      } else if (roleData.label.toLowerCase() === 'parent' && !selectedState) {
        setApolloError({
          title: 'Need to select State.',
          severity: 'Warning',
          flag: true,
        })
        return
      } else if (roleData.label.toLowerCase() === 'observer') {
        if (!parentEmail) {
          setApolloError({
            title: 'Need to add Parent Email.',
            severity: 'Warning',
            flag: true,
          })
          return
        } else {
          setPayloadData({
            email: email,
            first_name: firstName,
            last_name: lastName,
            parent_id: parentData?.parentDetailByEmail?.parent_id,
            regions: selectedState ? [Number(selectedState)] : regions,
          })
          setShowStudentModal(true)
          return
        }
      }
    }

    const payload = {
      creator_id: Number(me.user_id),
      email: email,
      first_name: firstName,
      last_name: lastName,
      level: Number(role),
      regions: selectedState ? [Number(selectedState)] : regions,
      parent_email: parentEmail,
      access: accesses,
    }
    createUser({
      variables: { createUserInput: payload },
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
            <Subtitle fontWeight='700' size='large'>
              State
            </Subtitle>
            <FormGroup>
              {map(regionOption, (region, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      sx={{ paddingY: 0 }}
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
                    sx={{ paddingY: 0 }}
                    checked={regionAll}
                    onChange={(e) => {
                      setRegionAll(e.target.checked)
                      toggleCheckBoxes('region', e.target.checked ? true : false)
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
              <Subtitle fontWeight='700' size='large'>
                State
              </Subtitle>
              <FormGroup>
                {map(regionOption, (region, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        sx={{ paddingY: 0 }}
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
                      sx={{ paddingY: 0 }}
                      checked={regionAll}
                      onChange={(e) => {
                        setRegionAll(e.target.checked)
                        toggleCheckBoxes('region', e.target.checked ? true : false)
                      }}
                    />
                  }
                  label='All'
                />
              </FormGroup>
            </Grid>
            <Grid item xs={6}>
              <Subtitle fontWeight='700' size='large'>
                Access
              </Subtitle>
              <FormGroup sx={{ width: 'max-content' }}>
                {map(accessOption, (access, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        sx={{ paddingY: 0 }}
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
                      sx={{ paddingY: 0 }}
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
      case 'Parent':
        form = (
          <Grid container>
            <Grid item xs={6}>
              <DropDown
                size='small'
                dropDownItems={regionOption}
                defaultValue={selectedState}
                placeholder='Select State'
                setParentValue={(value) => setSelectedState(Number(value))}
              />
            </Grid>
          </Grid>
        )
        break
      case 'Observer':
      case 'Student':
        form = (
          <Grid container>
            <Grid item xs={6}>
              <DropDown
                size='small'
                dropDownItems={regionOption}
                defaultValue={selectedState}
                placeholder='Select State'
                setParentValue={(value) => {
                  setSelectedState(Number(value))
                }}
              />
              {selectedState ? (
                <Box sx={{ mt: 2 }}>
                  <Subtitle fontWeight='700' size='large'>
                    Parent Account Email
                  </Subtitle>
                  <TextField
                    size='small'
                    variant='outlined'
                    fullWidth
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                  />
                </Box>
              ) : (
                <Fragment />
              )}
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
                sx={{ width: '100%' }}
              />
              {selectedState ? (
                <Box sx={{ mt: 2 }}>
                  <DropDown size='small' dropDownItems={dropDownSOE} placeholder={soe} setParentValue={setSoe} />
                </Box>
              ) : (
                <Fragment />
              )}
            </Grid>
            <Grid item xs={4} sx={{ ml: 4, marginTop: -8 }}>
              {conditionalTAForm()}
            </Grid>
          </Grid>
        )
        break
      case 'School Partner':
        form = (
          <Grid container>
            <Grid item xs={6}>
              <DropDown
                size='small'
                dropDownItems={regionOption}
                defaultValue={selectedState}
                placeholder='Select State'
                setParentValue={(value) => setSelectedState(Number(value))}
                sx={{ width: '100%' }}
              />
              {selectedState && (
                <Box sx={{ mt: 2 }}>
                  <DropDown
                    size='small'
                    dropDownItems={dropDownSOE}
                    placeholder='Select Type'
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
            <Subtitle fontWeight='700' size='large' sx={{ width: 'max-content' }}>
              School of Enrollment
            </Subtitle>
            {map(SOE_OPTIONS, (option) => (
              <FormControlLabel control={<Checkbox sx={{ paddingY: 0 }} />} label={option} />
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
            <Subtitle fontWeight='700' size='large'>
              Providers
            </Subtitle>
            {map(PROVIDERS, (provider) => (
              <FormControlLabel control={<Checkbox sx={{ paddingY: 0 }} />} label={provider} />
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
            <Subtitle fontWeight='700' size='large'>
              SPED
            </Subtitle>
            {map(SPED, (sped) => (
              <FormControlLabel control={<Checkbox sx={{ paddingY: 0 }} />} label={sped} />
            ))}
          </Box>
        )
        break
    }
    return form
  }

  const [checkEmail, { loading: emailLoading, data: emailData }] = useLazyQuery(checkEmailQuery, {
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!emailLoading && emailData !== undefined) {
      if (emailData.emailTaken === true) {
        setShowEmailError(true)
      } else {
        setShowEmailError(false)
      }
    }
  }, [emailLoading, emailData])

  return (
    <Modal
      open={visible}
      onClose={() => handleModem()}
      aria-labelledby='Create User'
      aria-describedby='Create New User'
    >
      <Box sx={classes.modalCard}>
        {userAddedModal && (
          <AddedModal
            handleModem={(type) => {
              if (type === 'finish') {
                setUserAddedModal(false)
                handleModem()
              } else if (type === 'add') {
                setFirstName('')
                setLastName('')
                setEmail('')
                setUserLevel('')
                setRole(0)
                setParentEmail('')
                setSoe('')
                setUserAddedModal(false)
              }
            }}
          />
        )}
        {apolloError.flag && (
          <WarningModal
            handleModem={() => setApolloError({ title: '', severity: '', flag: false })}
            title={apolloError.severity}
            subtitle={apolloError.title}
            btntitle='Close'
            handleSubmit={() => setApolloError({ title: '', severity: '', flag: false })}
          />
        )}
        {showStudentModal && (
          <StudentsModal visible={true} handleModem={handleCloseStudentModal} students={students} data={payloadData} />
        )}
        <Box sx={classes.header}>
          <Subtitle>{RECEIVE_EMAIL_GIVING_LINK_TO_CREATE_PASSWORD}</Subtitle>
          <IconButton sx={{ padding: 0, top: '-5px' }} onClick={handleModem}>
            <CloseIcon style={classes.close} />
          </IconButton>
        </Box>
        <Divider />
        <Grid container rowSpacing={2}>
          <Grid item xs={12}>
            <Subtitle fontWeight='700' size='large'>
              Email
            </Subtitle>
            <TextField
              size='small'
              variant='outlined'
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyUp={() => {
                // TODO fix validation here
                checkEmail({
                  variables: {
                    email: email,
                  },
                })
              }}
            />
            {showEmailError && (
              <Subtitle size='medium' color={MthColor.RED}>
                This email is already being used.
              </Subtitle>
            )}
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
                placeholder='User Level'
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
              Add
            </Button>
          </Box>
        </Grid>
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
