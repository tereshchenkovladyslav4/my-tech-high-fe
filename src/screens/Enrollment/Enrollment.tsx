import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Box, Card, Container } from '@mui/material'
import { find, includes } from 'lodash'
import { useHistory } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import { Step } from '../../components/Breadcrumbs/types'
import { Subtitle } from '../../components/Typography/Subtitle/Subtitle'
import { EnrollmentContext } from '../../providers/EnrollmentPacketPrivder/EnrollmentPacketProvider'
import { TabContext, UserContext } from '../../providers/UserContext/UserProvider'
import { HOMEROOM } from '../../utils/constants'
import {
  EnrollmentQuestionTab,
  initEnrollmentQuestions,
} from '../Admin/SiteManagement/EnrollmentSetting/EnrollmentQuestions/types'
import { Contact } from './Contact/Contact'
import { Documents } from './Documents/Documents'
import { Education } from './Education/Education'
import { Personal } from './Personal/Personal'
import { getParentQuestionsGql, getRegionByUserId } from './services'
import { useStyles } from './styles'
import { Submission } from './Submission/Submission'
import { EnrollmentTemplateType } from './types'

export const Enrollment: EnrollmentTemplateType = ({ id, disabled }: { id: number; disabled: boolean }) => {
  const { me, setMe } = useContext(UserContext)
  const { students } = me
  const { tab, setTab, visitedTabs, setVisitedTabs } = useContext(TabContext)
  const { currentTab } = tab
  const [packetId, setPacketId] = useState<number>()
  const [student] = useState(find(students, { student_id: id }))
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

  const { data } = useQuery(getParentQuestionsGql, {
    variables: { input: { region_id: Number(regionId) } },
    fetchPolicy: 'network-only',
  })

  const [questionsData, setQuestionsData] = useState<EnrollmentQuestionTab[]>(initEnrollmentQuestions)

  useEffect(() => {
    if (data?.getParentEnrollmentQuestions.length > 0) {
      const jsonTabData = data?.getParentEnrollmentQuestions.map((t) => {
        if (t.groups.length > 0) {
          const jsonGroups = t.groups
            .map((g) => {
              if (g.questions.length > 0) {
                const jsonQuestions = g.questions
                  .map((q) => {
                    return {
                      ...q,
                      // additional2: {... JSON.parse(q.additional2), options: JSON.parse(JSON.parse(q.additional2).options)} || [],
                      // additional: {... JSON.parse(q.additional), options: JSON.parse(JSON.parse(q.additional).options)} || [],
                      options: JSON.parse(q.options) || [],
                    }
                  })
                  .sort((a, b) => a.order - b.order)
                return { ...g, questions: jsonQuestions }
              }
              return g
            })
            .sort((a, b) => a.order - b.order)
          return { ...t, groups: jsonGroups }
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
      visitedTabs,
    }),
    [packetId, disabled, student, me],
  )

  useEffect(() => {
    if (student.packets.at(-1)) {
      setPacketId(student.packets.at(-1).packet_id)
    }
    // if(student.packets?.at(-1).status === 'Missing Info'){
    //setTab({
    //  currentTab: 3
    //})
    // }
  }, [tab])

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
    if (questionsData.length > 0) {
      const tempCrumb = questionsData.map((q, index) => {
        return {
          label: q.tab_name,
          active: currentTab >= index,
        }
      })
      setBreadCrumb(tempCrumb)
    }
  }, [questionsData])

  const history = useHistory()

  useEffect(() => {
    setTab({
      currentTab: 0,
    })
  }, [history])

  const handleBreadCrumbClicked = (idx) => {
    if (includes(visitedTabs, idx) || disabled) {
      setTab({
        currentTab: idx,
      })
    }
  }

  const [currentTabName, setCurrentTabName] = useState(breadCrumb[0].label)
  useEffect(() => {
    const currentName = breadCrumb[currentTab].label
    setCurrentTabName(currentName)
  }, [currentTab, breadCrumb])

  const changeTabNumber = (tabIdx) => {
    if (includes(visitedTabs, tabIdx) || disabled) {
      setTab({
        currentTab: tabIdx,
      })
    }
  }

  return (
    <EnrollmentContext.Provider value={enrollmentPacketContext}>
      <Container sx={classes.container}>
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, marginBottom: 5, marginTop: 10, marginX: 3 }}>
          <ChevronLeftIcon sx={classes.chevronIcon} onClick={() => history.push(HOMEROOM)} />
          <Subtitle size='large' fontWeight='700'>
            Enrollment Packet
          </Subtitle>
        </Box>
        <Card>
          <Box sx={classes.header}>
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                flexDirection: 'row',
              }}
            >
              <ChevronLeftIcon sx={classes.chevronIcon} onClick={() => history.push(HOMEROOM)} />
              <Subtitle size='large' fontWeight='700'>
                Enrollment Packet
              </Subtitle>
            </Box>
            <Breadcrumbs steps={breadCrumb} handleClick={handleBreadCrumbClicked} disabled={disabled} />
          </Box>
          <Box sx={classes.breadcrumbs}>
            {/* <Documents id={id} questions={questionsData.filter((q) => q.tab_name === 'Documents')[0]} /> */}
            {currentTabName === 'Contact' ? (
              <Contact id={id} questions={questionsData.filter((q) => q.tab_name === currentTabName)[0]} />
            ) : currentTabName === 'Personal' ? (
              <Personal id={id} questions={questionsData.filter((q) => q.tab_name === currentTabName)[0]} />
            ) : currentTabName === 'Education' ? (
              <Education id={id} questions={questionsData.filter((q) => q.tab_name === currentTabName)[0]} />
            ) : currentTabName === 'Documents' ? (
              <Documents id={id} questions={questionsData.filter((q) => q.tab_name === currentTabName)[0]} />
            ) : (
              <Submission id={id} questions={questionsData.filter((q) => q.tab_name === currentTabName)[0]} />
            )}
          </Box>

          <Box
            sx={{ display: { xs: 'flex', sm: 'none' } }}
            justifyContent={'center'}
            marginTop={10}
            marginBottom={5}
            alignItems={'center'}
          >
            <ChevronLeftIcon sx={classes.pageArrow} onClick={() => changeTabNumber(currentTab - 1)} />
            <Box sx={classes.pageNumber}>
              {currentTab + 1}/{breadCrumb.length}
            </Box>
            <ChevronRightIcon sx={classes.pageArrow} onClick={() => changeTabNumber(currentTab + 1)} />
          </Box>
        </Card>
      </Container>
    </EnrollmentContext.Provider>
  )
}
