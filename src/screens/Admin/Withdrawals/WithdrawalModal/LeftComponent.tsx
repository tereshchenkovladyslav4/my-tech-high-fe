import React, { Fragment, useContext, useState } from 'react'
import { Avatar, Box, Grid, Typography } from '@mui/material'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { Title } from '@mth/components/Typography/Title/Title'
import { ProfileContext } from '@mth/providers/ProfileProvider/ProfileContext'
import { MTHBLUE } from '../../../../utils/constants'
import { toOrdinalSuffix } from '../../../../utils/stringHelpers'
import { CheckBoxList } from '../../Calendar/components/CheckBoxList'
import { StudentInfo } from '../type'
import { withdrawalModalClasses } from './styles'

type LeftComponentProps = {
  studentInfo: StudentInfo | undefined
}

export const LeftComponent: React.FC<LeftComponentProps> = ({ studentInfo }) => {
  const { showModal, setStore } = useContext(ProfileContext)
  const schedules = [
    {
      type: 'My Tech High Direct',
      name: '',
    },
    {
      type: '3rd Party',
      name: 'https://www.mytechhigh.com/',
      phone: '+1 (348) 863 3457',
    },
    {
      type: 'Custom-built',
      name: 'Sample Text',
    },
    {
      type: 'My Tech High Direct',
      name: 'IXL',
    },
    {
      type: 'My Tech High Direct',
      name: 'Photography',
    },
    {
      type: 'Custom-built',
      name: 'Sample Text',
    },
    {
      type: 'None',
      name: '',
    },
  ]
  const [standardResponse, setStandardResponse] = useState<string[]>([])
  const standardResponseList = [
    {
      label: 'MTH Direct',
      value: '0',
    },
    {
      label: 'Reimbursement',
      value: '1',
    },
    {
      label: 'Direct Order',
      value: '2',
    },
    {
      label: 'Other',
      value: '3',
    },
  ]

  const handleViewStudentProfile = () => {
    if (studentInfo) {
      const data = {
        student_id: Number(studentInfo.studentId),
        parent: {
          parent_id: Number(studentInfo.parentId),
        },
      }
      showModal(data)
      setStore(true)
    }
  }
  return (
    <Box>
      <Box sx={withdrawalModalClasses.avatar}>
        <Avatar alt={'Hunter Jobs'} src='image' variant='rounded' style={withdrawalModalClasses.studentImg} />
        <Box sx={withdrawalModalClasses.studentInfo}>
          <Subtitle
            textAlign='left'
            fontWeight='700'
            sx={{ fontSize: '18px', cursor: 'pointer' }}
            color={MTHBLUE}
            onClick={handleViewStudentProfile}
          >
            {`${studentInfo?.firstName} ${studentInfo?.lastName}`}
          </Subtitle>
          <Subtitle textAlign='left' sx={{ color: '#A3A3A4', fontSize: '13px' }}>
            {`${studentInfo?.grade.includes('K') ? 'Kindergarten' : toOrdinalSuffix(Number(studentInfo?.grade))} Grade`}
          </Subtitle>
          <Subtitle textAlign='left' sx={{ color: '#A3A3A4', fontSize: '13px' }}>
            {`${studentInfo?.schoolOfEnrollment}`}
          </Subtitle>
        </Box>
      </Box>
      <Grid container marginTop={4} columnSpacing={4} rowSpacing={3}>
        <Grid item xs={7}>
          <Box sx={{ marginBottom: 2 }}>
            <Title textAlign='left' fontWeight='700' sx={{ fontSize: '20px' }}>
              Schedule
            </Title>
          </Box>
          <Grid container columnSpacing={4} rowSpacing={3}>
            <Grid item xs={5}>
              <Subtitle textAlign='left' fontWeight='700' sx={{ fontSize: '12px' }}>
                Course Type
              </Subtitle>
            </Grid>
            <Grid item xs={7}>
              <Subtitle textAlign='left' fontWeight='700' sx={{ fontSize: '12px' }}>
                Course Provider/Name
              </Subtitle>
            </Grid>
            {schedules?.map((schedule, index) => (
              <Fragment key={index}>
                <Grid item xs={5}>
                  <Typography fontSize='12px' fontWeight={'700'}>
                    {schedule.type}
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Typography fontSize='12px'>{schedule.name}</Typography>
                  {schedule.phone && <Typography fontSize='12px'>{schedule.phone}</Typography>}
                </Grid>
              </Fragment>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Box sx={{ marginBottom: 3 }}>
            <Title textAlign='left' fontWeight='700' sx={{ fontSize: '20px' }}>
              Standard Responses
            </Title>
          </Box>
          <CheckBoxList
            title={''}
            values={standardResponse}
            setValues={(value) => {
              setStandardResponse(value)
            }}
            checkboxLists={standardResponseList}
            haveSelectAll={false}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
