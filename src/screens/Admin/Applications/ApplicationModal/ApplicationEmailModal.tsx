import React, { useState } from 'react'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import { Modal, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { sortBy } from 'lodash'
import moment from 'moment'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { useStyles } from './styles'
import { ApplicationEmailModalProps } from './types'

type emailDataType = {
  from_email: string
  subject: string
  body: string
}
export const ApplicationEmailModal: React.FC<ApplicationEmailModalProps> = ({ handleModem, data, handleSubmit }) => {
  const classes = useStyles
  const [dateSortDirection, setDateSortDirection] = useState('')
  const [subjectSortDirection, setSubjectSortDirection] = useState('')
  const [emailData, setEmailData] = useState(data)
  const [emailViewData, setEmailViewData] = useState<emailDataType>({
    from_email: '',
    subject: '',
    body: '',
  })
  const [emailView, setEmailView] = useState(false)

  const handleEmailView = (email) => {
    setEmailViewData(email)
    setEmailView(true)
  }

  const createMarkup = (value) => {
    return {
      __html: value,
    }
  }

  const handleSorting = (key) => {
    const sortedData = [...emailData]
    if (key === 'date') {
      if (dateSortDirection === '' || dateSortDirection === 'DESC') {
        // const sort = sortBy(sortedData, 'date')
        sortedData.sort((a, b) => {
          const dateA: Date = new Date(a.created_at)
          const dateB: Date = new Date(b.created_at)
          return dateA - dateB
        })
        setEmailData(sortedData)
        setDateSortDirection('ASC')
      } else {
        sortedData.sort((a, b) => {
          const dateA: Date = new Date(a.created_at)
          const dateB: Date = new Date(b.created_at)
          return dateB - dateA
        })
        setEmailData(sortedData)
        setDateSortDirection('DESC')
      }
    } else {
      if (subjectSortDirection === '' || subjectSortDirection === 'DESC') {
        const sort = sortBy(sortedData, 'subject')
        setEmailData(sort)
        setSubjectSortDirection('ASC')
      } else {
        const sort = sortBy(sortedData, 'subject').reverse()
        setEmailData(sort)
        setSubjectSortDirection('DESC')
      }
    }
  }
  return (
    <>
      <Modal
        open={true}
        onClose={() => handleModem()}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={classes.modalEmailCard}>
          <Box display={'flex'} flexDirection={'row'} sx={{ marginRight: '10px' }} justifyContent={'end'}>
            <CloseIcon style={classes.close} onClick={handleSubmit} />
          </Box>
          <Box sx={classes.content}>
            <Box sx={classes.emailRowHead}>
              <Subtitle fontWeight='700' sx={classes.emailLabel}>
                Sent Date
                {dateSortDirection === '' || dateSortDirection === 'ASC' ? (
                  <ArrowDropDown
                    sx={{ ml: 2 }}
                    onClick={() => {
                      handleSorting('date')
                    }}
                  />
                ) : (
                  <ArrowDropUp
                    sx={{ ml: 2 }}
                    onClick={() => {
                      handleSorting('date')
                    }}
                  />
                )}
              </Subtitle>
              <Subtitle fontWeight='700' sx={{ display: 'flex', alignItems: 'center' }}>
                Subject
                {subjectSortDirection === '' || subjectSortDirection === 'ASC' ? (
                  <ArrowDropDown
                    sx={{ ml: 2 }}
                    onClick={() => {
                      handleSorting('subject')
                    }}
                  />
                ) : (
                  <ArrowDropUp
                    sx={{ ml: 2 }}
                    onClick={() => {
                      handleSorting('subject')
                    }}
                  />
                )}
              </Subtitle>
            </Box>
            {emailData.slice(0, 5).map((item, index) => (
              <Box sx={classes.emailRow} key={index} onClick={() => handleEmailView(item)}>
                <Grid container rowSpacing={2}>
                  <Grid item xs={4}>
                    <Subtitle fontWeight='700' sx={classes.emailLabel}>
                      {moment(item.created_at).format('MM/DD/yy')}
                    </Subtitle>
                  </Grid>
                  <Grid item xs={8}>
                    <Subtitle fontWeight='700' sx={{ textAlign: 'left', width: '50', paddingLeft: '10px' }}>
                      {item.subject}
                    </Subtitle>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
      <Modal
        open={emailView}
        onClose={() => setEmailView(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={classes.modalEmailViewCard}>
          <Box display={'flex'} flexDirection={'row'} sx={{ marginRight: '10px' }} justifyContent={'end'}>
            <CloseIcon style={classes.close} onClick={() => setEmailView(false)} />
          </Box>
          <Box sx={classes.emailViewContent}>
            {emailViewData && (
              <Box sx={{ display: 'grid' }}>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ fontWeight: 'bold' }}>From: </Typography>
                  <Typography sx={{ marginLeft: '10px' }}>{emailViewData?.from_email}</Typography>
                </Box>
                <Box sx={classes.subject}>
                  <Subtitle fontWeight='700' sx={{ width: '100%' }}>
                    {emailViewData?.subject}
                  </Subtitle>
                </Box>
                <Box sx={classes.body}>
                  <div dangerouslySetInnerHTML={createMarkup(emailViewData.body)} />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  )
}
