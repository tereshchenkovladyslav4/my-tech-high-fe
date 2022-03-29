import { Card, Grid, IconButton } from '@mui/material'
import { Box } from '@mui/system'
import { map } from 'lodash'
import React, { useState } from 'react'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle';
import { MTHBLUE } from '../../../../utils/constants';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
export const SchoolYear = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const data = [
    {
      label: 'Pending',
      students: '10',
      parents: '10',
      sped: '2',
    },
    {
      label: 'Active',
      students: '10,500',
      parents: '4,000',
      sped: '600',
    },
    {
      label: 'Total',
      students: '10,510',
      parents: '4,010',
      sped: '602',
    },
    {
      label: 'Withdrawn',
      students: '1,500',
      parents: '800',
      sped: '100',
    },
    {
      label: 'Graduated',
      students: '100',
      parents: '100',
      sped: '5',
    },
  ]

  const renderRows = () =>
    map(data, (el, idx) => {
      const backgroundColor = idx === 0 || idx % 2 == 0 ? '#FAFAFA' : 'white'
      return (
        <Grid item container xs={12} sx={{ backgroundColor }} paddingX={4} paddingY={2} textAlign='left'>
          <Grid item xs={3}>
            <Paragraph size='large' fontWeight='700'>
              {el.label}
            </Paragraph>
          </Grid>
          <Grid item xs={3}>
            <Paragraph size='medium'>{el.students}</Paragraph>
          </Grid>
          <Grid item xs={3}>
            <Box marginLeft={2}>
              <Paragraph size='medium'>{el.sped}</Paragraph>
            </Box>
          </Grid>
          <Grid item xs={3} textAlign='left'>
            <Box marginLeft={4}>
              <Paragraph size='medium'>{el.parents}</Paragraph>
            </Box>
          </Grid>
        </Grid>
      )
    })

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
            <Subtitle color={MTHBLUE} size={12}>
              20-21
            </Subtitle>
            <Box sx={{ ml: 0.3, mt: 1 }}>
              <ExpandMoreIcon fontSize="small" />
            </Box>
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
              {renderRows()}
            </Grid>
          </Box>
        }
      </Box>
    </Card>
  )
}
