import React, { useState } from 'react'
import { Grid } from '@mui/material'
import { useFormikContext } from 'formik'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { editCourseClasses } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/CourseEdit/styles'
import { Course } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/types'
import { Title } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/types'

type ValidGradesSelectorProps = {
  gradeOptions: DropDownItem[]
}

const ValidGradesSelector: React.FC<ValidGradesSelectorProps> = ({ gradeOptions }) => {
  const { errors, setFieldValue, touched, values } = useFormikContext<Title | Course>()
  const [showGradeError, setShowGradeError] = useState<boolean>(false)
  const [showAltGradeError, setShowAltGradeError] = useState<boolean>(false)

  const validateGrades = (field: string, newValue: number) => {
    const newValues = { ...values, [field]: newValue }
    const grades = [
      newValues?.min_grade || Number.NEGATIVE_INFINITY,
      newValues?.max_grade || Number.POSITIVE_INFINITY,
      newValues?.min_alt_grade || Number.NEGATIVE_INFINITY,
      newValues?.max_alt_grade || Number.POSITIVE_INFINITY,
    ]

    // Check grades
    if (grades[0] >= grades[1]) {
      setShowGradeError(true)
      return
    }
    // Check alternative grades
    if (grades[2] >= grades[3]) {
      setShowAltGradeError(true)
      return
    }
    setFieldValue(field, newValue)
  }

  return (
    <>
      <Grid item xs={6}>
        <DropDown
          dropDownItems={gradeOptions}
          placeholder='Minimum Grade Level'
          labelTop
          auto={false}
          setParentValue={(value) => {
            validateGrades('min_grade', +value)
          }}
          sx={{ m: 0 }}
          defaultValue={values?.min_grade || undefined}
          error={{ error: touched.min_grade && !!errors.min_grade, errorMsg: '' }}
        />
        <Subtitle sx={editCourseClasses.formError}>{touched.min_grade && errors.min_grade}</Subtitle>
      </Grid>
      <Grid item xs={6}>
        <DropDown
          dropDownItems={gradeOptions}
          placeholder='Maximum Grade Level'
          labelTop
          auto={false}
          setParentValue={(value) => {
            validateGrades('max_grade', +value)
          }}
          sx={{ m: 0 }}
          defaultValue={values?.max_grade || undefined}
          error={{ error: touched.max_grade && !!errors.max_grade, errorMsg: '' }}
        />
        <Subtitle sx={editCourseClasses.formError}>{touched.max_grade && errors.max_grade}</Subtitle>
      </Grid>
      <Grid item xs={6}>
        <DropDown
          dropDownItems={gradeOptions}
          placeholder='Alternative Minimum'
          labelTop
          auto={false}
          setParentValue={(value) => {
            validateGrades('min_alt_grade', +value)
          }}
          sx={{ m: 0 }}
          defaultValue={values?.min_alt_grade || undefined}
          error={{ error: touched.min_alt_grade && !!errors.min_alt_grade, errorMsg: '' }}
        />
        <Subtitle sx={editCourseClasses.formError}>{touched.min_alt_grade && errors.min_alt_grade}</Subtitle>
      </Grid>
      <Grid item xs={6}>
        <DropDown
          dropDownItems={gradeOptions}
          placeholder='Alternative Maximum'
          labelTop
          auto={false}
          setParentValue={(value) => {
            validateGrades('max_alt_grade', +value)
          }}
          sx={{ m: 0 }}
          defaultValue={values?.max_alt_grade || undefined}
          error={{ error: touched.max_alt_grade && !!errors.max_alt_grade, errorMsg: '' }}
        />
        <Subtitle sx={editCourseClasses.formError}>{touched.max_alt_grade && errors.max_alt_grade}</Subtitle>
      </Grid>
      {showGradeError && (
        <WarningModal
          title='Error'
          subtitle='The Minimum Grade Level must be less than the Maximum Grade Level.'
          btntitle='Ok'
          handleModem={() => setShowGradeError(false)}
          handleSubmit={() => setShowGradeError(false)}
          textCenter={true}
        />
      )}
      {showAltGradeError && (
        <WarningModal
          title='Error'
          subtitle='The Minimum Alternative Grade Level must be less than the Maximum Alternative Grade Level.'
          btntitle='Ok'
          handleModem={() => setShowAltGradeError(false)}
          handleSubmit={() => setShowAltGradeError(false)}
          textCenter={true}
        />
      )}
    </>
  )
}

export default ValidGradesSelector
