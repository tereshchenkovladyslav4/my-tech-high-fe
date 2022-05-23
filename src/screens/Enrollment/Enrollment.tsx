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
import { useMutation, useQuery } from '@apollo/client'
import { getParentQuestionsGql, getRegionByUserId} from './services'
import { TabContext, TabInfo, UserContext, UserInfo } from '../../providers/UserContext/UserProvider'
import { EnrollmentQuestionTab, initEnrollmentQuestions } from '../Admin/SiteManagement/EnrollmentSetting/EnrollmentQuestions/types';
import ContactNew from './Contact/Contact_new';
import PersonalNew from './Personal/Personal_new';
import EducationNew from './Education/Education_new';
import DocumentsNew from './Documents/Documents_new';
import SubmissionNew from './Submission/Submission_new';

export const Enrollment: EnrollmentTemplateType = ({id, disabled}: {id: number, disabled: boolean}) => {
  const { me, setMe } = useContext(UserContext)
  const { students } = me
  const { tab, setTab, visitedTabs, setVisitedTabs, } = useContext(TabContext)  
  const { currentTab } = tab 
  const [packetId, setPacketId] = useState<number>()
  const [student] = useState(find(students, {student_id:id}))
  const classes = useStyles

  const [regionId, setRegionId] = useState<string>('')
  const { loading: regionLoading, data: regionData } = useQuery(getRegionByUserId, {
    variables: {
      userId: me?.user_id,
    },
    skip: regionId == '' ? false : true,
    fetchPolicy: 'network-only',
  })
  
  useEffect(() => {
    if (!regionLoading && regionData) {
      setRegionId(regionData?.userRegionByUserId[0]?.region_id)
    }
  }, [me?.user_id, regionData])

  const { data, refetch } = useQuery(getParentQuestionsGql, {
    variables: { input: { region_id: Number(regionId) } },
    fetchPolicy: 'network-only',
  })

  const [questionsData, setQuestionsData] = useState<EnrollmentQuestionTab[]>(initEnrollmentQuestions)

  useEffect(() => {
    if (data?.getParentEnrollmentQuestions.length > 0) {
      const jsonTabData = data?.getParentEnrollmentQuestions.map((t) => {
        if(t.groups.length > 0) {
          const jsonGroups = t.groups.map((g) => {
            if(g.questions.length > 0) {
              const jsonQuestions = g.questions.map((q) => {
                return {
                  ...q,
                  additional2: {... JSON.parse(q.additional2), options: JSON.parse(JSON.parse(q.additional2).options)} || [],
                  additional: {... JSON.parse(q.additional), options: JSON.parse(JSON.parse(q.additional).options)} || [],
                  options: JSON.parse(q.options) || []
                }
              }).sort((a, b) => a.order - b.order)
              return {...g, questions: jsonQuestions}
            }            
            return g
          }).sort((a, b) => a.order - b.order)
          return {...t, groups: jsonGroups}
        }
        return t
      })
      setQuestionsData(jsonTabData)
    }
  }, [data, regionId])

  const enrollmentPacketContext = useMemo(
    () => ({
      packetId,
      setPacketId,
      student,
      disabled,
      me,
      setMe,
      setTab,
      setVisitedTabs,
      visitedTabs
    }),
    [packetId, disabled, student, me]
  )
  
  useEffect(() => {
    if(student.packets.at(-1)){
      setPacketId(student.packets.at(-1).packet_id)
    }
    // if(student.packets?.at(-1).status === 'Missing Info'){
      //setTab({
      //  currentTab: 3
      //})
    // }
  },[tab])


  //if(student.packets?.at(-1).status === 'Missing Info'){
  //  setTab({
  //    currentTab: 3
  //  })
  //}
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

  const [breadCrumb, setBreadCrumb] = useState(breadCrumbData)

  useEffect(() => {
    if(questionsData.length > 0) {
      const tempCrumb = questionsData.map((q, index) => {
        return {
          label: q.tab_name,
          active: currentTab >= index
        }
      })
      setBreadCrumb(tempCrumb)
    }
  }, [questionsData])

  const history = useHistory()

  const handleBreadCrumbClicked = (idx) => {
    if(includes(visitedTabs, idx) || disabled){
      setTab({
        currentTab: idx
      })
    }
  }

  const [currentTabName, setCurrentTabName] = useState(breadCrumb[0].label)
  useEffect(() => {
    const currentName = breadCrumb[currentTab].label
    setCurrentTabName(currentName)
  }, [currentTab, breadCrumb])

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
          <Breadcrumbs steps={breadCrumb} handleClick={handleBreadCrumbClicked} disabled={disabled}/>
        </Box>
        <Box sx={classes.breadcrumbs}>
          {/* {currentTab === 0 ? (
            <Contact id={id}/>
          ) : currentTab === 1 ? (
            <Personal />
          ) : currentTab === 2 ? (
            <Education />
          ) : currentTab === 3 ? (
            <Documents />
          ) : (
            <Submission />
          )} */}
          {currentTabName === 'Contact' ? (
            <ContactNew id={id} questions = {questionsData.filter((q) => q.tab_name === currentTabName)[0]}/>
            // <EducationNew id={id} questions = {questionsData.filter((q) => q.tab_name === 'Education')[0]}/>
            // <Education />
          ) : currentTabName === 'Personal' ? (
            <PersonalNew id={id} questions = {questionsData.filter((q) => q.tab_name === currentTabName)[0]}/>
          ) : currentTabName === 'Education' ? (
            <EducationNew id={id} questions = {questionsData.filter((q) => q.tab_name === currentTabName)[0]}/>
          ) : currentTabName === 'Documents' ? (
            <DocumentsNew id={id} questions = {questionsData.filter((q) => q.tab_name === currentTabName)[0]}/>
          ) : (
            <SubmissionNew id={id} questions = {questionsData.filter((q) => q.tab_name === currentTabName)[0]}/>
          )}
        </Box>
      </Card>
    </Container>
  </EnrollmentContext.Provider>
  )
}
