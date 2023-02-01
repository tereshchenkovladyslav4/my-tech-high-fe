import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Button, Modal } from '@mui/material'
import { Box } from '@mui/system'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { DropDown } from '../DropDown/DropDown'
import { DropDownItem } from '../DropDown/types'
import { Title } from '../Typography/Title/Title'
import { useStyles } from './styles'

type EditYearModalProps = {
  title: string
  schoolYears: DropDownItem[]
  handleSubmit: (values: { schoolYear: string }) => void
  handleClose: () => void
}

const additionalStyles = makeStyles((theme: Theme) => ({
  modalCard: {
    [theme.breakpoints.down('xs')]: {
      width: '95% !important',
    },
  },
  content: {
    [theme.breakpoints.down('xs')]: {
      display: 'block!important',
      padding: '0px!important',
    },
  },
  mainBox: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
    width: '60%',
  },
  schoolYearEdit: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
    width: '451.53px',
  },
}))

export const EditYearModal: React.FC<EditYearModalProps> = ({ title, schoolYears, handleSubmit, handleClose }) => {
  const classes = useStyles
  const extraClasses = additionalStyles()
  return (
    <Modal
      open={true}
      onClose={() => handleClose()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={classes.modalCard} className={extraClasses.modalCard}>
        <Title fontWeight='700' textAlign='center'>
          {title}
        </Title>
        <Formik
          initialValues={{
            schoolYear: '',
          }}
          validationSchema={Yup.object({
            schoolYear: Yup.string().required('This field is Required'),
          })}
          onSubmit={async (values) => {
            await handleSubmit(values)
          }}
        >
          {({ errors }) => {
            return (
              <Form>
                <Box
                  sx={{ ...classes.content, display: 'flex', alignItems: 'center', px: 5 }}
                  className={extraClasses.content}
                >
                  <Box className={extraClasses.mainBox}>
                    <Field name={'schoolYear'} fullWidth focused>
                      {({ field, form, meta }) => (
                        <Box className={extraClasses.schoolYearEdit}>
                          <DropDown
                            name='state'
                            labelTop
                            dropDownItems={schoolYears}
                            placeholder='Program Year'
                            setParentValue={(id) => {
                              form.setFieldValue(field.name, id)
                            }}
                            alternate={true}
                            sx={!!(meta.touched && Boolean(meta.error)) ? classes.textFieldError : classes.dropdown}
                            size='small'
                            error={{
                              error: !!(meta.touched && Boolean(meta.error)),
                              errorMsg: (meta.touched && meta.error) as string,
                            }}
                          />
                        </Box>
                      )}
                    </Field>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  <Button
                    variant='contained'
                    color='secondary'
                    disableElevation
                    sx={classes.cancelButton}
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='contained'
                    disableElevation
                    sx={classes.submitButton}
                    type='submit'
                    disabled={Boolean(Object.keys(errors).length > 0)}
                  >
                    Change
                  </Button>
                </Box>
              </Form>
            )
          }}
        </Formik>
      </Box>
    </Modal>
  )
}
