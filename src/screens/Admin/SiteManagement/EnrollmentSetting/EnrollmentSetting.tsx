import React from 'react'
import { Grid } from '@mui/material'
import { map } from 'lodash';
import { Route, Switch, useRouteMatch, useHistory } from 'react-router-dom'
import { ItemCard } from '../../../../components/ItemCard/ItemCard'
import Immunizations from './Immunizations/Immunizations'
import ApplicationQuestionImage from '../../../../assets/schedules.png';
import EnrollmentQuestionImage from '../../../../assets/q&a.png';
import ImmunizationsImage from '../../../../assets/immunizations.png';
import ApplicationQuestions from './ApplicationQuestions';
import EnrollmentQuestions from './EnrollmentQuestions';
import { Box, Button, IconButton, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'

const EnrollmentSetting: React.FC = () => {
  const { path, isExact } = useRouteMatch('/site-management/enrollment')
  const history = useHistory()

  const items = [
    {
      id: 1,
      title: "Application Question",
      subtitle: "",
      img: ApplicationQuestionImage,
      isLink: false,
      to: `${path}/application-question`
    },
    {
      id: 2,
      title: "Enrollment Question",
      subtitle: "",
      img: EnrollmentQuestionImage,
      isLink: false,
      to: `${path}/enrollment-question`
    },
    {
      id: 3,
      title: "Immunizations",
      subtitle: "",
      img: ImmunizationsImage,
      isLink: false,
      to: `${path}/immunizations`
    },
  ]

  return (
    <>
      {isExact && (
        <>
          <Box sx={{
            textAlign: 'left',
            marginBottom: '52px',
            marginLeft: '32px',
          }}>
            <IconButton
              onClick={() => history.push('/site-management/')}
              sx={{
                position: 'relative',
                bottom: '2px',
              }}
            >
              <ArrowBackIosRoundedIcon sx={{
                fontSize: '15px',
                stroke: 'black',
                strokeWidth: 2
              }} />
            </IconButton>
            <Typography paddingLeft='7px' fontSize='20px' fontWeight='700' component='span'>
              Enrollment Settings
            </Typography>
          </Box>
          <Grid container rowSpacing={4} columnSpacing={0}>
            {map(items, (item, idx) => (
              <Grid item xs={4} key={idx}>
                <ItemCard
                  title={item.title}
                  subTitle={item.subtitle}
                  img={item.img}
                  link={item.to}
                />
              </Grid>
            ))}
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
      </Switch>
    </>
  )
}

export { EnrollmentSetting as default }
