import React, { useState } from 'react'
import { Box, Button, Checkbox, FormControlLabel, Grid, Modal, OutlinedInput } from '@mui/material'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { Title } from '@mth/components/Typography/Title/Title'
import { RICH_TEXT_VALID_MIN_LENGTH } from '@mth/constants'
import { mthButtonClasses } from '@mth/styles/button.style'
import { commonClasses } from '@mth/styles/common.style'
import { useStyles } from './styles'
import { EmailModalProps } from './types'

export const ApplicationEmailModal: React.FC<EmailModalProps> = ({
  handleSubmit,
  handleModem,
  title,
  editFrom,
  template,
  isNonSelected,
  filters,
  inserts = [],
  insertDescriptions = {},
  handleSchedulesByStatus,
}) => {
  const classes = useStyles

  const [availableInserts] = useState(inserts)
  const [availableInsertDescription] = useState(insertDescriptions)

  const validationSchema = yup.object({
    emailFrom: yup.string().required('Required').nullable(),
    subject: yup.string().required('Required').nullable(),
    body: yup.string().required('Required').min(RICH_TEXT_VALID_MIN_LENGTH, 'Required').nullable(),
  })

  const formik = useFormik({
    initialValues: {
      emailFrom: template?.from || '',
      subject: template?.subject || '',
      body: template?.body || '',
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      if (handleSubmit) {
        handleSubmit(formik.values.emailFrom, formik.values.subject, formik.values.body)
      }
    },
  })

  return (
    <Modal
      open={true}
      onClose={() => handleModem()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <form onSubmit={formik.handleSubmit}>
        <Box sx={classes.modalCard}>
          {isNonSelected && (
            <Box sx={{ display: 'flex', flexDirection: 'column', mb: '35px' }}>
              <Title fontWeight='700'>Status</Title>
              <div style={{ height: 15 }} />
              {filters?.map((item, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    sx={{ height: 30 }}
                    control={<Checkbox value={item} onChange={(e) => handleSchedulesByStatus(e.target.value)} />}
                    label={
                      <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                        {item}
                      </Paragraph>
                    }
                  />
                )
              })}
            </Box>
          )}
          <Title fontWeight='700' sx={{ mb: 2 }}>
            {title}
          </Title>
          <Subtitle sx={commonClasses.formErrorTop}>
            {((formik.touched.emailFrom && !!formik.errors.emailFrom) ||
              (formik.touched.subject && !!formik.errors.subject) ||
              (formik.touched.body && !!formik.errors.body)) &&
              'Required'}
          </Subtitle>
          {editFrom && (
            <OutlinedInput
              value={formik.values.emailFrom}
              size='small'
              fullWidth
              placeholder='From: email in template'
              onChange={(e) => formik.setFieldValue('emailFrom', e.target.value)}
              error={formik.touched.emailFrom && !!formik.errors.emailFrom}
            />
          )}
          <OutlinedInput
            value={formik.values.subject}
            size='small'
            fullWidth
            placeholder='Subject'
            onChange={(e) => formik.setFieldValue('subject', e.target.value)}
            error={formik.touched.subject && !!formik.errors.subject}
          />
          <MthBulletEditor
            height='200px'
            maxHeight='250px'
            value={formik.values.body}
            setValue={(value) => {
              formik.setFieldValue('body', value)
            }}
            error={formik.touched.body && !!formik.errors.body}
          />

          {availableInserts && (
            <Grid item xs={12} sx={{ mt: 4 }}>
              <Subtitle fontWeight='700' size='large'>
                Available Inserts
              </Subtitle>
              {availableInserts.map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Subtitle fontWeight='600' size='large' sx={{ minWidth: '165px', textTransform: 'uppercase' }}>
                    [{item}]
                  </Subtitle>
                  <Subtitle fontWeight='600' color='#A3A3A4' sx={{ fontSize: '18px', marginLeft: '30px' }}>
                    {availableInsertDescription?.[item] || ''}
                  </Subtitle>
                </Box>
              ))}
            </Grid>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', mt: 4 }}>
            <Button sx={{ ...mthButtonClasses.roundGray, width: '200px' }} onClick={() => handleModem()}>
              Cancel
            </Button>
            <Button sx={{ ...mthButtonClasses.roundDark, width: '200px', ml: 6 }} type='submit'>
              Send
            </Button>
          </Box>
        </Box>
      </form>
    </Modal>
  )
}
