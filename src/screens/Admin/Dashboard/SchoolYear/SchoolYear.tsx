import { Card, Grid, IconButton } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle';
import { DropDown } from '../../../../components/DropDown/DropDown'
import { DropDownItem } from '../../../../components/DropDown/types'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { gql, useQuery } from '@apollo/client'
import moment from 'moment'

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

const data = [{
  students: [{
    status: 'Pending',
    count: '10' 
    }, 
    {
      status: 'Active',
      count: '10' 
    }, 
    {
      status: 'Total',
      count: '10' 
    },
    {
      status: 'Withdrawn',
      count: '10' 
    }, 
    {
      status: 'Graduated',
      count: '10' 
    }],
  parents: [{
    status: 'Pending',
    count: '10' 
    }, 
    {
      status: 'Active',
      count: '10' 
    }, 
    {
      status: 'Total',
      count: '10' 
    },
    {
      status: 'Withdrawn',
      count: '10' 
    }, 
    {
      status: 'Graduated',
      count: '10' 
    }],
    special_ed: [{
      status: 'Pending',
      count: '10' 
      }, 
      {
        status: 'Active',
        count: '10' 
      }, 
      {
        status: 'Total',
        count: '10' 
      },
      {
        status: 'Withdrawn',
        count: '10' 
      }, 
      {
        status: 'Graduated',
        count: '10' 
      }]
      }]

const status = ['Pending', 'Active', 'Total', 'Withdrawn', 'Graduated']
export const SchoolYear = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { me, setMe } = useContext(UserContext);
  const [schoolYears, setSchoolYears] = useState<Array<DropDownItem>>([]);
  const [selectedYear, setSelectedYear] = useState<number>();
  const [schoolYearDataCount, setSchoolYearDataCount] = useState(data);

  const schoolYearData = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const schoolYearDataCounts = useQuery(schoolYearsDataquery, {
    variables: {
      schoolYearDataInput: {
        region_id: me?.selectedRegionId,
        school_year_id: Number(selectedYear)
      }
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (schoolYearData?.data?.region?.SchoolYears) {
      setSchoolYears(
        schoolYearData?.data?.region?.SchoolYears.map((item) => {
          return {
            label: moment(item.date_begin).format('YY') + '-' + moment(item.date_end).format('YY'),
            value: item.school_year_id,
          }
        }),
      )
    }
  }, [me.selectedRegionId, schoolYearData?.data?.region?.SchoolYears])

  useEffect(() => {
    if(schoolYearDataCounts?.data?.schoolYearsData) {
      setSchoolYearDataCount(schoolYearDataCounts?.data?.schoolYearsData);
    }
  }, [schoolYearDataCounts?.data?.schoolYearsData, selectedYear])


  return (
    <Card>
      <Box display='flex' flexDirection='column'>
        <Box display='flex' flexDirection='row' alignItems="center" justifyContent="space-between" paddingX={4} paddingY={2}>
          <Box display='flex' flexDirection='row' alignItems="center" >
            <Subtitle size='large' fontWeight='bold'>
              School Year
            </Subtitle>
            <Box sx={{ ml: 0.5, mt: 0.5 }}>
              <IconButton onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ?
                  <ExpandLessIcon fontSize="small" />
                  :
                  <ExpandMoreIcon fontSize="small" />
                }
              </IconButton>
            </Box>
          </Box>
          <Box display='flex' flexDirection='row' alignItems="center" >
          <DropDown
            placeholder='select a year'
            dropDownItems={schoolYears}
            setParentValue={(val, index) => {
              setSelectedYear(val)
            }}
            defaultValue={schoolYears[0]?.value}
            size='small'
            sx={{ width: '100px' }}
          />
          </Box>
        </Box>
        {isExpanded &&
          <Box sx={{ padding: 4, paddingTop: 2 }}>
            <Grid container>
              <Grid item xs={3} />
              <Grid item xs={3}>
                <Box marginBottom={3}>
                  <Paragraph size='medium' fontWeight='600'>
                    Students
                  </Paragraph>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box>
                  <Paragraph size='medium' fontWeight='600'>
                    Sped
                  </Paragraph>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box>
                  <Paragraph size='medium' fontWeight='600'>
                    Parents
                  </Paragraph>
                </Box>
              </Grid>
              {status.map((el, idx) => {
                const backgroundColor = idx === 0 || idx % 2 == 0 ? '#FAFAFA' : 'white'
                return (
                  <Grid item container xs={12} sx={{ backgroundColor }} paddingX={4} paddingY={2}>
                    <Grid item xs={3} textAlign= 'left'>
                      <Paragraph size='medium' fontWeight='700'>
                        {el}
                      </Paragraph>
                    </Grid>
                    <Grid item xs={3}>
                      <Paragraph size='medium'>{schoolYearDataCount[0].students[idx].count}</Paragraph>
                    </Grid>
                    <Grid item xs={3}>
                      <Box marginLeft={2}>
                        <Paragraph size='medium'>{schoolYearDataCount[0].special_ed[idx].count}</Paragraph>
                      </Box>
                    </Grid>
                    <Grid item xs={3}>
                      <Box marginLeft={4}>
                        <Paragraph size='medium'>{schoolYearDataCount[0].parents[idx].count}</Paragraph>
                      </Box>
                    </Grid>
                  </Grid>
                )
              })}
            </Grid>
          </Box>
        }
      </Box>
    </Card>
  )
}
