import { Box, Button, Card, Grid, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useStyles } from '../styles'
import BGSVG from '../../../assets/ApplicationBG.svg'
import { DropDown } from '../../../components/DropDown/DropDown'
import { DropDownItem } from '../../../components/DropDown/types'
import { gql, useMutation, useQuery } from '@apollo/client'
import { AddApplicationMutation } from './service'
import { UserContext } from '../../../providers/UserContext/UserProvider'
import { Formik, FieldArray, Form, Field } from 'formik'
import * as yup from 'yup'
import { map, toNumber } from 'lodash'
import { GRADES, RED, SYSTEM_05 } from '../../../utils/constants'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { array, object, string } from 'yup'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import moment from 'moment'

export const getRegionByUserId = gql`
  query UserRegionByUserId($userId: ID!) {
    userRegionByUserId(user_id: $userId) {
      region_id
    }
  }
`

export const getActiveSchoolYearsByRegionId = gql`
  query GetActiveSchoolYears($regionId: ID!) {
    getActiveSchoolYears(region_id: $regionId) {
      date_begin
      date_end
      date_reg_close
      date_reg_open
    }
  }
`

export const ExistingParent = () => {
  const emptyStudent = { first_name: '', last_name: '', grade_level: undefined}
  const { me, setMe } = useContext(UserContext)
  const [schoolYears, setSchoolYears] = useState<Array<DropDownItem>>([])
  const [regionId, setRegionId] = useState<string>('')
  const { loading: regionLoading, data: regionData } = useQuery(getRegionByUserId, {
    variables: {
      userId: me?.user_id
    },
    skip: regionId == '' ? false : true,
    fetchPolicy: 'network-only',
  })

  const { loading: schoolLoading, data: schoolYearData } = useQuery(getActiveSchoolYearsByRegionId, {
    variables: {
      regionId: regionId
    },
    fetchPolicy: 'network-only',
  })

  const classes = useStyles

  const [submitApplicationAction, { data }] = useMutation(AddApplicationMutation)

  const submitApplication = async (data) => {
    submitApplicationAction({
      variables: {
        createApplicationInput: {
          state: 'UT',
          program_year: data.programYear,
          students: data.students,
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

  const parseGrades = map(GRADES, (grade) => {
    return {
      label: grade,
      value: grade.toString()
    }
  })

  useEffect(() => {
    if (!regionLoading && regionData) {
      setRegionId(regionData?.userRegionByUserId[0].region_id)
    }
  }, [me?.user_id, regionData])

  useEffect(() => {
    if (!schoolLoading && schoolYearData?.getActiveSchoolYears) {
      setSchoolYears(
        schoolYearData?.getActiveSchoolYears.map((item) => {
          return {
            label: moment(item.date_begin).format('YYYY') + '-' + moment(item.date_end).format('YYYY'),
            value: item.school_year_id,
          }
        }),
      )
    }
  }, [regionId, schoolYearData])

  return (
    <Card sx={{ paddingTop: 8, margin: 4 }} >
      <Formik
        initialValues={{
          programYear: undefined,
          students: [emptyStudent],
        }}
        validationSchema={object({
          programYear: string()
            .required('Program year is required'),
          students: array(
            object({
              first_name: string()
                .required('First name name needed'),
              last_name: string()
                .required('Last name needed'),
              grade_level: string()
                .required('Grade Level is required'),
            })
          )
        })}
        onSubmit={async (values) => {
          await submitApplication(values)
        }}
      > 
        {({ values, errors, isSubmitting, isValid, }) => (
          <Form>
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
                  <Field 
                    name='programYear'
                    fullWidth
                    focused
                  >
                  {({ field, form, meta }) => (
                    <Box width={'100%'} display='block'>
                    <DropDown
                      name='programYear'
                      labelTop
                      placeholder='Program Year'
                      dropDownItems={schoolYears}
                      setParentValue={(id) => {
                        form.setFieldValue(field.name, toNumber(id))
                      }}
                      alternate={true}
                      size='small'
                      sx={
                        !!(meta.touched && meta.error)
                          ? classes.textFieldError
                          : classes.dropdown
                      }
                      error={{
                        error: !!(meta.touched && meta.error),
                        errorMsg: (meta.touched &&  meta.error) as string,
                      }}
                    />
                    </Box>
                  )}
                </Field>
                </Box>
              </Grid>
              <Grid item xs={12} display='flex' justifyContent={'center'}>
                <Box width={'451.53px'}>
                  <FieldArray name="students">
                    {({ push, remove }) => (
                      <>
                        {values.students.map((_, index) => (
                            <Grid item container spacing={2} xs={12} sm="auto">
                              <Grid item xs={12}>
                                <Box 
                                  width={index === 0 ? '100%' : '103.9%'} 
                                  display='flex' 
                                  flexDirection='row' 
                                  alignItems={'center'}
                                >
                                  <Field 
                                    name={`students[${index}].first_name`}
                                    fullWidth
                                    focused
                                  >
                                    {({ field, form, meta }) => (
                                      <Box width={'100%'}>
                                        <TextField 
                                          type="text"
                                          size='small'
                                          label='Student First Name'
                                          focused
                                          variant='outlined'
                                          sx={
                                            !!(meta.touched && meta.error)
                                              ? classes.textFieldError
                                              : classes.textfield
                                          }
                                          inputProps={{
                                            style: { color: 'black' },
                                          }}
                                          InputLabelProps={{
                                            style: { color: SYSTEM_05 },
                                          }}
                                          {...field}
                                          error={meta.touched && meta.error}
                                          helperText={meta.touched && meta.error}
                                        />
                                      </Box>
                                    )}
                                  </Field>
                                  {
                                    index !== 0
                                    ? <DeleteForeverOutlinedIcon 
                                        sx={{left: 12, position: 'relative', color: 'darkgray'}}
                                        onClick={() => remove(index)}
                                      />
                                    : null
                                  }
                                </Box>
                              </Grid>
                              <Grid item xs={12}>
                                <Field 
                                  name={`students[${index}].last_name`}
                                  fullWidth
                                  focused
                                >
                                  {({ field, form, meta }) => (
                                    <Box width={'100%'}>
                                      <TextField
                                        type="text"
                                        size='small'
                                        label='Student Last Name'
                                        focused
                                        variant='outlined'
                                        sx={
                                          !!(meta.touched && meta.error)
                                            ? classes.textFieldError
                                            : classes.textfield
                                        }
                                        inputProps={{
                                          style: { color: 'black' },
                                        }}
                                        InputLabelProps={{
                                          style: { color: SYSTEM_05 },
                                        }}
                                        {...field}
                                        error={meta.touched && meta.error}
                                        helperText={meta.touched &&  meta.error}
                                      />
                                    </Box>
                                  )}
                                </Field>
                              </Grid>
                              <Grid item xs={12}>
                                <Field 
                                  name={`students[${index}].grade_level`}
                                  fullWidth
                                  focused
                                >
                                  {({ field, form, meta }) => (
                                    <Box width={'100%'}>
                                    <DropDown
                                      name={`students[${index}].grade_level`}
                                      labelTop
                                      placeholder={`Student Grade Level (age) as of September 1, ${2022}`}
                                      dropDownItems={parseGrades}
                                      setParentValue={(id) => {
                                        form.setFieldValue(field.name, id)
                                      }}
                                      alternate={true}
                                      size='small'
                                      sx={
                                        !!(meta.touched && meta.error)
                                          ? classes.textFieldError
                                          : classes.dropdown
                                      }
                                      error={{
                                        error: !!(meta.touched && meta.error),
                                        errorMsg: (meta.touched && meta.error) as string,
                                      }}
                                    />
                                    </Box>
                                  )}
                                </Field>
                              </Grid>
                            </Grid>
                        ))}
                        <Grid item>
                          {typeof errors.students === 'string' ? (
                            <Paragraph color={RED}>
                              {errors.students}
                            </Paragraph>
                          ) : null}
                        </Grid>
                        <Grid item>
                          <Button
                            color='secondary'
                            variant='contained'
                            style={classes.addStudentButton}
                            onClick={() => push(emptyStudent)}
                          >
                            Add Student
                          </Button>
                        </Grid>
                      </>
                    )}
                  </FieldArray>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant='contained' 
                  style={classes.submitButton} 
                  type='submit'
                >
                  Submit to Utah School
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Form>
      )}
    </Formik>
  </Card>
  )
}