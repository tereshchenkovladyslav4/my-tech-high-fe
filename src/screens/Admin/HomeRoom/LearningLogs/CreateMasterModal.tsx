import React, { FunctionComponent } from 'react'
import { Button, Modal, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { useStyles } from '../styles'
import { Master } from './types'

type CreateMasterModalProps = {
  handleSubmit: (values: Master) => void
  handleClose: () => void
  selectedYear: number
  schoolYearDropdownItems: DropDownItem[]
}

export const CreateMasterModal: FunctionComponent<CreateMasterModalProps> = ({
  handleSubmit,
  handleClose,
  selectedYear,
  schoolYearDropdownItems,
}) => {
  const classes = useStyles
  return (
    <Modal
      open={true}
      onClose={() => handleClose()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={classes.modalCard}>
        <Formik
          initialValues={{
            schoolYear: selectedYear,
            master_name: '',
          }}
          validationSchema={Yup.object({
            master_name: Yup.string().required('Required'),
            schoolYear: Yup.number().required('Required'),
          })}
          onSubmit={async (values: Master) => {
            await handleSubmit(values)
          }}
        >
          {({ setFieldValue }) => {
            return (
              <Form>
                <Box sx={{ ...classes.content, display: 'flex', alignItems: 'center', px: 5 }}>
                  <Box sx={{ width: '60%' }}>
                    <Field name={'master_name'} fullWidth focused>
                      {({ meta }) => (
                        <Box>
                          <TextField
                            name='master_name'
                            label='Master'
                            placeholder='Entry'
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFieldValue('master_name', e.target.value)
                            }}
                            className='MthFormField'
                            error={meta.touched && !!meta.error}
                          />
                          <Subtitle sx={classes.formError}>{meta.touched && meta.error}</Subtitle>
                        </Box>
                      )}
                    </Field>
                    <Field name={'Year'} fullWidth focused>
                      {({ meta }) => (
                        <Box sx={{ marginTop: '30px' }}>
                          <DropDown
                            dropDownItems={schoolYearDropdownItems}
                            placeholder='Year'
                            name='schoolYear'
                            labelTop
                            borderNone
                            sx={{ m: 0 }}
                            defaultValue={selectedYear}
                            setParentValue={(value) => {
                              setFieldValue('schoolYear', value)
                            }}
                            error={{
                              error: !!(meta.touched && Boolean(meta.error)),
                              errorMsg: (meta.touched && meta.error) as string,
                            }}
                          />
                          <Subtitle sx={classes.formError}>{meta.touched && meta.error}</Subtitle>
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
                    marginTop: '50px',
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
                  <Button variant='contained' disableElevation sx={classes.submitButton} type='submit'>
                    Save
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
