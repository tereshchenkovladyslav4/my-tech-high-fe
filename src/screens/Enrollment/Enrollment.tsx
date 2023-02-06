import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Box, Card, Container } from '@mui/material'
import { includes } from 'lodash'
import { useHistory } from 'react-router-dom'
import { Breadcrumbs } from '@mth/components/Breadcrumbs/Breadcrumbs'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthRoute, PacketStatus } from '@mth/enums'
import { EnrollmentContext } from '@mth/providers/EnrollmentPacketPrivder/EnrollmentPacketProvider'
import { TabContext, UserContext } from '@mth/providers/UserContext/UserProvider'
import {
  EnrollmentQuestionTab,
  initEnrollmentQuestions,
  UserRegion,
} from '../Admin/SiteManagement/EnrollmentSetting/EnrollmentQuestions/types'
import { Contact } from './Contact/Contact'
import { Documents } from './Documents/Documents'
import { Education } from './Education/Education'
import { Personal } from './Personal/Personal'
import { getParentQuestionsGql, getRegionByUserId } from './services'
import { useStyles } from './styles'
import { Submission } from './Submission/Submission'
import { EnrollmentProps } from './types'

export const Enrollment: React.FC<EnrollmentProps> = ({ id, disabled }: { id: number; disabled: boolean }) => {
  const { me, setMe } = useContext(UserContext)
  const students = useMemo(() => me?.students, [me])
  const { tab, setTab, visitedTabs, setVisitedTabs } = useContext(TabContext)
  const [packetId, setPacketId] = useState<number>()
  const student = useMemo(() => students?.filter((e) => String(e.student_id) == String(id)).at(-1), [students, id])
  const packet = useMemo(() => student?.packets?.at(-1), [student])
  const documentsOnly = useMemo(() => Boolean(packet?.status == PacketStatus.MISSING_INFO), [packet?.status])
  const currentTab = useMemo(() => tab?.currentTab || 0, [tab?.currentTab])
  const classes = useStyles

  const { data: regionData } = useQuery<{ userRegionByUserId: UserRegion[] }>(getRegionByUserId, {
    variables: {
      userId: me?.user_id,
    },
    skip: !me?.user_id,
    fetchPolicy: 'network-only',
  })
  const regionId = useMemo(() => regionData?.userRegionByUserId[0]?.region_id || 0, [regionData?.userRegionByUserId]) // will update again (localStorage.getItem('selectedRegion'))

  const { data } = useQuery(getParentQuestionsGql, {
    variables: {
      input: {
        region_id: Number(regionId),
        school_year_id: parseInt(student?.current_school_year_status.school_year_id),
        mid_year: student?.current_school_year_status.midyear_application ? true : false,
      },
    },
    fetchPolicy: 'network-only',
    skip: !student,
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
                      isEnable: false,
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
      const sortMap = {
        Contact: 0,
        Personal: 1,
        Education: 2,
        Documents: 3,
        Submission: 4,
      }
      setQuestionsData(jsonTabData.sort((a, b) => (sortMap[a.tab_name] > sortMap[b.tab_name] ? 1 : -1)))
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
    [packetId, student, disabled, me, setMe, setTab, setVisitedTabs, visitedTabs],
  )

  useEffect(() => {
    if (packet) {
      setPacketId(packet.packet_id)
    }
  }, [tab, student, packet])

  const [breadCrumb, setBreadCrumb] = useState([
    {
      label: 'Contact',
      active: true,
    },
    {
      label: 'Personal',
      active: false,
    },
    {
      label: 'Education',
      active: false,
    },
    {
      label: 'Documents',
      active: false,
    },
    {
      label: 'Submission',
      active: false,
    },
  ])

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
  }, [currentTab, questionsData])

  const history = useHistory()

  useEffect(() => {
    setTab({
      currentTab: documentsOnly ? 3 : 0,
    })
  }, [documentsOnly, history, setTab])
  const handleBack = useCallback(() => history.push(MthRoute.HOMEROOM.toString()), [history])
  const handleBreadCrumbClicked = useCallback(
    (idx) => {
      if (includes(visitedTabs, idx) || disabled) {
        setTab({
          currentTab: idx,
        })
      }
    },
    [disabled, setTab, visitedTabs],
  )

  const [currentTabName, setCurrentTabName] = useState(breadCrumb[0].label)
  useEffect(() => {
    const currentName = breadCrumb.length > currentTab ? breadCrumb[currentTab].label : null
    if (currentName) {
      setCurrentTabName(currentName)
    }
  }, [currentTab, breadCrumb])

  const handleTabIndexPrev = useCallback(() => {
    setTab({ currentTab: currentTab - 1 })
  }, [currentTab, setTab])
  const handleTabIndexNext = useCallback(() => {
    setTab({ currentTab: currentTab + 1 })
  }, [currentTab, setTab])
  return (
    <EnrollmentContext.Provider value={enrollmentPacketContext}>
      <Container sx={classes.container}>
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, marginBottom: 5, marginTop: 10, marginX: 3 }}>
          <ChevronLeftIcon sx={classes.chevronIcon} onClick={handleBack} />
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
              <ChevronLeftIcon sx={classes.chevronIcon} onClick={handleBack} />
              <Subtitle size='large' fontWeight='700'>
                Enrollment Packet
              </Subtitle>
            </Box>
            <Breadcrumbs
              steps={breadCrumb}
              handleClick={handleBreadCrumbClicked}
              disabled={disabled || documentsOnly}
            />
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
              <Documents
                id={id}
                questions={questionsData.filter((q) => q.tab_name === currentTabName)[0]}
                regionId={regionId}
              />
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
            <ChevronLeftIcon sx={classes.pageArrow} onClick={handleTabIndexPrev} />
            <Box sx={classes.pageNumber}>
              {currentTab + 1}/{breadCrumb.length}
            </Box>
            <ChevronRightIcon sx={classes.pageArrow} onClick={handleTabIndexNext} />
          </Box>
        </Card>
      </Container>
    </EnrollmentContext.Provider>
  )
}
