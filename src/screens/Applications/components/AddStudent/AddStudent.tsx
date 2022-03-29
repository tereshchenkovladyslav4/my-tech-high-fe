import { Box, Divider, Grid, TextField } from '@mui/material'
import { first, map } from 'lodash'
import React, { useEffect, useState } from 'react'
import { DropDown } from '../../../../components/DropDown/DropDown'
import { DropDownItem } from '../../../../components/DropDown/types'
import { GRADES, SYSTEM_05, SYSTEM_07 } from '../../../../utils/constants'
import { useStyles } from './styles'
import { AddStudentTemplate } from './types'
import { outlinedInputClasses } from '@mui/material'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { useFormik } from 'formik';
import * as yup from 'yup';

export const AddStudent: AddStudentTemplate = ({ idx, onFieldChange, handleRemoveStudent, yearLabel }) => {
  const classes = useStyles
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')
  const [year, setYear] = useState(yearLabel)

  const setFormikFirstName = (e) => {
    formik.handleChange(e)
    setFirstName(e.target.value)
  }

  const setFormikLastName = (e) => {
    formik.handleChange(e)
    setLastName(e.target.value)
  }
  
  const setFormikGradeLevel = (id) => {
    formik.values.gradeLevel = id
    setGradeLevel(formik.values.gradeLevel)
  } 


  const validationSchema = yup.object({
      gradeLevel: yup
      .string()
      .required('Program Year is required'),
    firstName: yup
      .string()
      .required('First Name is required'),
    lastName: yup
      .string()
      .required('Last Name is required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: undefined,
      gradeLevel: undefined,
      lastName: undefined,
    },
    validationSchema,
    onSubmit: () => {
      
    },
  });

  useEffect(() => {
    if (firstName !== '') {
      onFieldChange(idx, 'first_name', firstName)
    }
  }, [firstName])

  useEffect(() => {
    if (gradeLevel !== '') {
      onFieldChange(idx, 'grade_level', gradeLevel)
    }
  }, [gradeLevel])

  useEffect(() => {
    if (lastName !== '') {
      onFieldChange(idx, 'last_name', lastName)
    }
  }, [lastName])


  const parseGrades = map(GRADES, (grade) => {
    return {
      label: grade,
      value: grade.toString()
    }
  })

  document.addEventListener('checkStudents', () => formik.handleSubmit())
  document.addEventListener('yearChanged', (e) => setYear(e.detail.yearLabel))
  
  return (
    <form>
    <Box display={'flex'} flexDirection='column'>
      <Box width={idx === 0 ? '100%' : '103.9%'} display='flex' flexDirection='row' alignItems={'center'}>
        <TextField
          size='small'
          name='firstName'
          label='Student First Name'
          focused
          variant='outlined'
          sx={
            !!(formik.touched.firstName && Boolean(formik.errors.firstName))
              ? classes.textFieldError
              : classes.textfield
          }
          inputProps={{
            style: { color: 'black' },
          }}
          value={formik.values.firstName}
          onChange={setFormikFirstName}
          InputLabelProps={{
            style: { color: SYSTEM_05 },
          }}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
        />
        { 
          idx !== 0 
          && <DeleteForeverOutlinedIcon 
            sx={{left: 12, position: 'relative', color: 'darkgray'}}
            onClick={() => handleRemoveStudent(idx)}
          />
        }
      </Box>
        <TextField
          size='small'
          name='lastName'
          label='Student Last Name'
          focused
          variant='outlined'
          sx={
            !!(formik.touched.lastName && Boolean(formik.errors.lastName))
              ? classes.textFieldError
              : classes.textfield
          }
          inputProps={{
            style: { color: 'black' },
          }}
          value={formik.values.lastName}
          onChange={setFormikLastName}
          InputLabelProps={{
            style: { color: SYSTEM_05 },
          }}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
        />
        <DropDown
          name='gradeLevel'
          labelTop
          placeholder={`Student Grade Level (age) as of September 1, ${year ?? 2022}`}
          dropDownItems={parseGrades}
          setParentValue={setFormikGradeLevel}
          alternate={true}
          sx={
            !!(formik.touched.gradeLevel && Boolean(formik.errors.gradeLevel))
              ? classes.textFieldError
              : classes.dropdown
          }
          size='small'
          error={{
            error: !!(formik.touched.gradeLevel && Boolean(formik.errors.gradeLevel)),
            errorMsg: (formik.touched.gradeLevel && formik.errors.gradeLevel) as string,
          }}
        />
        <Box
          display={'flex'}
          justifyContent={'center'}
        >
          {
            idx !== 0
            && <Divider
              sx={{ 
                marginY: 1,
                width: '80%', 
                alignSelf: 'center' 
                }} 
            />
          }
        </Box>
    </Box>
    </form>
  )
}
