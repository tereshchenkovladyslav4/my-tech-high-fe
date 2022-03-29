import { Box, Button, Card, Container } from '@mui/material';
import React, { FunctionComponent, useContext, useEffect, useMemo, useState } from 'react';
import { Subtitle } from '../../components/Typography/Subtitle/Subtitle'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import { Submission } from './Submission/Submission'
import { Contact } from './Contact/Contact'
import { Personal } from './Personal/Personal'
import { Education } from './Education/Education'
import { Documents } from './Documents/Documents'
import { Paragraph } from '../../components/Typography/Paragraph/Paragraph'
import { Step } from '../../components/Breadcrumbs/types'
import { useStyles } from './styles'
import { NavLink, useHistory } from 'react-router-dom'
import { HOMEROOM } from '../../utils/constants'
import { EnrollmentContext } from '../../providers/EnrollmentPacketPrivder/EnrollmentPacketProvider'
import { EnrollmentTemplateType } from './types'
import { find, includes } from 'lodash'
import { UserContext, UserInfo } from '../../providers/UserContext/UserProvider'

export const Enrollment: EnrollmentTemplateType = ({id, disabled}: {id: number, disabled: boolean}) => {
  const { me, setMe } = useContext(UserContext)
  const { students } = me as UserInfo

  const [currentTab, setCurrentTab] = useState(0)
  const [packetId, setPacketId] = useState<number>()
  const [student] = useState(find(students, {student_id:id}))
  const [visitedTabs, setVisitedTabs] = useState([])
  const classes = useStyles

  const enrollmentPacketContext = useMemo(
    () => ({
      currentTab,
      setCurrentTab,
      packetId,
      setPacketId,
      student,
      disabled,
      setMe
    }),
    [packetId, student, disabled]
  )

  useEffect(() => {
    setVisitedTabs([...visitedTabs, currentTab])
  },[currentTab])

  useEffect(() =>{
    setMe(me)
  },[visitedTabs])

  useEffect(() => {
    if(student.packets.at(-1)){
      setPacketId(student.packets.at(-1).packet_id)
    }
    if(student.packets?.at(-1).status === 'Missing Info'){
      setCurrentTab(3)
    }
  })

  const breadCrumbData: Step[] = [
    {
      label: 'Contact',
      active: true,
    },
    {
      label: 'Personal',
      active: currentTab >= 1,
    },
    {
      label: 'Education',
      active: currentTab >= 2,
    },
    {
      label: 'Documents',
      active: currentTab >= 3,
    },
    {
      label: 'Submission',
      active: currentTab >= 4,
    },
  ]
  const history = useHistory()

  const handleBreadCrumbClicked = (idx) => {
    if(includes(visitedTabs, idx) || disabled){
      setCurrentTab(idx)
    }
  }
  return (
    <EnrollmentContext.Provider value={enrollmentPacketContext}>
    <Container sx={classes.container}>
      <Card>
        <Box sx={classes.header}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <ChevronLeftIcon sx={classes.chevronIcon} onClick={() => history.push(HOMEROOM)} />
            <Subtitle size='large' fontWeight='700'>
              Enrollment Packet
            </Subtitle>
          </Box>
          <Breadcrumbs steps={breadCrumbData} handleClick={handleBreadCrumbClicked} disabled={disabled}/>
        </Box>
        <Box sx={classes.breadcrumbs}>
          {currentTab === 0 ? (
            <Contact id={id}/>
          ) : currentTab === 1 ? (
            <Personal />
          ) : currentTab === 2 ? (
            <Education />
          ) : currentTab === 3 ? (
            <Documents />
          ) : (
            <Submission />
          )}
        </Box>
      </Card>
    </Container>
  </EnrollmentContext.Provider>
  )
}
