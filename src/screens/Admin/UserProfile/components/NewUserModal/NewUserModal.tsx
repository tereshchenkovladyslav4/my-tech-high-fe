import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import CloseIcon from '@mui/icons-material/Close'
import { Button, Checkbox, FormControlLabel, FormGroup, Grid, Modal, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { map } from 'lodash'
import { DropDown } from '../../../../../components/DropDown/DropDown'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { BUTTON_LINEAR_GRADIENT, PROVIDERS, SOE, SOE_OPTIONS, SPED } from '../../../../../utils/constants'
import { useStyles } from './styles'
import { NewModalTemplateType, ApolloError } from './types'
import { WarningModal } from '../../../../../components/WarningModal/Warning'
import { DropDownItem } from '../../../../../components/DropDown/types'
import { StudentsModal } from './StudentsModal'

export const NewUserModal: NewModalTemplateType = ({ handleModem, visible, students = [], data }) => {
  const classes = useStyles
  const [apolloError, setApolloError] = useState<ApolloError>({
    title: '',
    severity: '',
    flag: false,
  })
  const [email, setEmail] = useState('')
  const [parentEmail, setParentEmail] = useState(data?.parent_id ? data?.person?.email : data?.parent?.person?.email)
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
    console.log(status)
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
          <Subtitle>This user will receive an email giving them a link to create a password.</Subtitle>
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
                setParentValue={(e) => console.log(e)}
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
