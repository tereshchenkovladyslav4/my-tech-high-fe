import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import { Alert, Avatar, Button, Stack, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { createQuickLinkMutation, updateQuickLinkMutation } from '../../graphql/mutation/quick-link'
import { DocumentUploadModal } from '../../screens/Admin/SiteManagement/EnrollmentSetting/EnrollmentQuestions/Documents/components/DocumentUploadModal/DocumentUploadModal'
import { useStyles } from '../../screens/Admin/SiteManagement/styles'
import { CustomConfirmModal } from '../CustomConfirmModal/CustomConfirmModal'
import { DropDown } from '../DropDown/DropDown'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { QuickLink, QUICKLINK_TYPE } from './QuickLinkCardProps'

const QuickLinkEdit: React.FC<{
  quickLink: QuickLink
  updateQuickLinks: (quickLink: QuickLink) => void
  action: (page: string) => void
  handleChange: (flag: boolean) => void
}> = ({ quickLink, updateQuickLinks, action, handleChange }) => {
  const classes = useStyles

  const typeArr = [
    {
      label: 'Website Link',
      value: QUICKLINK_TYPE.WEBSITE_LINK,
    },
    {
      label: 'Form',
      value: QUICKLINK_TYPE.FORM,
    },
    {
      label: 'PDF to Sign',
      value: QUICKLINK_TYPE.PDF_TO_SIGN,
    },
  ]

  const [submitCreate] = useMutation(createQuickLinkMutation)
  const [submitUpdate] = useMutation(updateQuickLinkMutation)

  const [imageModalOpen, setImageModalOpen] = useState(false)
  //	Flag State which indicates to show image delete confirmation modal
  const [imageDeleteConfirmModal, showImageDeleteConfirmModal] = useState(false)

  const [file, setFile] = useState<undefined | File>()
  const [image, setImage] = useState('')

  //	Page Status State which shows the success or error messages on the bottom of the page
  const [pageStatus, setPageStatus] = useState({ status: 'info', message: '' })

  const onSave = () => {
    if (file) {
      const bodyFormData = new FormData()
      bodyFormData.append('file', file[0])
      bodyFormData.append('region', 'UT')
      bodyFormData.append('year', '2022')

      return fetch(import.meta.env.SNOWPACK_PUBLIC_S3_UPLOAD, {
        method: 'POST',
        body: bodyFormData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT')}`,
        },
      })
        .then(async (res) => {
          return res
            .json()
            .then(({ status, data, message }) => {
              if (status == 'Error') {
                onSubmitFailed(message)
              } else handleSubmit(data)
            })
            .catch((err) => {
              onSubmitFailed(err)
            })
        })
        .catch((err) => {
          onSubmitFailed(err)
        })
    } else {
      handleSubmit(null)
      return undefined
    }
  }

  const onSubmitSuccess = (id: number) => {
    //  Update the quick links of the home page
    quickLink = {
      ...quickLink,
      id: id,
      title: formik.values.title,
      subtitle: formik.values.subtitle,
      type: formik.values.type,
      image_url: formik.values.image_url,
      reserved: quickLink.reserved,
    }
    updateQuickLinks(quickLink)

    switch (quickLink.type) {
      case QUICKLINK_TYPE.WITHDRAWAL:
        action('')
        break
      case QUICKLINK_TYPE.WEBSITE_LINK:
      case QUICKLINK_TYPE.FORM:
      case QUICKLINK_TYPE.PDF_TO_SIGN:
        action('reserved')
      default:
        break
    }
  }

  const onSubmitFailed = (err) => {
    console.log(err)
    setPageStatus({ status: 'error', message: err })
  }

  useEffect(() => {
    if (pageStatus.status != 'info') {
      setTimeout(() => {
        setPageStatus({ message: '', status: 'info' })
      }, 5000)
    }
  }, [pageStatus])

  const onRemovePhoto = () => {
    showImageDeleteConfirmModal(true)
  }

  const validationSchema = yup.object({
    title: yup.string().required('Title is required.').nullable(),
    subtitle: yup.string().nullable(),
    type: yup.number().nullable(),
  })

  const formik = useFormik({
    initialValues: {
      title: quickLink.id == 0 ? '' : quickLink.title,
      subtitle: quickLink.id == 0 ? '' : quickLink.subtitle,
      type: quickLink.type || typeArr[0].value,
      image_url: quickLink.image_url,
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      await onSave()
    },
  })

  const convertToBlob = (file) => {
    const fileUrl = URL.createObjectURL(file[0])
    return fileUrl
  }

  const handleSubmit = (img: { key: string }) => {
    if (quickLink.id == 0) {
      submitCreate({
        variables: {
          quickLinkInput: {
            quickLink: {
              ...quickLink,
              title: formik.values.title,
              subtitle: formik.values.subtitle,
              type: formik.values.type,
              image_url: img ? img.key : quickLink.image_url,
            },
          },
        },
      })
        .then(async ({ data }) => {
          if (img) formik.values.image_url = img.key
          onSubmitSuccess(data.createQuickLink.id)
        })
        .catch((err) => {
          onSubmitFailed(err?.message)
        })
    } else {
      submitUpdate({
        variables: {
          quickLinkInput: {
            quickLink: {
              ...quickLink,
              title: formik.values.title,
              subtitle: formik.values.subtitle,
              type: formik.values.type,
              image_url: img ? img.key : image == '' ? '' : quickLink.image_url,
            },
          },
        },
      })
        .then(async () => {
          if (img) formik.values.image_url = img.key
          else if (image == '') formik.values.image_url = ''
          onSubmitSuccess(quickLink.id)
        })
        .catch((err) => {
          onSubmitFailed(err?.message)
        })
    }
  }

  useEffect(() => {
    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    setImage(file ? convertToBlob(file) : formik.values.image_url ? s3URL + formik.values.image_url : '')
  }, [file, formik.values.image_url])

  const Image = () => (
    <Box display='flex' flexDirection='column' justifyContent={'center'} sx={{ height: 167, width: 167 }} marginTop={3}>
      {image != '' ? (
        <>
          <Avatar src={image} variant='square' sx={{ height: '100%', width: '100%' }} />
          <Box onClick={onRemovePhoto} sx={{ cursor: 'pointer' }}>
            <Paragraph size='medium' fontWeight='500' textAlign='center' color='#4145FF'>
              Remove Image
            </Paragraph>
          </Box>
        </>
      ) : (
        <Box
          display='flex'
          flexDirection='column'
          justifyContent={'center'}
          sx={{ backgroundColor: '#FAFAFA', alignItems: 'center', cursor: 'pointer', height: '100%', width: '100%' }}
          onClick={() => setImageModalOpen(true)}
        >
          <SystemUpdateAltIcon />
          <Paragraph size='medium' fontWeight='500'>
            Upload Photo
          </Paragraph>
        </Box>
      )}
    </Box>
  )

  return (
    <form name='QuickLinkEditForm' onSubmit={formik.handleSubmit} style={{ height: '100%' }}>
      <Stack direction='column' justifyContent='center' alignItems='center' flex={1} sx={classes.base}>
        <Box
          display='flex'
          flexDirection='row'
          justifyContent={'left'}
          marginTop={2}
          sx={{ alignItems: 'left', height: '100%', width: '100%' }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: 20, ml: 1 }}>
            {quickLink.id == 0 ? 'New Quick Link' : 'Edit Quick Link'}
          </Typography>
        </Box>
        {Image()}
        <Stack direction='column' justifyContent='center' alignItems='center' width={'65%'} marginTop={3}>
          <TextField
            name='title'
            label='Title'
            placeholder='Entry'
            fullWidth
            value={formik.values.title}
            onChange={(e) => {
              formik.handleChange(e)
              handleChange(true)
              window['setFormChanged']('QuickLinkEditForm', true)
            }}
            sx={{ my: 2, width: '65%' }}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          <TextField
            name='subtitle'
            label='Subtitle'
            placeholder='Entry'
            fullWidth
            value={formik.values.subtitle}
            onChange={(e) => {
              formik.handleChange(e)
              handleChange(true)
              window['setFormChanged']('QuickLinkEditForm', true)
            }}
            sx={{ my: 2, width: '65%' }}
          />
          {quickLink.type != QUICKLINK_TYPE.WITHDRAWAL && (
            <DropDown
              dropDownItems={typeArr}
              placeholder='Type'
              labelTop
              setParentValue={(value) => {
                formik.values.type = Number(value)
                handleChange(true)
                window['setFormChanged']('QuickLinkEditForm', true)
              }}
              size='small'
              defaultValue={quickLink.type || typeArr[0].value}
              sx={{ my: 2, width: '65%' }}
              disabled={quickLink.id > 0}
            />
          )}
        </Stack>
        <Stack direction='row' justifyContent='center' alignItems='center' spacing={8} marginTop={3}>
          <Button
            variant='contained'
            color='secondary'
            disableElevation
            sx={classes.cancelButton}
            onClick={() => action('')}
          >
            Cancel
          </Button>
          <Button variant='contained' disableElevation sx={classes.submitButton} type='submit'>
            Save
          </Button>
        </Stack>
        <Stack>
          {pageStatus.status != 'info' && (
            <Alert
              sx={{
                position: 'relative',
                bottom: '-83px',
              }}
              onClose={() => {
                setPageStatus({ status: 'info', message: '' })
              }}
              severity={pageStatus.status}
            >
              {pageStatus.message}
            </Alert>
          )}
        </Stack>
        {imageModalOpen && (
          <DocumentUploadModal
            handleModem={() => setImageModalOpen(!imageModalOpen)}
            handleFile={(fileName: File) => setFile(fileName)}
            limit={1}
          />
        )}
        {imageDeleteConfirmModal && (
          <CustomConfirmModal
            header='Delete Image'
            content='Are you sure you want to delete this image?'
            handleConfirmModalChange={(val: boolean, isOk: boolean) => {
              showImageDeleteConfirmModal(false)
              if (isOk) {
                setFile(undefined)
                setImage('')

                handleChange(true)
                window['setFormChanged']('QuickLinkEditForm', true)
              }
            }}
          />
        )}
      </Stack>
    </form>
  )
}
export { QuickLinkEdit as default }
