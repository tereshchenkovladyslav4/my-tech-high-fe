import React, { useEffect, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { AccordionSummary, Typography, AccordionDetails, Grid, TextField, Accordion } from '@mui/material'
import { useFormikContext } from 'formik'
import { GRADES } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { Title } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/types'
import { editTitleClasses } from './styles'

export const StateCourseCords: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<Title>()
  const [minGrade, setMinGrade] = useState<number>(Number.POSITIVE_INFINITY)
  const [maxGrade, setMaxGrade] = useState<number>(Number.NEGATIVE_INFINITY)
  const handleChangeOption = (i: number, field: string, value: string | number | null) => {
    let found = false
    let newCourses = values?.stateCourseCords?.map((course) => {
      if (course.gradeIndex === i) {
        found = true
        return { ...course, [field]: value }
      }
      return course
    })

    newCourses = newCourses ?? []
    if (!found) {
      newCourses?.push({ gradeIndex: i, stateCode: '', teacher: '', [field]: value })
    }
    setFieldValue('stateCourseCords', newCourses)
  }

  useEffect(() => {
    const grades: number[] = [values.min_grade, values.min_alt_grade, values.max_grade, values.max_alt_grade].filter(
      (item) => !!item,
    ) as number[]
    setMinGrade(Math.min(...grades, Number.POSITIVE_INFINITY))
    setMaxGrade(Math.max(...grades, Number.NEGATIVE_INFINITY))
  }, [values.min_grade, values.max_grade, values.min_alt_grade, values.max_alt_grade])

  return (
    <Accordion sx={editTitleClasses.accordion}>
      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: MthColor.MTHBLUE }} />}>
        <Typography sx={{ color: MthColor.MTHBLUE }}>State Course Codes</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {minGrade != undefined && maxGrade != undefined && minGrade < maxGrade && (
          <Grid container rowSpacing={3}>
            {GRADES.map(
              (grade, index) =>
                index >= minGrade &&
                index <= maxGrade && (
                  <Grid key={index} item xs={12}>
                    <Grid container columnSpacing={8} sx={{ alignItems: 'center' }}>
                      <Grid item xs={3}>
                        <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>
                          {grade > 0 ? `Grade ${grade}` : 'Kindergarten'}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          name='stateCode'
                          label='State Code'
                          placeholder='Entry'
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          className='MthFormField'
                          value={
                            values?.stateCourseCords?.find(
                              (code) => code?.gradeIndex === (typeof grade === 'string' ? 0 : grade),
                            )?.stateCode || ''
                          }
                          onChange={(e) => handleChangeOption(index, 'stateCode', e.target.value || null)}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          name='teacher'
                          label='Teacher'
                          placeholder='Entry'
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          className='MthFormField'
                          value={
                            values?.stateCourseCords?.find(
                              (code) => code?.gradeIndex === (typeof grade === 'string' ? 0 : grade),
                            )?.teacher || ''
                          }
                          onChange={(e) => handleChangeOption(index, 'teacher', e.target.value || null)}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                ),
            )}
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  )
}
