import { Box, Button, Card, Divider, } from '@mui/material'
import { filter, find, includes, map } from 'lodash'
import React, { useContext, useState } from 'react'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { Title } from '../../../components/Typography/Title/Title'
import { UserContext, UserInfo } from '../../../providers/UserContext/UserProvider'
import { Student } from './Student/Student'


export const Students = () => {

  const { me } = useContext(UserContext)
  const { students } = me as UserInfo

  const [showInactiveButton] = useState(filter(students, (student) => student.status.at(-1)?.status === 2).length > 0)
  const [showInactiveStudents, setShowInactiveStudents] = useState(false)

  map(students, (student) => console.log())

  const renderStudents = () =>
    map(students!, (student) => {
      if(student.status.at(-1)?.status !== 2)
      return <Student student={student}/>
    })

  const renderInactiveStudents = () =>
    map(showInactiveButton, (student) => {
      return <Student student={student}/>
    })

  return (
    <Card sx={{ paddingY: 4, paddingX: 8 }}>
      <Box display='flex' flexDirection='column'>
        <Title textAlign='left'>Students</Title>
        <Box 
          display='flex' 
          flexDirection='row' 
          justifyContent='center' 
          sx={{ paddingY: 10, paddingX: 8 }}
          flexWrap='wrap'
        >
          {renderStudents()}

        </Box>
        {showInactiveStudents && (
          <>
            <Divider />
            <Box 
              display='flex' 
              flexDirection='row' 
              justifyContent='center' 
              sx={{ paddingY: 10, paddingX: 8 }}
              flexWrap='wrap'
            >
              {renderInactiveStudents()}
            </Box>
          </>
        )}
        { 
          showInactiveButton
          && <Box width='100%' display='flex' justifyContent='end'>
            <Button onClick={() => setShowInactiveStudents(!showInactiveStudents)}>
              <Paragraph size='medium'>
                {
                  showInactiveStudents 
                    ? 'Hide Inactive Students' 
                    : 'Show Inactive Students'
                }
              </Paragraph>
            </Button>
          </Box>
        }
      </Box>
    </Card>
  )
}
