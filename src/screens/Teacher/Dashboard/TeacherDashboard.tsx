import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Card, Grid } from '@mui/material'
import { Box } from '@mui/system'
import { Teacher } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { Classes } from '@mth/screens/Admin/HomeRoom/LearningLogs/types'
import { DashboardSection } from '@mth/screens/Dashboard/types'
import { HomeroomSection } from '../components/HomeroomSection/HomeroomSection'
import { GetTeachersByUserIdQuery } from '../services/teachers'

const TeacherDashboard: React.FC = () => {
  const { me } = useContext(UserContext)
  const [sectionName, setSectionName] = useState<DashboardSection>(DashboardSection.ROOT)
  const [inProp, setInProp] = useState<boolean>(false)
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const { loading, data: teacherData } = useQuery(GetTeachersByUserIdQuery, {
    variables: {
      userId: Number(me?.user_id),
    },
    skip: me?.user_id ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && teacherData) {
      setSectionName(DashboardSection.ROOT)
      let primaryTeachers: Teacher[] = []
      let additionalTeachers: Teacher[] = []
      teacherData.getTeachersByUserId.results.map((item: Classes) => {
        if (Number(item?.PrimaryTeacher?.user_id) === Number(me?.user_id)) {
          primaryTeachers = [
            ...primaryTeachers,
            {
              classId: Number(item?.class_id) ?? 0,
              firstName: item?.PrimaryTeacher?.first_name ?? '',
              lastName: item?.PrimaryTeacher?.last_name ?? '',
              user_id: Number(item.PrimaryTeacher?.user_id),
              avatarUrl: me?.avatar_url ?? undefined,
              ungradedLogs: Number(item?.ungraded) ?? 0,
            },
          ]
        }
        if (item?.addition_id) {
          const parsedAdditionalTeachers = JSON.parse(item.addition_id)
          const filteredTeacher = parsedAdditionalTeachers?.find(
            (obj: Teacher) => Number(obj.user_id) === Number(me?.user_id),
          )
          if (filteredTeacher) {
            additionalTeachers = [
              ...additionalTeachers,
              {
                classId: Number(item?.class_id) ?? 0,
                firstName: filteredTeacher?.first_name ?? '',
                lastName: filteredTeacher?.last_name ?? '',
                user_id: Number(filteredTeacher?.user_id),
                avatarUrl: me?.avatar_url ?? undefined,
                ungradedLogs: Number(item?.ungraded) ?? 0,
              },
            ]
          }
        }
      })
      setTeachers([
        ...primaryTeachers.sort((a, b) => ((a?.firstName ?? '') > (b?.firstName ?? '') ? 1 : -1)),
        ...additionalTeachers.sort((a, b) => ((a?.firstName ?? '') > (b?.firstName ?? '') ? 1 : -1)),
      ])
    }
  }, [teacherData, loading])
  useEffect(() => {
    setInProp(!inProp)
  }, [sectionName])

  const renderPage = () => {
    switch (sectionName) {
      case DashboardSection.ROOT:
        return (
          <Box>
            <Grid
              container
              spacing={2}
              justifyContent='center'
              sx={{ margin: '0 !important', width: 'calc(100% - 16px) !important' }}
            >
              <Grid item xs={12} lg={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <HomeroomSection title='Homerooms' teachers={teachers} />
                  </Grid>
                  <Grid item xs={12} order={{ xs: 3, lg: 2 }}>
                    {/* TODO: teacher calendar section */}
                  </Grid>
                  <Grid item xs={12} order={{ xs: 2, lg: 3 }}>
                    {/* TO DO: TO do list section */}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Card
                  style={{
                    width: '100%',
                    marginRight: 25,
                    borderRadius: 12,
                  }}
                >
                  Announcement
                  {/* TODO: Announcement section */}
                </Card>
              </Grid>
            </Grid>
          </Box>
        )
      case DashboardSection.VIEW_ALL:
        return <>{/* TODO: Announcement View all section */}</>
      case DashboardSection.READ_MORE:
        return <>{/* TODO: ReadMoreSection */}</>
      case DashboardSection.FULL_CALENDAR:
        return (
          <>
            <Box display={{ xs: 'none', sm: 'none', md: 'block' }}>{/* TODO: full calendar section */}</Box>
          </>
        )
      default:
        return <></>
    }
  }

  return renderPage()
}

export default TeacherDashboard
