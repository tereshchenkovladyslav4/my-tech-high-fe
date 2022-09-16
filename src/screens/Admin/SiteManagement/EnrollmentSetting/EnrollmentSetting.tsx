import React, { useContext, useEffect, useState } from 'react'
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
import { ItemCardProps } from '@mth/components/ItemCard/ItemCardProps'
import { MthTitle } from '@mth/enums'
import { useCurrentSchoolYearByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { ApplicationQuestions } from './ApplicationQuestions'
import DiplomaSeeking from './DiplomaSeeking/DiplomaSeeking'
import { EnrollmentQuestions } from './EnrollmentQuestions'
import Immunizations from './Immunizations/Immunizations'
import TestingPreference from './TestingPreference/TestingPreference'

const EnrollmentSetting: React.FC = () => {
  const { me } = useContext(UserContext)
  const { path, isExact } = useRouteMatch('/site-management/enrollment') || {}
  const [scheduleFlag, setScheduleFlag] = useState<boolean>(false)
  const [enrollmentPacketFlag, setEnrollmentPacketFlag] = useState<boolean>(false)
  const [testingPreferenceFlag, setTestingPreferenceFlag] = useState<boolean>(false)
  const [diplomaSeekingFlag, setDiplomaSeeking] = useState<boolean>(false)
  const history = useHistory()
  const { data: schoolYear } = useCurrentSchoolYearByRegionId(Number(me?.selectedRegionId))
  const items: ItemCardProps[] = [
    {
      title: MthTitle.APPLICATION_QUESTIONS,
      subTitle: '',
      img: ApplicationQuestionImage,
      isLink: false,
      link: `${path}/application-question`,
    },
    {
      title: MthTitle.ENROLLMENT_QUESSTONS,
      subTitle: '',
      img: EnrollmentQuestionImage,
      isLink: false,
      link: `${path}/enrollment-question`,
    },
    {
      title: MthTitle.IMMUNIZATIONS,
      subTitle: '',
      img: ImmunizationsImage,
      isLink: false,
      link: `${path}/immunizations`,
    },
    {
      title: MthTitle.TESTING_PREFERENCE,
      subTitle: '',
      img: TestingPreferenceImage,
      isLink: false,
      link: `${path}/testing-preference`,
    },
    {
      title: MthTitle.DIPLOMA_SEEKING,
      subTitle: '',
      img: DiplomaSeekingImg,
      isLink: false,
      link: `${path}/diploma-seeking`,
    },
  ]

  const isAvailable = (item: ItemCardProps) => {
    if (item.title == MthTitle.ENROLLMENT_QUESSTONS && !enrollmentPacketFlag) return false
    if (item.title == MthTitle.TESTING_PREFERENCE && scheduleFlag && !testingPreferenceFlag) return false
    if (item.title == MthTitle.DIPLOMA_SEEKING && scheduleFlag && !diplomaSeekingFlag) return false
    return true
  }

  const renderTile = () => {
    return map(items, (item, idx) => {
      if (isAvailable(item)) {
        return (
          <Grid item xs={4} key={idx}>
            <ItemCard
              title={item.title}
              subTitle={item.subTitle}
              img={item.img}
              link={item.link}
              disabled={
                (!scheduleFlag && item.title == MthTitle.TESTING_PREFERENCE) ||
                (!scheduleFlag && item.title == MthTitle.DIPLOMA_SEEKING)
              }
            />
          </Grid>
        )
      } else {
        return <></>
      }
    })
  }

  useEffect(() => {
    if (schoolYear) {
      setEnrollmentPacketFlag(schoolYear?.enrollment_packet)
      setTestingPreferenceFlag(schoolYear?.testing_preference)
      setDiplomaSeeking(schoolYear?.diploma_seeking)
      setScheduleFlag(schoolYear?.schedule)
    } else {
      setEnrollmentPacketFlag(false)
      setTestingPreferenceFlag(false)
      setDiplomaSeeking(false)
      setScheduleFlag(false)
    }
  }, [me?.selectedRegionId, schoolYear])

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
            {renderTile()}
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
