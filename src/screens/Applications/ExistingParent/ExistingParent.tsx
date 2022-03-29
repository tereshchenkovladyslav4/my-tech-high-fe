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

  const AddNewStudent = (idx: number) => <AddStudent idx={idx} onFieldChange={onStudentFieldChanged} />
  const [studentData, setStudentData] = useState<Array<StudentInput>>([])
  const [programYear, setProgramYear] = useState('')
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
          program_year: parseInt(programYear),
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

  return (
    <Card sx={{ paddingTop: 4 }}>
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
      >
        <Grid container>
          <Grid item xs={12} display='flex' justifyContent={'center'}>
            <Box width={'406.73px'}>
            <DropDown
              labelTop
              dropDownItems={programYearItems}
              placeholder='Program Year'
              setParentValue={setProgramYear}
              alternate={true}
              sx={classes.textField}
              size='small'
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
            <Button variant='contained' style={classes.submitButton} onClick={() => submitApplication()}>
              Submit to Utah School
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}
