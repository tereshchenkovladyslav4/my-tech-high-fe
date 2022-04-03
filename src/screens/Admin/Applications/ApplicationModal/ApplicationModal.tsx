import React, { useEffect, useState, useContext } from 'react'
import { Button, MenuItem, Modal, Select } from '@mui/material'
import { Box } from '@mui/system'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { ApplicationModalType } from './types'
import CloseIcon from '@mui/icons-material/Close'
import { useStyles } from './styles'
import { Formik, Form } from 'formik'
import moment from 'moment'
import { ProfileContext } from '../../../../providers/ProfileProvider/ProfileContext'
import { BUTTON_LINEAR_GRADIENT, GREEN_GRADIENT, RED_GRADIENT, YELLOW_GRADIENT } from '../../../../utils/constants'
import { makeStyles } from '@material-ui/styles'
const selectStyles = makeStyles({
  select: {
    fontSize: '12px',
    borderRadius: '15px',
    minWidth: '80px',
    height: '29px',
    textAlign: 'center',
    // background: BUTTON_LINEAR_GRADIENT,
    // color: '#F2F2F2',
    // '&:before': {
    //   borderColor: BUTTON_LINEAR_GRADIENT,
    // },
    // '&:after': {
    //   borderColor: BUTTON_LINEAR_GRADIENT,
    // },
  },
  // selectIcon: {
  //   fill: '#F2F2F2',
  //   color: '#F2F2F2',
  // },
  // selectRoot: {
  //   color: '#F2F2F2',
  // },
})
export const ApplicationModal: ApplicationModalType = ({
  handleModem,
  title = 'Application',
  subtitle,
  btntitle = 'Save',
  handleSubmit,
  data,
  schoolYears,
  handleRefetch,
}) => {
  const classes = useStyles
  const selectClasses = selectStyles()
  const { showModal, hideModal, store, setStore } = useContext(ProfileContext)
  console.log(store)
  const handleOpenProfile = (data) => {
    showModal(data)
    setStore(true)
  }
  useEffect(() => {
    handleRefetch && handleRefetch()
  }, [store])
  return (
    <Modal
      open={true}
      onClose={() => handleModem()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Formik
        initialValues={data}
        onSubmit={(values, actions) => {
          handleSubmit(values)
        }}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Box sx={classes.modalCard}>
              <Box sx={classes.header as object}>
                <Subtitle fontWeight='700'>{title}</Subtitle>
                <Box sx={classes.headerRight as object}>
                  <Button size='small' variant='contained' disableElevation sx={classes.submitButton} type='submit'>
                    {btntitle}
                  </Button>
                  <CloseIcon onClick={() => handleModem()} style={classes.close} />
                </Box>
              </Box>
              <Box sx={classes.content}>
                <Box sx={classes.formRow}>
                  <Subtitle sx={classes.formLabel as object} fontWeight='500'>
                    Student
                    <Box sx={classes.labelAfter as object}></Box>
                  </Subtitle>
                  <Subtitle
                    sx={{ ...(classes.formValue as object), ...({ cursor: 'pointer' } as object) }}
                    fontWeight='500'
                    onClick={() => handleOpenProfile(data.student)}
                  >
                    {data?.student?.person?.first_name} {data?.student?.person?.last_name}
                  </Subtitle>
                </Box>
                <Box sx={classes.formRow}>
                  <Subtitle sx={classes.formLabel as object} fontWeight='500'>
                    Application
                    <Box sx={classes.labelAfter as object}></Box>
                  </Subtitle>
                  <Subtitle sx={classes.formValue as object} fontWeight='500'>
                    {data.date_submitted ? 'Submitted ' + moment(data.date_submitted).format('MM/DD/yy') : null}
                  </Subtitle>
                </Box>
                <Box sx={classes.formRow}>
                  <Subtitle sx={classes.formLabel as object} fontWeight='500'>
                    Parent
                    <Box sx={classes.labelAfter as object}></Box>
                  </Subtitle>
                  <Subtitle
                    sx={{ ...(classes.formValue as object), ...({ cursor: 'pointer' } as object) }}
                    fontWeight='500'
                    onClick={() => handleOpenProfile(data?.student?.parent)}
                  >
                    {data?.student?.parent?.person?.first_name} {data?.student?.parent?.person?.last_name}
                  </Subtitle>
                </Box>
                <Box sx={classes.formRow}>
                  <Subtitle sx={classes.formLabel as object} fontWeight='500'>
                    Contact
                    <Box sx={classes.labelAfter as object}></Box>
                  </Subtitle>
                  <Box sx={classes.formRow}>
                    <Subtitle sx={classes.formValue as object} fontWeight='500'>
                      <a style={{ color: '#7b61ff' }} href={`mailto:${data?.student?.parent?.person?.email}`}>
                        {data?.student?.parent?.person?.email}
                      </a>
                      <Box sx={classes.labelAfter as object}></Box>
                    </Subtitle>
                    <Subtitle sx={classes.formValue as object} fontWeight='500'>
                      {data?.student?.parent?.person?.phone?.number}
                    </Subtitle>
                  </Box>
                </Box>
                <Box sx={classes.formRow}>
                  <Subtitle sx={classes.formLabel as object} fontWeight='500'>
                    Referred By
                    <Box sx={classes.labelAfter as object}></Box>
                  </Subtitle>
                  <Subtitle sx={classes.formValue as object} fontWeight='500'>
                    {data?.referred_by}
                  </Subtitle>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Subtitle sx={{ pr: 3 }} fontWeight='700'>
                      Mid-year Application
                    </Subtitle>
                    <Select
                      size='small'
                      name='midyear_application'
                      onChange={handleChange}
                      value={values.midyear_application || 'false'}
                      className={selectClasses.select}
                      // inputProps={{
                      //   classes: {
                      //     icon: selectClasses.selectIcon,
                      //   },
                      // }}
                    >
                      <MenuItem value='false'>No</MenuItem>
                      <MenuItem value='true'>Yes</MenuItem>
                    </Select>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', px: 5 }}>
                    <Subtitle sx={{ pr: 3 }} fontWeight='700'>
                      School Year
                    </Subtitle>
                    <Select
                      className={selectClasses.select}
                      // inputProps={{
                      //   classes: {
                      //     icon: selectClasses.selectIcon,
                      //   },
                      // }}
                      size='small'
                      name='school_year_id'
                      onChange={handleChange}
                      value={values.school_year_id}
                    >
                      {schoolYears?.map((item) => (
                        <MenuItem value={item.school_year_id}>{`${moment(item.date_begin).format('YYYY')}-${moment(
                          item.date_end,
                        ).format('YY')}`}</MenuItem>
                      ))}
                    </Select>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Subtitle sx={{ pr: 3 }} fontWeight='700'>
                      Status
                    </Subtitle>
                    <Select
                      className={selectClasses.select}
                      // inputProps={{
                      //   classes: {
                      //     icon: selectClasses.selectIcon,
                      //   },
                      // }}
                      size='small'
                      name='status'
                      onChange={handleChange}
                      value={values.status}
                    >
                      <MenuItem value='Submitted'>Submitted</MenuItem>
                      <MenuItem value='Accepted'>Accepted</MenuItem>

                      {/* <MenuItem value='0'>Sibling</MenuItem>
                      <MenuItem value='1'>New</MenuItem>
                      <MenuItem value='2'>Returning</MenuItem> */}
                    </Select>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}
