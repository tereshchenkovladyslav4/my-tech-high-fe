import { Card, Grid, IconButton, Select, MenuItem, FormControl } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle';
import { DropDownItem } from '../../../../components/DropDown/types'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { gql, useQuery } from '@apollo/client'
import moment from 'moment'
import { makeStyles } from '@material-ui/styles'
const selectStyles = makeStyles({
  select: {
    "& .MuiSvgIcon-root": {
      color: "blue",
    }
  }
})


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


const useStyles = makeStyles({
  select: {
    "&:after": {
      borderBottomColor: "darkred",
    },
    "& .MuiSvgIcon-root": {
      color: "darkred",
    },
  },
});
export const SchoolYear = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { me, setMe } = useContext(UserContext);
  const [schoolYears, setSchoolYears] = useState<Array<DropDownItem>>([]);
  const [selectedYear, setSelectedYear] = useState<number>();
  const [schoolYearDataCount, setSchoolYearDataCount] = useState(data);

  const styles = theme => ({

  });

  const selectClasses = selectStyles()


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
    skip: selectedYear ? false : true,
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
      setSelectedYear(schoolYearData?.data?.region?.SchoolYears[0]?.school_year_id)
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
            {!schoolYearData.loading && selectedYear &&
          <FormControl variant='standard' sx={{ m: 1 }}>
            <Select
              size='small'
              value={selectedYear}
              IconComponent={ExpandMoreIcon}
              disableUnderline
              onChange={(e) => {
                setSelectedYear(e.target.value)
              }}
              label='year'
              className={selectClasses.select}
              sx={{ color: 'blue', border: 'none'}}
            >
              {schoolYears.map((sy) => (
                <MenuItem key={sy.value} value={sy.value}>{sy.label}</MenuItem>
              ))}
            </Select>
            </FormControl>
            }
          </Box>
        </Box>
        {isExpanded &&
          <Box>
            <Grid container paddingX={4} paddingY={2}>
              <Grid item xs={2}>
              </Grid>
              {status.map((val) => (
                <Grid item xs={2}>
                <Box marginBottom={3}>
                  <Paragraph size='large' sx={{ fontSize: 'lg' }} fontWeight='700'>
                    {val}
                  </Paragraph>
                </Box>
              </Grid>
              ))}
              <Grid item xs={2} sx={{ backgroundColor: '#FAFAFA' }}>
                <Box padding={2}>
                  <Paragraph size='large' sx={{ fontSize: 'lg' }} fontWeight='700'>
                    Students
                  </Paragraph>
                </Box>
              </Grid>
              {schoolYearDataCount[0].students.map((student) => (
                <Grid item xs={2} padding={2} sx={{ backgroundColor: '#FAFAFA' }}>
                  <Paragraph size='medium'>{student.count}</Paragraph>
                </Grid>
              ))}
              <Grid item xs={2}>
                <Box padding={2}>
                  <Paragraph size='large' sx={{ fontSize: 'lg' }} fontWeight='700'>
                    Parents
                  </Paragraph>
                </Box>
              </Grid>
              {schoolYearDataCount[0].parents.map((parent) => (
                <Grid item xs={2} padding={2}>
                  <Paragraph size='medium'>{parent.count}</Paragraph>
                </Grid>
              ))}
              <Grid item xs={2} sx={{ backgroundColor: '#FAFAFA' }}>
                <Box padding={2}> 
                  <Paragraph size='large' sx={{ fontSize: 'lg' }} fontWeight='700'>
                    Sped
                  </Paragraph>
                </Box>
              </Grid>
              {schoolYearDataCount[0].special_ed.map((sped) => (
                <Grid item xs={2} padding={2} sx={{ backgroundColor: '#FAFAFA' }}>
                  <Paragraph size='medium'>{sped.count}</Paragraph>
                </Grid>
              ))}
            </Grid>
          </Box>
        }
      </Box>
    </Card>
  )
}
