import { Box, Button, Card, Container, Grid, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { AddStudent } from '../components/AddStudent/AddStudent'
import { useStyles } from '../styles'
import BGSVG from '../../../assets/ApplicationBG.svg'
import { StudentInput } from '../NewParent/NewParent'
import { DropDown } from '../../../components/DropDown/DropDown'
import { DropDownItem } from '../../../components/DropDown/types'
import { useMutation } from '@apollo/client'
import { AddApplicationMutation } from './service'
import { UserContext } from '../../../providers/UserContext/UserProvider'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { find } from 'lodash'

export const ExistingParent = () => {
  const onStudentFieldChanged = (idx, fieldName, value) => {
    setStudentData((prev) => {
      if (prev[idx] === undefined) {
        return [
          ...prev,
          {
            [fieldName]: value,
          },
        ]
      } else {
        const data = [...prev]
        const element = data[idx]
        element[fieldName] = value
        setStudentData(data)
      }
    })
  }
  const { me, setMe } = useContext(UserContext)
  const submitPressed = new CustomEvent('checkStudents')
  const programYearItems: DropDownItem[] = [
    {
      label: '2021-2022',
      value: '1',
    },
    {
      label: '2023-2024',
      value: '2',
    },
    {
      label: '2024-2025',
      value: '3',
    },
  ]

  const validationSchema = yup.object().shape({
    programYear: yup.string().required('Grade Level is required'),
  })

  const formik = useFormik({
    initialValues: {
      programYear: undefined,
    },
    validationSchema,
    validateOnBlur: true,
    onSubmit: () => {
      submitApplication()
    },
  })

  const AddNewStudent = (idx: number) => <AddStudent idx={idx} onFieldChange={onStudentFieldChanged} />
  const [studentData, setStudentData] = useState<Array<StudentInput>>([])
  const [students, setStudents] = useState([AddNewStudent(0)])
  const classes = useStyles

  const appendAddStudentList = () =>
    setStudents(() => {
      const element = students.length
      return [...students, AddNewStudent(element)]
    })

  const [submitApplicationAction, { data }] = useMutation(AddApplicationMutation)

  const submitApplication = async () => {
    submitApplicationAction({
      variables: {
        createApplicationInput: {
          state: 'UT',
          program_year: parseInt(formik.values.programYear),
          students: studentData,
        },
      },
    }).then((res) => {
      setMe((prev) => {
        return {
          ...prev,
          students: prev?.students?.concat(res.data.createNewStudentApplication.students),
        }
      })
    })
  }
  const setProgramYear = (id: any) => {
    formik.values.programYear = id
    const currProgramYear = find(programYearItems, { value: id })
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    document.dispatchEvent(submitPressed)
  }

  document.addEventListener('studentResponse', (e) => {
    formik.setFieldTouched('programYear', true, true)
    setTimeout(() => {
      if(!e.detail.error){
        formik.handleSubmit()
      }
    },500)
  })

  return (
    <form onSubmit={handleSubmit}>
    <Card sx={{ paddingTop: 8, margin: 4 }} >
      <Box
        paddingX={36}
        paddingTop={18}
        paddingBottom={10}
        sx={{
          backgroundImage: `url(${BGSVG})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
        style={classes.containerHeight}
        >
        <Grid container>
          <Grid item xs={12} display='flex' justifyContent={'center'}>
            <Box width={'406.73px'}>
              <DropDown
                name='programYear'
                labelTop
                dropDownItems={programYearItems}
                placeholder='Program Year'
                setParentValue={setProgramYear}
                alternate={true}
                sx={
                  !!(formik.touched.programYear && Boolean(formik.errors.programYear))
                  ? classes.textFieldError
                  : classes.textField
                }
                size='small'
                error={{
                  error: (Boolean(formik.errors.programYear)),
                  errorMsg: (formik.errors.programYear) as string
                }}
                />
            </Box>
          </Grid>

          <Grid item xs={12} display='flex' justifyContent={'center'}>
            <Box width={'451.53px'}>
              {students}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              color='secondary'
              variant='contained'
              style={classes.addStudentButton}
              onClick={appendAddStudentList}
              >
              Add Student
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant='contained' style={classes.submitButton} type='submit'>
              Submit to Utah School
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
    </form>
  )
}
