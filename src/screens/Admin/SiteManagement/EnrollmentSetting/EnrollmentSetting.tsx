import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Grid } from '@mui/material'
import { Box, IconButton, Typography } from '@mui/material'
import { map } from 'lodash'
import { Route, Switch, useRouteMatch, useHistory } from 'react-router-dom'
import DiplomaSeekingImg from '@mth/assets/Diploma-seeking.png'
import ImmunizationsImage from '@mth/assets/immunizations.png'
import EnrollmentQuestionImage from '@mth/assets/q&a.png'
import ApplicationQuestionImage from '@mth/assets/schedules.png'
import TestingPreferenceImage from '@mth/assets/testing-preference.png'
import { ItemCard } from '@mth/components/ItemCard/ItemCard'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { GetCurrentSchoolYearByRegionId } from '../../Announcements/services'
import { ApplicationQuestions } from './ApplicationQuestions'
import DiplomaSeeking from './DiplomaSeeking/DiplomaSeeking'
import { EnrollmentQuestions } from './EnrollmentQuestions'
import Immunizations from './Immunizations/Immunizations'
import TestingPreference from './TestingPreference/TestingPreference'

const EnrollmentSetting: React.FC = () => {
  const { me } = useContext(UserContext)
  const { path, isExact } = useRouteMatch('/site-management/enrollment') || {}
  const [enrollmentPacketFlag, setEnrollmentPacketFlag] = useState<boolean>(false)
  const history = useHistory()
  const schoolYearData = useQuery(GetCurrentSchoolYearByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (schoolYearData?.data?.schoolyear_getcurrent) {
      setEnrollmentPacketFlag(schoolYearData?.data?.schoolyear_getcurrent?.enrollment_packet)
    } else {
      setEnrollmentPacketFlag(false)
    }
  }, [me?.selectedRegionId, schoolYearData])

  const items = [
    {
      id: 1,
      title: 'Application Questions',
      subtitle: '',
      img: ApplicationQuestionImage,
      isLink: false,
      to: `${path}/application-question`,
    },
    {
      id: 2,
      title: 'Enrollment Questions',
      subtitle: '',
      img: EnrollmentQuestionImage,
      isLink: false,
      to: `${path}/enrollment-question`,
    },
    {
      id: 3,
      title: 'Immunizations',
      subtitle: '',
      img: ImmunizationsImage,
      isLink: false,
      to: `${path}/immunizations`,
    },
    {
      id: 4,
      title: 'Testing Preference',
      subtitle: '',
      img: TestingPreferenceImage,
      isLink: false,
      to: `${path}/testing-preference`,
    },
    {
      id: 5,
      title: 'Diploma-seeking',
      subtitle: '',
      img: DiplomaSeekingImg,
      isLink: false,
      to: `${path}/diploma-seeking`,
    },
  ]

  return (
    <>
      {isExact && (
        <>
          <Box
            sx={{
              textAlign: 'left',
              marginBottom: '52px',
              marginLeft: '32px',
            }}
          >
            <IconButton
              onClick={() => history.push('/site-management/')}
              sx={{
                position: 'relative',
                bottom: '2px',
              }}
            >
              <ArrowBackIosRoundedIcon
                sx={{
                  fontSize: '15px',
                  stroke: 'black',
                  strokeWidth: 2,
                }}
              />
            </IconButton>
            <Typography paddingLeft='7px' fontSize='20px' fontWeight='700' component='span'>
              Enrollment Settings
            </Typography>
          </Box>
          <Grid container rowSpacing={4} columnSpacing={0}>
            {map(
              items.filter((item) => enrollmentPacketFlag || (!enrollmentPacketFlag && item.id != 2)),
              (item, idx) => (
                <Grid item xs={4} key={idx}>
                  <ItemCard title={item.title} subTitle={item.subtitle} img={item.img} link={item.to} />
                </Grid>
              ),
            )}
          </Grid>
        </>
      )}
      <Switch>
        <Route path={`${path}/immunizations`}>
          <Immunizations />
        </Route>
        <Route path={`${path}/application-question`}>
          <ApplicationQuestions />
        </Route>
        <Route path={`${path}/enrollment-question`}>
          <EnrollmentQuestions />
        </Route>
        <Route path={`${path}/testing-preference`}>
          <TestingPreference />
        </Route>
        <Route path={`${path}/diploma-seeking`}>
          <DiplomaSeeking />
        </Route>
      </Switch>
    </>
  )
}

export { EnrollmentSetting as default }
