import React, { useState } from 'react'
import { Button, Modal, Grid } from '@mui/material'
import { Box } from '@mui/system'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { ApplicationEmailModalType } from './types'
import { useStyles } from './styles'
import moment from 'moment'
import { sortBy } from 'lodash'
import { ArrowDropDown, ArrowDropUp, FormatAlignJustify } from '@mui/icons-material'
export const ApplicationEmailModal: ApplicationEmailModalType = ({ handleModem, data, handleSubmit }) => {
  const classes = useStyles
  const [dateSortDirection, setDateSortDirection] = useState('')
  const [subjectSortDirection, setSubjectSortDirection] = useState('')
  const [emailData, setEmailData] = useState(data)


  const handleSorting = (key) => {
    const sortedData = [...emailData]
    if(key === 'date') {
      if(dateSortDirection === '' || dateSortDirection === 'DESC') {
        // const sort = sortBy(sortedData, 'date')
        sortedData.sort((a, b) => {
          const dateA: Date = new Date(a.created_at);
          const dateB: Date = new Date(b.created_at);
          return dateA - dateB;
        });
        setEmailData(sortedData);
        setDateSortDirection('ASC')
      } else {
        sortedData.sort((a, b) => {
          const dateA: Date = new Date(a.created_at);
          const dateB: Date = new Date(b.created_at);
          return dateB - dateA;
        });
        setEmailData(sortedData);
        setDateSortDirection('DESC')
      }
    } else {
      if(subjectSortDirection === '' || subjectSortDirection === 'DESC') {
        const sort = sortBy(sortedData, 'subject')
        setEmailData(sort);
        setSubjectSortDirection('ASC')
      } else {
        const sort = sortBy(sortedData, 'subject').reverse()
        setEmailData(sort);
        setSubjectSortDirection('DESC')
      }
    }
  }
  return (
    <Modal
      open={true}
      onClose={() => handleModem()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={classes.modalEmailCard}>
        <Box sx={classes.content}>
          <Box sx={classes.emailRowHead}>
            <Subtitle fontWeight='700' sx={classes.emailLabel}>
              Sent Date 
              { dateSortDirection === '' || dateSortDirection === 'ASC' ? 
              <ArrowDropDown sx={{ ml: 2 }} onClick={() => { handleSorting('date'); }}/> : 
              <ArrowDropUp sx={{ ml: 2 }} onClick={() => { handleSorting('date'); }}/>
              }
            </Subtitle>
            <Subtitle fontWeight='700' sx={{ display: 'flex', alignItems: 'center' }}>
              Subject 
              { subjectSortDirection === '' || subjectSortDirection === 'ASC' ? 
              <ArrowDropDown sx={{ ml: 2 }} onClick={() => { handleSorting('subject'); }}/> : 
              <ArrowDropUp sx={{ ml: 2 }} onClick={() => { handleSorting('subject'); }}/>
              }
            </Subtitle>
          </Box>
          {emailData.slice(0, 5).map((item, index) => (
            <Box sx={classes.emailRow} key={index}>
              <Grid container rowSpacing={2}>
                <Grid item xs={4}>
                  <Subtitle fontWeight='700' sx={classes.emailLabel}>
                    {moment(item.created_at).format('MM/DD/yy')}
                  </Subtitle>
                </Grid>
				        <Grid item xs={8}>
                  <Subtitle fontWeight='700'  sx={{ textAlign: "left", width: "50", paddingLeft: "10px" }}>{item.subject}</Subtitle>
                </Grid>
			        </Grid>
            </Box>
          ))}
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Button variant='contained' disableElevation sx={classes.ok} onClick={handleSubmit}>
            OK
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
