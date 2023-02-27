import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Typography, Grid, Box, OutlinedInput, InputAdornment, Button } from '@mui/material'
import { useFormikContext } from 'formik'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { useSubjects } from '@mth/hooks'
import { editCourseClasses } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/CourseEdit/styles'
import { Course, CourseTitlesProps } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/types'
import { Subject, Title } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/types'

export const CourseTitles: React.FC<CourseTitlesProps> = ({ schoolYearId }) => {
  const { values, setFieldValue, touched, errors } = useFormikContext<Course>()

  const [searchField, setSearchField] = useState<string>('')
  const [titleItems, setTitleItems] = useState<CheckBoxListVM[]>([])
  const [allTitleItems, setAllTitleItems] = useState<CheckBoxListVM[]>([])
  const [filteredTitleItems, setFilteredTitleItems] = useState<CheckBoxListVM[]>([])
  const [selectedItems, setSelectedItems] = useState<CheckBoxListVM[]>([])

  const { subjects, dropdownItems: subjectItems } = useSubjects(schoolYearId, '', true, true)

  const handleUnmapAction = (titleId: string) => {
    setFieldValue(
      'TitleIds',
      values?.TitleIds?.filter((item) => item != titleId),
    )
  }

  useEffect(() => {
    let allItems: CheckBoxListVM[] = []
    subjects?.forEach((subject: Subject) => {
      const { Titles } = subject
      const items = (Titles || []).map((item: Title): CheckBoxListVM => {
        return {
          label: `${subject.name} - ${item.name}`,
          value: item.title_id.toString(),
        }
      })
      allItems = allItems.concat(items)
    })
    setAllTitleItems(allItems)
    if ((values.subject_id === -1 || !values.subject_id) && subjects?.length) {
      setTitleItems(allItems)
    } else {
      const subject: Subject | undefined = subjects.find((item) => item.subject_id == values.subject_id)
      if (subject) {
        const { Titles } = subject
        setTitleItems(
          (Titles || []).map((item: Title): CheckBoxListVM => {
            return {
              label: `${subject.name} - ${item.name}`,
              value: item.title_id.toString(),
            }
          }),
        )
      }
    }
  }, [values.subject_id, subjects])

  useEffect(() => {
    setSelectedItems(allTitleItems?.filter((x) => (values?.TitleIds || []).findIndex((y) => x.value == y) > -1))
  }, [values.TitleIds, allTitleItems])

  useEffect(() => {
    if (searchField) {
      setFilteredTitleItems(titleItems.filter((item) => item.label.toLowerCase().includes(searchField.toLowerCase())))
    } else {
      setFilteredTitleItems(titleItems)
    }
  }, [searchField, titleItems])

  return (
    <Grid container columnSpacing={4}>
      <Grid item xs={12}>
        <Typography sx={{ fontSize: '18px', fontWeight: '700', mb: 1 }}>Mapped Subjects</Typography>
        {(selectedItems || []).map((item, index) => (
          <Button
            key={index}
            variant='text'
            sx={{
              background: MthColor.BUTTON_LINEAR_GRADIENT,
              color: MthColor.WHITE,
              borderRadius: 2,
              textTransform: 'none',
              height: 25,
              whiteSpace: 'nowrap',
              mr: 2,
            }}
            onBlur={() => {}}
            onClick={() => handleUnmapAction(item.value)}
          >
            {item.label}
          </Button>
        ))}
        <Subtitle sx={editCourseClasses.formError}>{touched.TitleIds && errors.TitleIds}</Subtitle>
      </Grid>
      <Grid item xs={6} sx={{ mt: 5 }}>
        <DropDown
          dropDownItems={subjectItems}
          placeholder='Subject'
          labelTop
          setParentValue={(value) => {
            setFieldValue('subject_id', +value)
          }}
          sx={{ m: 0 }}
          defaultValue={-1}
        />
      </Grid>

      <Grid item xs={7} sx={{ mt: 2 }}>
        <Box sx={{ width: { xs: '100%', md: '280px' } }}>
          <OutlinedInput
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'Search...')}
            size='small'
            fullWidth
            value={searchField || ''}
            placeholder='Search...'
            onChange={(e) => setSearchField(e.target.value)}
            startAdornment={
              <InputAdornment position='start'>
                <SearchIcon style={{ color: 'black' }} />
              </InputAdornment>
            }
          />
        </Box>
      </Grid>

      <Grid item xs={12} sx={{ mt: 2 }}>
        <Box sx={{ border: `1px solid ${MthColor.GRAY}`, p: 1 }}>
          <MthCheckboxList
            checkboxLists={filteredTitleItems}
            haveSelectAll={false}
            values={values?.TitleIds || []}
            setValues={(value) => {
              setFieldValue('TitleIds', value)
            }}
          />
        </Box>
      </Grid>
    </Grid>
  )
}

export default CourseTitles
