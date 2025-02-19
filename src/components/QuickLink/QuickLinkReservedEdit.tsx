import React from 'react'
import { useMutation } from '@apollo/client'
import { Button, Stack, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { siteManagementClassess } from '@mth/screens/Admin/SiteManagement/styles'
import { updateQuickLinkMutation } from '../../graphql/mutation/quick-link'
import { QuickLinkCard } from './QuickLinkCard'
import { QuickLink, QUICKLINK_TYPE } from './QuickLinkCardProps'

const QuickLinkReservedEdit: React.FC<{
  quickLink: QuickLink
  updateQuickLinks: (quickLink: QuickLink) => void
  action: (page: string) => void
  handleChange: (flag: boolean) => void
}> = ({ quickLink, updateQuickLinks, action, handleChange }) => {
  const [submitUpdate] = useMutation(updateQuickLinkMutation)

  const onSubmitSuccess = () => {
    //  Update the quick links of the home page
    quickLink = {
      ...quickLink,
      reserved: formik.values.reserved,
    }
    updateQuickLinks(quickLink)

    action('')
  }

  const onSubmitFailed = () => {}

  const validationSchema = yup.object({
    reserved: yup
      .string()
      .required(quickLink.type == QUICKLINK_TYPE.WEBSITE_LINK ? 'Website Link is required' : '')
      .nullable(),
  })

  const formik = useFormik({
    initialValues: {
      reserved: quickLink.reserved,
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      handleSubmit()
    },
  })

  const handleSubmit = () => {
    switch (quickLink.type) {
      case QUICKLINK_TYPE.WEBSITE_LINK:
        submitUpdate({
          variables: {
            quickLinkInput: {
              quickLink: {
                ...quickLink,
                reserved: formik.values.reserved,
              },
            },
          },
        })
          .then(async () => {
            onSubmitSuccess()
          })
          .catch((err) => {
            onSubmitFailed(err?.message)
          })
        break
      case QUICKLINK_TYPE.FORM:
        break
      case QUICKLINK_TYPE.PDF_TO_SIGN:
        break
      default:
        break
    }
  }

  return (
    <form name='QuickLinkReservedEditForm' onSubmit={formik.handleSubmit} style={{ height: '100%' }}>
      {quickLink.type == QUICKLINK_TYPE.WEBSITE_LINK && (
        <Stack direction='column' justifyContent='center' alignItems='center' flex={1} sx={siteManagementClassess.base}>
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
          <QuickLinkCard item={quickLink} action={false} />
          <Stack direction='column' justifyContent='center' alignItems='center' width={'65%'} marginTop={3}>
            <TextField
              name='reserved'
              label='Link'
              placeholder='Entry'
              fullWidth
              value={formik.values.reserved}
              onChange={(e) => {
                formik.handleChange(e)
                handleChange(true)
                window['setFormChanged']('QuickLinkReservedEditForm', true)
              }}
              style={siteManagementClassess.input}
              sx={{ my: 2, width: '65%' }}
              error={formik.touched.reserved && Boolean(formik.errors.reserved)}
              helperText={formik.touched.reserved && formik.errors.reserved}
            />
          </Stack>
          <Stack direction='row' justifyContent='center' alignItems='center' spacing={8} marginTop={3}>
            <Button
              variant='contained'
              color='secondary'
              disableElevation
              sx={siteManagementClassess.cancelButton}
              onClick={() => action('edit')}
            >
              Cancel
            </Button>
            <Button variant='contained' disableElevation sx={siteManagementClassess.submitButton} type='submit'>
              Save
            </Button>
          </Stack>
        </Stack>
      )}
      {
        quickLink.type == QUICKLINK_TYPE.FORM //  Not implemented
      }
      {
        quickLink.type == QUICKLINK_TYPE.PDF_TO_SIGN // Not implemented
      }
    </form>
  )
}
export { QuickLinkReservedEdit as default }
