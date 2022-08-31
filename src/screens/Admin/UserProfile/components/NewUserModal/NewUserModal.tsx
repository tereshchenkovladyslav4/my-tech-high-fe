import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Button, Grid, Modal, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { RECEIVE_EMAIL_GIVING_LINK_TO_CREATE_PASSWORD } from '@mth/constants'
import { BUTTON_LINEAR_GRADIENT } from '../../../../../utils/constants'
import { StudentsModal } from './StudentsModal'
import { useStyles } from './styles'
import { NewModalTemplateType, ApolloError } from './types'

export const NewUserModal: NewModalTemplateType = ({
  handleModem,
  visible = false,
  students = [],
  data,
  ParentEmailValue,
}) => {
  const classes = useStyles
  const [apolloError, setApolloError] = useState<ApolloError>({
    title: '',
    severity: '',
    flag: false,
  })
  const [email, setEmail] = useState('')
  // const [parentEmail, setParentEmail] = useState(data?.parent_id ? data?.person?.email : data?.parent?.person?.email)
  const [parentEmail] = useState(ParentEmailValue)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [region, setRegion] = useState('')
  const [showStudentModal, setShowStudentModal] = useState(false)
  const [payloadData, setPayloadData] = useState()
  const rolesOption: DropDownItem[] = [
    {
      label: 'Observer',
      value: 0,
    },
  ]
  const regionOption: DropDownItem[] = [
    {
      label: 'Utah',
      value: 'Utah',
    },
    {
      label: 'Arizona',
      value: 'Arizona',
    },
    {
      label: 'Idaho',
      value: 'Idaho',
    },
  ]

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
    } else if (!parentEmail) {
      setApolloError({
        title: 'Parent Email address is required.',
        severity: 'Warning',
        flag: true,
      })
      return
    } else if (!region) {
      setApolloError({
        title: 'Region is required.',
        severity: 'Warning',
        flag: true,
      })
      return
    }
    setPayloadData({
      email: email,
      first_name: firstName,
      last_name: lastName,
      parent_id: data?.parent_id ? data?.parent_id : data?.parent?.parent_id,
      // region: region,
      // parent_email: parentEmail,
    })
    setShowStudentModal(true)
  }
  const handleCloseStudentModal = (status) => {
    setShowStudentModal(false)
    if (status) handleModem()
  }

  return (
    <Modal
      open={visible}
      onClose={() => handleModem()}
      aria-labelledby='Create User'
      aria-describedby='Create New User'
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
        {showStudentModal && (
          <StudentsModal visible={true} handleModem={handleCloseStudentModal} students={students} data={payloadData} />
        )}
        <Box sx={classes.header}>
          <Subtitle>{RECEIVE_EMAIL_GIVING_LINK_TO_CREATE_PASSWORD}</Subtitle>
          <CloseIcon style={classes.close} onClick={handleModem} />
        </Box>
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
            <Grid item xs={12}>
              <DropDown
                dropDownItems={rolesOption}
                placeholder='User Type'
                size='small'
                sx={{ width: '50%' }}
                defaultValue={0}
              />
            </Grid>
          </Grid>
          <Grid container item xs={9}>
            <Grid item xs={12}>
              <DropDown
                dropDownItems={regionOption}
                setParentValue={(e) => setRegion(e)}
                placeholder='Region'
                size='small'
                sx={{ width: '50%' }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Subtitle fontWeight='700' size='large'>
              Parent Account Email
            </Subtitle>
            <TextField
              size='small'
              variant='outlined'
              fullWidth
              value={parentEmail}
              // onChange={(e) => setParentEmail(e.target.value)}
              disabled
            />
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
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 700,
                  height: '24px',
                }}
              >
                Add
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}
