import React, { useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/styles'
import CloseIcon from '@mui/icons-material/Close'
import { Button, MenuItem, Modal, Select } from '@mui/material'
import { Box } from '@mui/system'
import { Formik, Form } from 'formik'
import moment from 'moment'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { ProfileContext } from '@mth/providers/ProfileProvider/ProfileContext'
import { useStyles } from './styles'
import { ApplicationModalProps } from './types'
const selectStyles = makeStyles({
  select: {
    fontSize: '12px',
    borderRadius: '15px',
    minWidth: '80px',
    height: '29px',
    textAlign: 'center',
  },
  statusSelect: {
    fontSize: '12px !important',
    paddingLeft: '8px',
    borderRadius: '15px',
    minWidth: '80px',
    height: '29px',
    textAlign: 'center',
    background: MthColor.BUTTON_LINEAR_GRADIENT,
    marginLeft: '30px',
    color: 'white !important',
    '&:before': {
      borderColor: 'white',
    },
    '&:after': {
      borderColor: 'white',
    },
  },
})
export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  handleModem,
  title = 'Application',
  btntitle = 'Save',
  handleSubmit,
  data,
  schoolYears,
  handleRefetch,
}) => {
  const classes = useStyles
  const selectClasses = selectStyles()
  const { showModal, store, setStore } = useContext(ProfileContext)
  const handleOpenProfile = (data) => {
    showModal(data)
    setStore(true)
  }
  useEffect(() => {
    if (handleRefetch) handleRefetch()
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
        onSubmit={(values) => {
          handleSubmit(values)
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Box sx={classes.modalCard}>
              <Box sx={classes.header as Record<string, unknown>}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Subtitle fontWeight='700'>{title}</Subtitle>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Select
                      className={selectClasses.statusSelect}
                      size='small'
                      name='status'
                      onChange={handleChange}
                      value={values.status}
                    >
                      <MenuItem value='Submitted'>Submitted</MenuItem>
                      <MenuItem value='Accepted'>Accepted</MenuItem>
                    </Select>
                  </Box>
                </Box>
                <Box sx={classes.headerRight as Record<string, unknown>}>
                  <Button size='small' variant='contained' disableElevation sx={classes.submitButton} type='submit'>
                    {btntitle}
                  </Button>
                  <CloseIcon onClick={() => handleModem()} style={classes.close} />
                </Box>
              </Box>
              <Box sx={classes.content}>
                <Box sx={classes.formRow}>
                  <Subtitle sx={classes.formLabel as Record<string, unknown>} fontWeight='500'>
                    Student
                    <Box sx={classes.labelAfter as Record<string, unknown>}></Box>
                  </Subtitle>
                  <Subtitle
                    sx={{
                      ...(classes.formValue as Record<string, unknown>),
                      ...({ cursor: 'pointer' } as Record<string, unknown>),
                    }}
                    fontWeight='500'
                    onClick={() => handleOpenProfile(data.student)}
                  >
                    {data?.student?.person?.first_name} {data?.student?.person?.last_name}
                  </Subtitle>
                </Box>
                <Box sx={classes.formRow}>
                  <Subtitle sx={classes.formLabel as Record<string, unknown>} fontWeight='500'>
                    Application
                    <Box sx={classes.labelAfter as Record<string, unknown>}></Box>
                  </Subtitle>
                  <Subtitle
                    sx={{ ...(classes.formLabel as Record<string, unknown>), textAlign: 'center', paddingLeft: 0 }}
                    fontWeight='500'
                  >
                    {data.date_submitted ? moment(data.date_submitted).format('MM/DD/yy') : null}
                  </Subtitle>
                </Box>
                <Box sx={classes.formRow}>
                  <Subtitle sx={classes.formLabel as Record<string, unknown>} fontWeight='500'>
                    Program Year
                    <Box sx={classes.labelAfter as Record<string, unknown>}></Box>
                  </Subtitle>
                  <Select
                    className={selectClasses.select}
                    style={{ marginLeft: '30px' }}
                    size='small'
                    name='school_year_id'
                    onChange={handleChange}
                    value={values.school_year_id}
                  >
                    {schoolYears?.map((item, idx) => (
                      <MenuItem key={idx} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Box sx={classes.formRow}>
                  <Subtitle sx={classes.formLabel as Record<string, unknown>} fontWeight='500'>
                    Parent
                    <Box sx={classes.labelAfter as Record<string, unknown>}></Box>
                  </Subtitle>
                  <Subtitle
                    sx={{
                      ...(classes.formValue as Record<string, unknown>),
                      ...({ cursor: 'pointer' } as Record<string, unknown>),
                    }}
                    fontWeight='500'
                    onClick={() => handleOpenProfile(data?.student?.parent)}
                  >
                    {data?.student?.parent?.person?.first_name} {data?.student?.parent?.person?.last_name}
                  </Subtitle>
                </Box>
                <Box sx={classes.formRow}>
                  <Subtitle sx={classes.formLabel as Record<string, unknown>} fontWeight='500'>
                    Contact
                    <Box sx={classes.labelAfter as Record<string, unknown>}></Box>
                  </Subtitle>
                  <Box sx={{ ...classes.formRow, background: 'unset !important' }}>
                    <Subtitle sx={{ ...(classes.formValue as Record<string, unknown>) }} fontWeight='500'>
                      <a style={{ color: 'black' }} href={`mailto:${data?.student?.parent?.person?.email}`}>
                        {data?.student?.parent?.person?.email}
                      </a>
                      <Box sx={classes.labelAfter as Record<string, unknown>}></Box>
                    </Subtitle>
                    <Subtitle
                      sx={{ ...(classes.formValue as Record<string, unknown>), color: 'black' }}
                      fontWeight='500'
                    >
                      {data?.student?.parent?.person?.phone?.number}
                    </Subtitle>
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
