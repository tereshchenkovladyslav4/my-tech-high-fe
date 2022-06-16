import { TableRow, TableCell, Avatar, Button, AvatarGroup, Box } from '@mui/material'
import React from 'react'
import { Metadata } from '../../../../../components/Metadata/Metadata'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { TodoListTemplateType } from './types'
import SubjectIcon from '@mui/icons-material/Subject'
import { HOMEROOM, ENROLLMENT, PRIMARY_MEDIUM_MOUSEOVER, MTHORANGE } from '../../../../../utils/constants'
import { imageA } from '../../../Dashboard'
import { useHistory } from 'react-router-dom'
import { map } from 'lodash'
import { Person } from '../../../../HomeroomStudentProfile/Student/types'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'

const Row = (props) => (
  <Box display='flex' flexDirection='row' alignItems='center' justifyContent={props.content || 'flex-start'}>
    {props.children}
  </Box>
)
export const ToDoListItem: TodoListTemplateType = ({ todoItem, idx, todoDate, todoDeadline }) => {
  const history = useHistory()
  const { students } = todoItem

  const getProfilePhoto = (person: Person) => {
    if (!person.photo) return 'image'

    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + person.photo
  }

  const renderStudentAvatars = () => {
    return (
      <AvatarGroup>
        {map(todoItem.students, (student) => (
          <Avatar
            alt={`${student.person.first_name} ${student.person.last_name}`}
            src={getProfilePhoto(student.person)}
          />
        ))}
      </AvatarGroup>
    )
  }
  const link = students.length > 1 ? HOMEROOM : `${HOMEROOM + ENROLLMENT}/${students.at(-1)?.student_id}`

  return (
    !!todoItem.students.length && (
      <TableRow
        key={idx}
        sx={{
          '&:last-child td, &:last-child th': { border: 0 },
        }}
      >
        <TableCell style={{ padding: 8 }} component='th' scope='row'>
          <Metadata
            title={<Subtitle fontWeight='500'>{todoItem.phrase}</Subtitle>}
            subtitle={todoDate && <Paragraph size='medium'>{todoDate}</Paragraph>}
            image={<SubjectIcon style={{ color: 'black', marginRight: 24 }} />}
          />
        </TableCell>
        <TableCell component='th' scope='row'>
          <Box width={'100px'}>{renderStudentAvatars()}</Box>
        </TableCell>
        {todoDeadline && (
          <TableCell component='th' scope='row'>
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
                <WarningAmberOutlinedIcon fontSize='small' htmlColor={MTHORANGE} />
                <Subtitle size={12} color={MTHORANGE} sx={{ ml: 1 }}>
                  {todoDeadline}
                </Subtitle>
              </Row>
            </Box>
          </TableCell>
        )}
        <TableCell component='th' scope='row'>
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
                background: PRIMARY_MEDIUM_MOUSEOVER,
                color: 'white',
              },
            }}
          >
            {todoItem.button}
          </Button>
        </TableCell>
      </TableRow>
    )
  )
}
