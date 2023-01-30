import React, { useContext, useEffect, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Card, Grid, IconButton } from '@mui/material'
import { Box } from '@mui/system'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'

export const getSchoolYearsByRegionId = gql`
  query Region($regionId: ID!) {
    region(id: $regionId) {
      SchoolYears {
        school_year_id
        date_begin
        date_end
        date_reg_close
        date_reg_open
        midyear_application
        midyear_application_open
        midyear_application_close
        enrollment_packet
        special_ed
        schedule
      }
    }
  }
`

export const schoolYearsDataquery = gql`
  query SchoolYearsData($schoolYearDataInput: SchoolYearDataInput!) {
    schoolYearsData(schoolYearDataInput: $schoolYearDataInput) {
      students {
        status
        count
      }
      parents {
        status
        count
      }
      special_ed {
        status
        count
      }
    }
  }
`

const data = [
  {
    students: [
      {
        status: 'Pending',
        count: '10',
      },
      {
        status: 'Active',
        count: '10',
      },
      {
        status: 'Total',
        count: '10',
      },
      {
        status: 'Withdrawn',
        count: '10',
      },
      {
        status: 'Graduated',
        count: '10',
      },
    ],
    parents: [
      {
        status: 'Pending',
        count: '10',
      },
      {
        status: 'Active',
        count: '10',
      },
      {
        status: 'Total',
        count: '10',
      },
      {
        status: 'Withdrawn',
        count: '10',
      },
      {
        status: 'Graduated',
        count: '10',
      },
    ],
    special_ed: [
      {
        status: 'Pending',
        count: '10',
      },
      {
        status: 'Active',
        count: '10',
      },
      {
        status: 'Total',
        count: '10',
      },
      {
        status: 'Withdrawn',
        count: '10',
      },
      {
        status: 'Graduated',
        count: '10',
      },
    ],
  },
]

const status = ['Pending', 'Active', 'Total', 'Withdrawn', 'Graduated']

type SchoolYearSped = {
  school_year_id: number
  special_ed: boolean
}

type SchoolYearProps = {
  selectedYear: string | number
  setSelectedYear: (selectedYear: string | number) => void
}

export const SchoolYear: React.FC<SchoolYearProps> = ({ setSelectedYear }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { me } = useContext(UserContext)
  const [schoolYearDataCount, setSchoolYearDataCount] = useState(data)
  const [schoolYearSpedOptions, setSchoolYearSpedOptions] = useState<Array<SchoolYearSped>>([])
  const [specialEdStatus, setSpecialEdStatus] = useState(true)

  const {
    dropdownItems: schoolYearDropdownItems,
    schoolYears: schoolYears,
    selectedYearId,
    setSelectedYearId,
  } = useSchoolYearsByRegionId(me?.selectedRegionId)

  const { loading: schoolYearDataCountsLoading, data: schoolYearDataCounts } = useQuery(schoolYearsDataquery, {
    variables: {
      schoolYearDataInput: {
        region_id: me?.selectedRegionId,
        school_year_id: Number(selectedYearId),
      },
    },
    skip: selectedYearId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (schoolYears?.length) {
      setSchoolYearSpedOptions(
        schoolYears?.map((item) => {
          return {
            school_year_id: item.school_year_id,
            special_ed: item.special_ed,
          }
        }),
      )
    }
  }, [me?.selectedRegionId, schoolYears])

  useEffect(() => {
    if (!schoolYearDataCountsLoading && schoolYearDataCounts?.schoolYearsData) {
      setSchoolYearDataCount(schoolYearDataCounts?.schoolYearsData)
    }
  }, [me?.selectedRegionId, schoolYearDataCountsLoading, schoolYearDataCounts?.schoolYearsData])

  useEffect(() => {
    schoolYearSpedOptions.map((item) => {
      if (item.school_year_id == selectedYearId) setSpecialEdStatus(item.special_ed)
    })
    setSelectedYear(selectedYearId || 0)
  }, [selectedYearId])

  return (
    <Card>
      <Box display='flex' flexDirection='column'>
        <Box
          display='flex'
          flexDirection='row'
          alignItems='center'
          justifyContent='space-between'
          paddingX={4}
          paddingY={2}
        >
          <Box display='flex' flexDirection='row' alignItems='center'>
            <Subtitle size='large' fontWeight='bold'>
              School Year
            </Subtitle>
            <Box sx={{ ml: 0.5, mt: 0.5 }}>
              <IconButton onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <ExpandLessIcon fontSize='small' /> : <ExpandMoreIcon fontSize='small' />}
              </IconButton>
            </Box>
          </Box>
          <Box display='flex' flexDirection='row' alignItems='center'>
            <DropDown
              dropDownItems={schoolYearDropdownItems}
              placeholder={'Select Year'}
              defaultValue={selectedYearId}
              borderNone={true}
              setParentValue={(val) => {
                setSelectedYearId(Number(val))
              }}
            />
          </Box>
        </Box>
        {isExpanded && (
          <Box>
            <Grid container paddingX={4} paddingY={2}>
              <Grid item xs={2}></Grid>
              {status.map((val) => (
                <Grid item key={val} xs={2}>
                  <Box marginBottom={3}>
                    <Paragraph size='large' sx={{ fontSize: 'lg' }} fontWeight='700'>
                      {val}
                    </Paragraph>
                  </Box>
                </Grid>
              ))}
              <Grid item xs={2} sx={{ backgroundColor: '#FAFAFA' }}>
                <Box padding={2}>
                  <Paragraph size='large' sx={{ fontSize: 'lg', textAlign: 'left' }} fontWeight='700'>
                    Students
                  </Paragraph>
                </Box>
              </Grid>
              {schoolYearDataCount[0].students.map((student, i) => (
                <Grid item key={i} xs={2} padding={2} sx={{ backgroundColor: '#FAFAFA' }}>
                  <Paragraph size='medium'>{student.count}</Paragraph>
                </Grid>
              ))}
              <Grid item xs={2}>
                <Box padding={2}>
                  <Paragraph size='large' sx={{ fontSize: 'lg', textAlign: 'left' }} fontWeight='700'>
                    Parents
                  </Paragraph>
                </Box>
              </Grid>
              {schoolYearDataCount[0].parents.map((parent, i) => (
                <Grid item key={i} xs={2} padding={2}>
                  <Paragraph size='medium'>{parent.count}</Paragraph>
                </Grid>
              ))}
              {specialEdStatus && (
                <Grid item xs={2} sx={{ backgroundColor: '#FAFAFA' }}>
                  <Box padding={2}>
                    <Paragraph size='large' sx={{ fontSize: 'lg', textAlign: 'left' }} fontWeight='700'>
                      SPED
                    </Paragraph>
                  </Box>
                </Grid>
              )}
              {specialEdStatus
                ? schoolYearDataCount[0].special_ed.map((sped, i) => (
                    <Grid item key={i} xs={2} padding={2} sx={{ backgroundColor: '#FAFAFA' }}>
                      <Paragraph size='medium'>{sped.count}</Paragraph>
                    </Grid>
                  ))
                : ''}
            </Grid>
          </Box>
        )}
      </Box>
    </Card>
  )
}
