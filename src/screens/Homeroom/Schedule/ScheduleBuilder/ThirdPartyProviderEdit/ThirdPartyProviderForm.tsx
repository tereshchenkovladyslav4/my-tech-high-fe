import React from 'react'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { Box, TextField, Tooltip } from '@mui/material'
import { useFormikContext } from 'formik'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, ScheduleBuilder } from '@mth/enums'
import { editSubjectClasses } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/SubjectEdit/styles'
import { ThirdPartyProvider, ThirdPartyProviderFormProps } from './types'

const ThirdPartyProviderForm: React.FC<ThirdPartyProviderFormProps> = () => {
  const { errors, setFieldValue, touched, values } = useFormikContext<ThirdPartyProvider>()
  const handleDeleteAction = (index: number) => {
    setFieldValue(
      'additionalWebsite',
      values?.additionalWebsite?.filter((item) => item?.index != index),
    )
  }

  const handleChangeValue = (index: number, value: string) => {
    setFieldValue('additionalWebsite', [
      ...(values?.additionalWebsite?.filter((item) => item?.index != index) || []),
      { index: index, value: value },
    ])
  }

  return (
    <Box sx={{ width: '100%', textAlign: 'left', mb: '70px' }}>
      <Box sx={{ mb: 4 }}>
        <Subtitle sx={{ fontWeight: 700, fontSize: '20px' }}>{ScheduleBuilder.PARTY_PROVIDER}</Subtitle>
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          name='providerName'
          label='Name of Provider'
          placeholder='Entry'
          fullWidth
          focused
          value={values?.providerName}
          sx={editSubjectClasses.focusBorderColor}
          onChange={(e) => {
            setFieldValue('providerName', e?.target?.value)
          }}
          error={touched.providerName && !!errors.providerName}
        />
        <Subtitle sx={editSubjectClasses.formError}>{touched.providerName && errors.providerName}</Subtitle>
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          name='courseName'
          label='Name of Course'
          placeholder='Entry'
          fullWidth
          focused
          value={values?.courseName}
          sx={editSubjectClasses.focusBorderColor}
          onChange={(e) => {
            setFieldValue('courseName', e?.target?.value)
          }}
          error={touched.courseName && !!errors.courseName}
        />
        <Subtitle sx={editSubjectClasses.formError}>{touched.courseName && errors.courseName}</Subtitle>
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          name='phoneNumber'
          label='Phone Number'
          placeholder='Entry'
          fullWidth
          focused
          value={values?.phoneNumber}
          sx={editSubjectClasses.focusBorderColor}
          onChange={(e) => {
            setFieldValue('phoneNumber', e?.target?.value)
          }}
          error={touched.phoneNumber && !!errors.phoneNumber}
        />
        <Subtitle sx={editSubjectClasses.formError}>{touched.phoneNumber && errors.phoneNumber}</Subtitle>
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          name='specificCourseWebsite'
          label='Website for Specific Course'
          placeholder='Entry'
          fullWidth
          focused
          value={values?.specificCourseWebsite}
          sx={editSubjectClasses.focusBorderColor}
          onChange={(e) => {
            setFieldValue('specificCourseWebsite', e?.target?.value)
          }}
          error={touched.specificCourseWebsite && !!errors.specificCourseWebsite}
        />
        <Subtitle sx={editSubjectClasses.formError}>
          {touched.specificCourseWebsite && errors.specificCourseWebsite}
        </Subtitle>
      </Box>
      {values?.additionalWebsite
        ?.sort((a, b) => a.index - b.index)
        .map((item, index) => (
          <Box sx={{ mb: 2, position: 'relative' }} key={index}>
            <TextField
              name={`additionalSpecificCourseWebsite-${index}`}
              label='Website for Specific Course'
              placeholder='Entry'
              fullWidth
              focused
              value={item?.value}
              sx={editSubjectClasses.focusBorderColor}
              onChange={(e) => handleChangeValue(item?.index, e?.target?.value)}
            />
            <Box
              sx={{ position: 'absolute', top: '18px', right: '-40px' }}
              onClick={() => handleDeleteAction(item?.index)}
            >
              <Tooltip title='Remove Link' placement='top'>
                <DeleteForeverOutlinedIcon
                  sx={{ cursor: 'pointer', width: '40px', color: MthColor.BLACK }}
                  fontSize='medium'
                />
              </Tooltip>
            </Box>
          </Box>
        ))}
      <Box sx={{ mb: 2, textAlign: 'right' }}>
        <a
          style={{
            color: '#4145FF',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            textDecoration: '',
            paddingLeft: '5px',
          }}
          onClick={() => {
            setFieldValue(
              'additionalWebsite',
              values?.additionalWebsite?.concat({
                index: (values?.additionalWebsite?.sort((a, b) => b.index - a.index)?.at(0)?.index || 0) + 1,
                value: '',
              }),
            )
          }}
        >
          + Add Link
        </a>
      </Box>
    </Box>
  )
}

export default ThirdPartyProviderForm
