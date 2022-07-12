/* eslint-disable no-unused-expressions */
import { Button, Modal } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { useStyles } from './styles'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik'

import { Title } from '../Typography/Title/Title'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { DropDown } from '../DropDown/DropDown'

export const EditYearModal = ({ title, schoolYears, handleSubmit, handleClose }) => {
  const classes = useStyles

  const formik = useFormik({
    validationSchema: Yup.object({
      schoolYear: Yup.string()
        .required('Required'),
    }),
    onSubmit: values => {
      handleSubmit(values);
    },
  });


  return (
    <Modal
      open={true}
      onClose={() => handleClose()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={classes.modalCard}>
        <Title fontWeight='700' textAlign='center'>{title}</Title>
        <Formik
          initialValues={{
            schoolYear: undefined,
          }}
          validationSchema={Yup.object({
            schoolYear: Yup.string()
              .required('This field is Required'),
          })}
          onSubmit={async (values) => {
            await handleSubmit(values)
          }}
        >
          {({ values, errors }) => {
            return (
              <Form>
                <Box sx={{ ...classes.content, display: 'flex', alignItems: 'center', px: 5 }}>
                  <Box sx={{ width: '60%' }}>
                    <Field name={`schoolYear`} fullWidth focused>
                      {({ field, form, meta }) => (
                        <Box width={'451.53px'}>
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
                   variant='contained' disableElevation sx={classes.submitButton} type="submit"
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
