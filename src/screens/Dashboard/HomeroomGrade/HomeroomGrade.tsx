import React, { FunctionComponent, useContext } from 'react'
import { StudentGrade } from './components/StudentGrade/StudentGrade'
import Box from '@mui/material/Box'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { Avatar, Card, Stack } from '@mui/material'
import { useStyles } from './styles'
import { UserContext, UserInfo } from '../../../providers/UserContext/UserProvider'
import { map } from 'lodash'
export const HomeroomGrade: FunctionComponent = () => {
  const classes = useStyles

  const { me } = useContext(UserContext)
  const { students } = me as UserInfo

  const renderStudents = () =>
    map(students, (student) => {
      return student.status.at(-1)?.status !== 2 && <StudentGrade student={student} />
    })

  return (
    <Card style={{ borderRadius: 12 }}>
      <Box
        flexDirection='row'
        textAlign='left'
        paddingY={1.5}
        paddingX={3}
        display='flex'
        justifyContent='space-between'
      >
        <Box display='flex' justifyContent='space-between' flexDirection='column'>
          <Subtitle size='large' fontWeight='bold'>
            Students
          </Subtitle>
          {/*<Stack direction='column' spacing={1}>
            <Box display='flex' flexDirection='row' alignItems='center'>
              <Avatar sx={classes.legendBelow} variant='rounded'>
                {' '}
              </Avatar>
              <Paragraph size='medium'>Below 80%</Paragraph>
            </Box>
            <Box display='flex' flexDirection='row' alignItems='center'>
              <Avatar sx={classes.legendAbove} variant='rounded'>
                {' '}
              </Avatar>
              <Paragraph size='medium'>Above 80%</Paragraph>
            </Box>
          </Stack>*/}
        </Box>

        <Stack display='flex' justifyContent='flex-end' alignSelf='center' marginY={1} direction='row' spacing={2}>
          {renderStudents()}
        </Stack>
      </Box>
    </Card>
  )
}
