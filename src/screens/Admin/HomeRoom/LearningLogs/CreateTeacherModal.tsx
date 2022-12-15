import React, { FunctionComponent, useState, useContext, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import {
  Button,
  InputAdornment,
  OutlinedInput,
  Modal,
  TextField,
  Typography,
  ListItemButton,
  ListItemText,
  List,
  IconButton,
} from '@mui/material'
import { Box } from '@mui/system'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { BUTTON_LINEAR_GRADIENT } from '../../../../utils/constants'
import { searchTeacher } from '../services'
import { useStyles as masterStyle } from '../styles'
import { Classes, Master, Teacher } from './types'

type CreateTeacherModalProps = {
  master: Master
  handleClose?: () => void
  handleCreateSubmit?: (
    classId: number | undefined,
    className: string,
    primary: string | undefined,
    addTeachers: Teacher[],
  ) => void
  selectedClasses: Classes | null | undefined
}

export const CreateTeacherModal: FunctionComponent<CreateTeacherModalProps> = ({
  master,
  handleCreateSubmit,
  handleClose,
  selectedClasses,
}) => {
  const classes = masterStyle
  const { me } = useContext(UserContext)

  const [primarySearchListView, setPrimarySearchListView] = useState(false)

  const [teacherList, setTeacherList] = useState<Teacher[]>([])

  const [primarySearchField, setPrimarySearchField] = useState<string>('')
  const [primarySearchList, setPrimarySearchList] = useState([])
  const [primaryTeacher, setPrimaryTeacher] = useState<Teacher | null>(null)

  const [additionalSearchField, setAdditionalSearchField] = useState<string>('')
  const [additionalTeachers, setAdditionalTeachers] = useState<Teacher[]>([])

  const [checkedTeachers, setCheckedTeachers] = useState<Teacher[]>([])

  useEffect(() => {
    if (selectedClasses) {
      setPrimaryTeacher(teacherList.find((item: Teacher) => item.user_id === selectedClasses?.primaryTeacher?.user_id))
      const addTeachers = JSON.parse(selectedClasses?.addition_id)
      if (addTeachers?.length > 0) {
        setCheckedTeachers(addTeachers)
      }
    }
  }, [selectedClasses, teacherList])

  const handleAdditionalTeacher = (isChecked: boolean, teacher: Teacher) => {
    if (isChecked) {
      setCheckedTeachers([...checkedTeachers, teacher])
    } else {
      setCheckedTeachers(checkedTeachers.filter((item) => item.user_id !== teacher.user_id))
    }
  }

  const { loading: techerInfosLoading, data: techerInfos } = useQuery(searchTeacher, {
    variables: {
      searchPrimaryTeacher: {
        region_id: me?.selectedRegionId,
      },
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!primarySearchField) {
      setPrimarySearchList([])
    } else {
      setPrimarySearchList(
        teacherList.filter(
          (teacher: Teacher) =>
            teacher?.first_name.toLowerCase()?.includes(primarySearchField.toLowerCase()) ||
            teacher?.last_name.toLowerCase()?.includes(primarySearchField.toLowerCase()),
        ),
      )
    }
  }, [primarySearchField])

  useEffect(() => {
    if (!additionalSearchField) {
      setAdditionalTeachers(teacherList)
    } else {
      setAdditionalTeachers(
        teacherList.filter(
          (teacher: Teacher) =>
            teacher?.first_name.toLowerCase()?.includes(additionalSearchField.toLowerCase()) ||
            teacher?.last_name.toLowerCase()?.includes(additionalSearchField.toLowerCase()),
        ),
      )
    }
  }, [additionalSearchField])

  const changeHandler = (event: string) => {
    setPrimarySearchField(event)
  }

  // const debouncedChangeHandler = useCallback(debounce(changeHandler, 300), [])

  useEffect(() => {
    if (!techerInfosLoading && techerInfos && techerInfos?.getTeacherListBySearchField) {
      setTeacherList(
        techerInfos.getTeacherListBySearchField.sort((a, b) =>
          a.first_name.toLowerCase() > b.first_name.toLowerCase() ? 1 : -1,
        ),
      )
      setAdditionalTeachers(techerInfos.getTeacherListBySearchField)
    }
  }, [techerInfosLoading, techerInfos])

  const handleListItemClick = (personInfo: Teacher) => {
    setPrimaryTeacher(personInfo)
  }

  const removePrimaryTecher = () => {
    setPrimaryTeacher(null)
    setPrimarySearchField('')
  }

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={classes.modalCard}>
        <Box
          sx={{
            p: 1,
          }}
        >
          <Formik
            initialValues={{
              class_name: selectedClasses?.class_name ? selectedClasses.class_name : '',
            }}
            enableReinitialize={true}
            validationSchema={Yup.object({
              class_name: Yup.string().required('Required'),
            })}
            onSubmit={async (values) => {
              await handleCreateSubmit(
                selectedClasses?.class_id,
                values.class_name,
                primaryTeacher?.user_id,
                checkedTeachers,
              )
            }}
          >
            {({ setFieldValue, values }) => {
              return (
                <Form>
                  <Box sx={{ ...classes.content, display: 'flex', alignItems: 'center', px: 5 }}>
                    <Box sx={{ width: '80%' }}>
                      <Box>
                        <TextField
                          label='Master'
                          placeholder='Entry'
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          className='MthFormField'
                          value={master.master_name}
                        />
                      </Box>
                      <Field name={'class_name'} fullWidth focused>
                        {({ meta }) => (
                          <Box sx={{ marginTop: '30px' }}>
                            <TextField
                              name='class_name'
                              label='Class Name'
                              placeholder='Entry'
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFieldValue('class_name', e.target.value)
                              }}
                              className='MthFormField'
                              error={meta.touched && !!meta.error}
                              value={values['class_name']}
                            />
                            <Subtitle sx={classes.formError}>{meta.touched && meta.error}</Subtitle>
                          </Box>
                        )}
                      </Field>
                      <Box sx={{ marginTop: '30px' }}>
                        {!primaryTeacher ? (
                          <>
                            <TextField
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position='start'>
                                    <SearchIcon style={{ color: 'black' }} />
                                  </InputAdornment>
                                ),
                                style: { fontSize: '18px' },
                              }}
                              fullWidth
                              placeholder='Search'
                              label='Primary Teacher'
                              className='MthFormField'
                              onFocus={() => {
                                setPrimarySearchListView(true)
                              }}
                              onBlur={() => {
                                setTimeout(() => {
                                  setPrimarySearchField('')
                                  setPrimarySearchList([])
                                  setPrimarySearchListView(false)
                                }, 300)
                              }}
                              onChange={(e) => changeHandler(e.target.value)}
                              value={primarySearchField}
                            />
                            {primarySearchListView && primarySearchList.length > 0 && (
                              <Box sx={classes.searchList}>
                                <List arial-label='main mailbox folders'>
                                  {primarySearchList.map((personInfo: Teacher) => (
                                    <ListItemButton
                                      key={personInfo.user_id}
                                      onClick={() => handleListItemClick(personInfo)}
                                    >
                                      <ListItemText primary={personInfo?.first_name + ' ' + personInfo?.last_name} />
                                    </ListItemButton>
                                  ))}
                                </List>
                              </Box>
                            )}
                          </>
                        ) : (
                          <TextField
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position='start'>
                                  <IconButton aria-label='delete' onClick={() => removePrimaryTecher()}>
                                    <CloseIcon style={{ color: 'black' }} />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            fullWidth
                            label='Primary Teacher'
                            value={primaryTeacher.first_name + ' ' + primaryTeacher.last_name}
                          />
                        )}
                      </Box>

                      <Box sx={{ marginTop: '10px' }}>
                        <Typography fontSize='18' fontWeight='800'>
                          Additional Teachers
                        </Typography>
                        <Box sx={{ minHeight: '50px', maxHeight: '70px', overflow: 'auto' }}>
                          {checkedTeachers.map((teacher) => (
                            <Button
                              sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                height: 29,
                                background: BUTTON_LINEAR_GRADIENT,
                                color: 'white',
                                marginRight: '12px',
                                marginBottom: '6px',
                                whiteSpace: 'nowrap',
                              }}
                              type='button'
                              key={teacher.user_id}
                            >
                              {teacher.first_name + ' ' + teacher.last_name}
                            </Button>
                          ))}
                        </Box>
                      </Box>
                      <Box sx={{ width: { xs: '100%', md: '280px' }, marginTop: '5px' }}>
                        <OutlinedInput
                          size='small'
                          fullWidth
                          value={additionalSearchField}
                          placeholder='Search...'
                          onChange={(e) => setAdditionalSearchField(e.target.value)}
                          startAdornment={
                            <InputAdornment position='start'>
                              <SearchIcon style={{ color: 'black' }} />
                            </InputAdornment>
                          }
                        />
                      </Box>
                      <Box sx={{ border: 'solid 1px #CCCCCC', marginTop: '20px', height: '30vh', overflow: 'auto' }}>
                        {additionalTeachers?.map((teacher: Teacher) => (
                          <Box sx={{ width: '100%' }} key={teacher.user_id}>
                            <MthCheckbox
                              color='primary'
                              size='medium'
                              label={teacher?.first_name + ' ' + teacher?.last_name}
                              checked={checkedTeachers.find((t) => t.user_id === teacher.user_id) ? true : false}
                              onChange={(_e, checked) => handleAdditionalTeacher(checked, teacher)}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      width: '100%',
                      marginTop: '50px',
                    }}
                  >
                    <Button
                      variant='contained'
                      color='secondary'
                      disableElevation
                      sx={classes.cancelButton}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <Button variant='contained' disableElevation sx={classes.submitButton} type='submit'>
                      Save
                    </Button>
                  </Box>
                </Form>
              )
            }}
          </Formik>
        </Box>
      </Box>
    </Modal>
  )
}
