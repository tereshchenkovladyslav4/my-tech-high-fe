import React, { useState, useEffect } from 'react'
import SubjectIcon from '@mui/icons-material/Subject'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { Avatar, AvatarGroup, Box, Button, Card, TableCell, TableRow } from '@mui/material'
import { map } from 'lodash'
import { useHistory, useLocation } from 'react-router-dom'
import { Metadata } from '@mth/components/Metadata/Metadata'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthRoute, MthColor } from '@mth/enums'
import { getWindowDimension } from '@mth/utils'
import { Person } from '../../../../HomeroomStudentProfile/Student/types'
import { ToDoCategory, TodoListItemProps } from './types'

const Row = (props: unknown) => (
  <Box display='flex' flexDirection='row' alignItems='center' justifyContent={props.content || 'flex-start'}>
    {props.children}
  </Box>
)

export const ToDoListItem: React.FC<TodoListItemProps> = ({ todoItem, todoDate, todoDeadline }) => {
  const history = useHistory()
  const { students } = todoItem
  const [link, setLink] = useState<string>('')
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimension())
  const location = useLocation()

  const getProfilePhoto = (person: Person) => {
    if (!person.photo) return 'image'

    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + person.photo
  }

  const renderStudentAvatars = () => {
    return (
      <AvatarGroup style={{ justifyContent: 'flex-end' }}>
        {map(todoItem.students, (student, index) => (
          <Avatar
            key={index}
            alt={`${student.person.first_name} ${student.person.last_name}`}
            src={getProfilePhoto(student.person)}
          />
        ))}
      </AvatarGroup>
    )
  }

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimension())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    switch (todoItem.category) {
      case ToDoCategory.SUBMIT_WITHDRAW: {
        setLink(`${MthRoute.PARENT_LINK}${MthRoute.SUBMIT_WITHDRAWAL}/${students.at(-1)?.student_id}`)
        break
      }
      case ToDoCategory.SUBMIT_SCHEDULE:
      case ToDoCategory.SUBMIT_SECOND_SEMESTER_SCHEDULE: {
        setLink(`${MthRoute.HOMEROOM}${MthRoute.SUBMIT_SCHEDULE}/${students.at(-1)?.student_id}`)
        break
      }
      case ToDoCategory.RESUBMIT_SECOND_SEMESTER_SCHEDULE:
      case ToDoCategory.RESUBMIT_SCHEDULE: {
        setLink(
          `${MthRoute.HOMEROOM}${MthRoute.SUBMIT_SCHEDULE}/${students.at(-1)?.student_id}?backTo=${location.pathname}`,
        )
        break
      }
      default: {
        setLink(
          students.length > 1
            ? MthRoute.HOMEROOM
            : `${MthRoute.HOMEROOM + MthRoute.ENROLLMENT}/${students.at(-1)?.student_id}`,
        )
      }
    }
  }, [todoItem, students])

  return (
    (!!todoItem.students.length &&
      (windowDimensions.width >= 900 ? (
        <TableRow
          sx={{
            '&:last-child td, &:last-child th': { border: 0 },
          }}
        >
          <TableCell style={{ width: '40%' }} sx={{ paddingX: '8px' }} component='th' scope='row'>
            <Metadata
              title={<Subtitle fontWeight='500'>{todoItem.phrase}</Subtitle>}
              subtitle={
                todoDate && (
                  <Paragraph size='medium' color={MthColor.SYSTEM_06}>
                    {todoDate}
                  </Paragraph>
                )
              }
              image={<SubjectIcon style={{ color: 'black', marginRight: 24 }} />}
            />
          </TableCell>
          <TableCell component='th' scope='row' sx={{ paddingX: '8px' }} style={{ width: '40%' }}>
            <Box>{renderStudentAvatars()}</Box>
          </TableCell>
          {todoDeadline && (
            <TableCell component='th' scope='row' sx={{ paddingX: '8px' }} style={{ width: '10%' }}>
              <Box
                sx={{
                  borderRadius: 1,
                  background: 'rgba(236, 89, 37, 0.1)',
                  width: 72,
                  height: 28,
                  display: 'flex',
                  justifyContent: 'center',
                  mr: 4,
                  padding: 0.4,
                }}
              >
                <Row>
                  <WarningAmberOutlinedIcon fontSize='small' htmlColor={MthColor.MTHORANGE} />
                  <Subtitle size={12} color={MthColor.MTHORANGE} sx={{ ml: 1 }}>
                    {todoDeadline}
                  </Subtitle>
                </Row>
              </Box>
            </TableCell>
          )}
          <TableCell component='th' scope='row' sx={{ paddingX: '8px' }} style={{ width: '10%' }}>
            <Button
              onClick={() => history.push(link)}
              variant='contained'
              sx={{
                borderRadius: 2,
                fontSize: 12,
                background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
                width: 140,
                height: 48,
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': {
                  background: MthColor.PRIMARY_MEDIUM_MOUSEOVER,
                  color: 'white',
                },
              }}
            >
              {todoItem.button}
            </Button>
          </TableCell>
        </TableRow>
      ) : (
        <>
          <Box
            sx={{
              display: { xs: 'none', sm: 'block' },
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '6px',
              marginTop: '15px',
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Metadata
                title={<Subtitle fontWeight='500'>{todoItem.phrase}</Subtitle>}
                subtitle={
                  todoDate && (
                    <Paragraph size='medium' color={MthColor.SYSTEM_06}>
                      {todoDate}
                    </Paragraph>
                  )
                }
                image={<SubjectIcon style={{ color: 'black', marginRight: 24 }} />}
              />
            </Box>
            <Box
              sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '12px' }}
            >
              <Box sx={{ marginRight: '24px' }}>{renderStudentAvatars()}</Box>
              {todoDeadline && (
                <Box
                  sx={{
                    borderRadius: 1,
                    background: 'rgba(236, 89, 37, 0.1)',
                    width: 72,
                    height: 28,
                    display: 'flex',
                    justifyContent: 'center',
                    mr: 4,
                    padding: 0.4,
                  }}
                >
                  <Row>
                    <WarningAmberOutlinedIcon fontSize='small' htmlColor={MthColor.MTHORANGE} />
                    <Subtitle size={12} color={MthColor.MTHORANGE} sx={{ ml: 1 }}>
                      {todoDeadline}
                    </Subtitle>
                  </Row>
                </Box>
              )}
            </Box>
            <Button
              onClick={() => history.push(link)}
              variant='contained'
              sx={{
                borderRadius: 2,
                fontSize: 12,
                background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
                width: '100%',
                height: 48,
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': {
                  background: MthColor.PRIMARY_MEDIUM_MOUSEOVER,
                  color: 'white',
                },
                marginTop: '24px',
              }}
            >
              {todoItem.button}
            </Button>
          </Box>
          <Card
            elevation={2}
            sx={{
              display: { xs: 'flex', sm: 'none' },
              borderRadius: 2,
              paddingX: 2,
              marginY: 1,
              flexDirection: 'column',
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Metadata
                title={<Subtitle fontWeight='500'>{todoItem.phrase}</Subtitle>}
                subtitle={
                  todoDate && (
                    <Paragraph size='medium' color={MthColor.SYSTEM_06}>
                      {todoDate}
                    </Paragraph>
                  )
                }
                image={<SubjectIcon style={{ color: 'black', marginRight: 24 }} />}
              />
            </Box>
            <Box
              sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '12px' }}
            >
              <Box sx={{ marginRight: '24px' }}>{renderStudentAvatars()}</Box>
              {todoDeadline && (
                <Box
                  sx={{
                    borderRadius: 1,
                    background: 'rgba(236, 89, 37, 0.1)',
                    width: 72,
                    height: 28,
                    display: 'flex',
                    justifyContent: 'center',
                    mr: 4,
                    padding: 0.4,
                  }}
                >
                  <Row>
                    <WarningAmberOutlinedIcon fontSize='small' htmlColor={MthColor.MTHORANGE} />
                    <Subtitle size={12} color={MthColor.MTHORANGE} sx={{ ml: 1 }}>
                      {todoDeadline}
                    </Subtitle>
                  </Row>
                </Box>
              )}
            </Box>
            <Button
              onClick={() => history.push(link)}
              variant='contained'
              sx={{
                borderRadius: 2,
                fontSize: 12,
                background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
                width: '100%',
                height: 48,
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': {
                  background: MthColor.PRIMARY_MEDIUM_MOUSEOVER,
                  color: 'white',
                },
                marginTop: '12px',
                marginBottom: { xs: '12px', sm: '0px' },
              }}
            >
              {todoItem.button}
            </Button>
          </Card>
        </>
      ))) || <></>
  )
}
