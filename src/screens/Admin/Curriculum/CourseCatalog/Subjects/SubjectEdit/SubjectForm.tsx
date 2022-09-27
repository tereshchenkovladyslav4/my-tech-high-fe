import React from 'react'
import { Box, TextField, Typography } from '@mui/material'
import { useFormikContext } from 'formik'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { editSubjectClasses } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/SubjectEdit/styles'
import { Subject, SubjectFormProps } from '../types'

const SubjectForm: React.FC<SubjectFormProps> = ({ setIsChanged, periodsItems }) => {
  const { errors, handleChange, setFieldValue, touched, values } = useFormikContext<Subject>()

  return (
    <Box sx={{ width: '100%', textAlign: 'left', mb: '70px' }}>
      <Box sx={{ mb: 5 }}>
        <TextField
          name='name'
          label='Subject'
          placeholder='Entry'
          fullWidth
          value={values?.name}
          onChange={(e) => {
            handleChange(e)
            setIsChanged(true)
          }}
          error={touched.name && !!errors.name}
        />
        <Subtitle sx={editSubjectClasses.formError}>{touched.name && errors.name}</Subtitle>
      </Box>
      <Box>
        <Typography sx={{ fontSize: '18px', fontWeight: '700', lineHeight: '20px', mb: 3 }}>Periods</Typography>
        <Typography sx={{ fontSize: '18px', fontWeight: '600', lineHeight: '20px', mb: 2 }}>
          Allow this subject to appear in the following periods:
        </Typography>
        <MthCheckboxList
          checkboxLists={periodsItems}
          haveSelectAll={false}
          values={values?.PeriodIds || []}
          setValues={(value) => {
            setFieldValue('PeriodIds', value)
          }}
        />
      </Box>
    </Box>
  )
}

export default SubjectForm
