import React, { FunctionComponent, useState } from 'react'
import { useMutation } from '@apollo/client'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'
import { Box, Button, Modal, TextField } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { Field, Form, Formik } from 'formik'
import { toNumber } from 'lodash'
import * as yup from 'yup'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'

import { Title } from '../../../../../components/Typography/Title/Title'
import { RED_GRADIENT, BUTTON_LINEAR_GRADIENT } from '../../../../../utils/constants'
import { ValidateFileResponse } from '../SchoolPartner'
import { UpdateSchoolPartnerMutation } from '../services'
import { SchoolPartnerType } from '../types'

export const SchoolPartnerEditModal: FunctionComponent<{ handleModem: () => void; el: SchoolPartnerType }> = ({
  handleModem,
  el,
}) => {
  const [updateSchoolPartnerMutation] = useMutation(UpdateSchoolPartnerMutation)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File>()
  const [setErrorMessage] = useState('')

  const [image, setImage] = useState(el.photo)

  const initialValues = {
    partnerName: el.name,
    abbreviation: el.abbreviation,
  }

  const validationSchema = {
    partnerName: yup.string().required('Partner Name is a required field'),
    abbreviation: yup.string().required('Abbreviation is a required field'),
  }

  const filesSelected = (e: unknown) => {
    handleFiles(e.target.files)
  }

  const handleFiles = (files: File[]) => {
    const file = validateFile(files[0])
    if (file.status === true) {
      setSelectedFiles(files[0])
    } else {
      files[0]['invalid'] = true
      setErrorMessage(file.message)
    }
  }

  const validateFile = (file: File): ValidateFileResponse => {
    // Get the size of the file by files.item(i).size.
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg']
    if (Math.round(file.size / 1024) > 25000) {
      return {
        status: false,
        message: 'This file exceeds maximum allowed size of 25 MB',
      }
    }
    if (validTypes.indexOf(file.type) === -1) {
      return {
        status: false,
        message: 'Please only submit pdf, jpeg, or png',
      }
    }
    return {
      status: true,
    }
  }

  const uploadPhoto = async (): Promise<unknown> => {
    if (selectedFiles) {
      const bodyFormData = new FormData()
      bodyFormData.append('file', selectedFiles)
      const response = await fetch(import.meta.env.SNOWPACK_PUBLIC_BASE_S3_UPLOAD_URL + '/uploadImage', {
        method: 'POST',
        body: bodyFormData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT')}`,
        },
      })
      const imageUrl = await response.json()
      return imageUrl.data.file.item1
    } else {
      return undefined
    }
  }

  return (
    <Modal open={true} onClose={() => handleModem()}>
      {!isUploading ? (
        <Formik
          initialValues={initialValues}
          validationSchema={yup.object(validationSchema)}
          onSubmit={(values, { resetForm }) => {
            setIsUploading(true)
            uploadPhoto().then((resp) => {
              updateSchoolPartnerMutation({
                variables: {
                  updateSchoolPartnerInput: {
                    name: values.partnerName,
                    abbreviation: values.abbreviation,
                    photo: resp ? resp : image,
                    school_partner_id: toNumber(el.school_partner_id),
                  },
                },
              }).then(() => {
                resetForm({})
                setSelectedFiles(undefined)
                setIsUploading(false)
                handleModem()
              })
            })
          }}
        >
          {({ values }) => {
            return (
              <Form>
                <Box
                  sx={{
                    width: 650,
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    bgcolor: 'background.paper',
                    padding: 2,
                    paddingX: '65px',
                    position: 'absolute' as const,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: 24,
                    p: 4,
                  }}
                >
                  <Title sx={{ width: '100%', marginTop: 2 }} size={'small'} textAlign='left' fontWeight='900'>
                    Edit School Partner
                  </Title>
                  <Field name={'partnerName'} fullWidth focused>
                    {({ field, meta }) => (
                      <TextField
                        name='partnerName'
                        label='Partner Name'
                        placeholder='Entry'
                        fullWidth
                        variant='outlined'
                        focused
                        sx={{
                          width: '100%',
                          marginTop: 2,
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: '#333',
                              borderWidth: '1px',
                            },
                          },
                        }}
                        size='small'
                        {...field}
                        error={meta.error}
                        helperText={meta.touched && meta.error}
                        value={values.partnerName || ''}
                      />
                    )}
                  </Field>
                  <Field name={'abbreviation'} fullWidth focused>
                    {({ field, meta }) => (
                      <TextField
                        name='abbreviation'
                        label='Abbreviation'
                        placeholder='Entry'
                        fullWidth
                        variant='outlined'
                        focused
                        sx={{
                          width: '100%',
                          marginTop: 2,
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: '#333',
                              borderWidth: '1px',
                            },
                          },
                        }}
                        size='small'
                        {...field}
                        error={meta.error}
                        helperText={meta.touched && meta.error}
                        value={values.abbreviation || ''}
                      />
                    )}
                  </Field>
                  <Box
                    sx={{
                      display: 'flex',
                      background: '#FAFAFA',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignContent: 'center',
                      height: '164px',
                      width: '164px',
                      alignSelf: 'center',
                      marginTop: '32px',
                    }}
                  >
                    {image !== null ? (
                      <>
                        <img
                          src={import.meta.env.SNOWPACK_PUBLIC_BASE_S3_IMAGE_URL + `/${el.photo}`}
                          style={{
                            maxHeight: '100%',
                            maxWidth: '100%',
                          }}
                        />
                        <Paragraph
                          color='#7B61FF'
                          size='medium'
                          fontWeight='600'
                          onClick={() => setImage(null)}
                          sx={{ cursor: 'pointer' }}
                        >
                          Remove Logo
                        </Paragraph>
                      </>
                    ) : (
                      <label
                        style={{
                          display: 'flex',
                          background: '#FAFAFA',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignContent: 'center',
                          height: '164px',
                          width: '164px',
                          alignSelf: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type='file'
                          style={{ display: 'none' }}
                          onChange={filesSelected}
                          accept='image/png, image/jpeg'
                        />
                        <Box display='flex' flexDirection='column' alignContent='center' alignItems='center'>
                          {!selectedFiles ? (
                            <>
                              <SystemUpdateAltRoundedIcon
                                sx={{
                                  width: 35,
                                  height: 35,
                                  cursor: 'pointer',
                                  alignSelf: 'center',
                                  WebkitTransform: 'rotateX(180deg)',
                                  transform: 'rotateX(180deg)',
                                }}
                              />
                              <Paragraph size='large'>Upload Logo</Paragraph>
                            </>
                          ) : (
                            <img
                              src={URL.createObjectURL(selectedFiles)}
                              style={{
                                height: '164px',
                                width: '164px',
                              }}
                            />
                          )}
                        </Box>
                      </label>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: '40px',
                      marginBottom: '50px',
                    }}
                  >
                    <Button
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        borderRadius: 2,
                        textTransform: 'none',
                        height: '33px',
                        background: RED_GRADIENT,
                        color: 'white',
                        width: '100px',
                        marginRight: 2,
                        '&:hover': {
                          background: '#FFD626',
                          color: '#fff',
                        },
                      }}
                      onClick={handleModem}
                    >
                      Cancel
                    </Button>
                    <Button
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        borderRadius: 2,
                        textTransform: 'none',
                        height: '33px',
                        background: BUTTON_LINEAR_GRADIENT,
                        color: 'white',
                        width: '100px',
                        marginRight: 2,
                        '&:hover': {
                          background: '#FFD626',
                          color: '#fff',
                        },
                      }}
                      type='submit'
                    >
                      Save
                    </Button>
                  </Box>
                </Box>
              </Form>
            )
          }}
        </Formik>
      ) : (
        <Box
          sx={{
            width: 650,
            height: 400,
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            bgcolor: 'background.paper',
            padding: 2,
            paddingX: '65px',
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: 24,
            p: 4,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Modal>
  )
}
