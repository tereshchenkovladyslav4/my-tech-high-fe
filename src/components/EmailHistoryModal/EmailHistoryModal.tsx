import React, { useState } from 'react'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Modal, Grid, Typography } from '@mui/material'
import { sortBy } from 'lodash'
import moment from 'moment'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { Email } from '@mth/models'
import { commonClasses } from '@mth/styles/common.style'
import { emailHistoryModalClasses } from './styles'

type EmailHistoryModalProps = {
  handleModem: () => void
  data: Email[]
  handleSubmit: () => void
  defaultDateDirection?: string
  defaultSubjectDirection?: string
}

export const EmailHistoryModal: React.FC<EmailHistoryModalProps> = ({
  handleModem,
  data,
  handleSubmit,
  defaultDateDirection = '',
  defaultSubjectDirection = '',
}) => {
  const [dateSortDirection, setDateSortDirection] = useState<string>(defaultDateDirection)
  const [subjectSortDirection, setSubjectSortDirection] = useState<string>(defaultSubjectDirection)
  const [emailData, setEmailData] = useState<Email[]>(data)
  const [emailViewData, setEmailViewData] = useState<Email | undefined>()
  const [emailView, setEmailView] = useState(false)

  const handleEmailView = (email: Email) => {
    setEmailViewData(email)
    setEmailView(true)
  }

  const createMarkup = (value: string) => {
    return {
      __html: value,
    }
  }

  const handleSorting = (key: string) => {
    const sortedData = [...emailData]
    if (key === 'date') {
      if (dateSortDirection === '' || dateSortDirection === 'DESC') {
        sortedData.sort((a, b) => {
          return moment(b.created_at).diff(moment(a.created_at), 'seconds')
        })
        setEmailData(sortedData)
        setDateSortDirection('ASC')
      } else {
        sortedData.sort((a, b) => {
          return moment(a.created_at).diff(moment(b.created_at), 'seconds')
        })
        setEmailData(sortedData)
        setDateSortDirection('DESC')
      }
    } else {
      if (subjectSortDirection === '' || subjectSortDirection === 'DESC') {
        const sort = sortBy(sortedData, 'subject').reverse()
        setEmailData(sort)
        setSubjectSortDirection('ASC')
      } else {
        const sort = sortBy(sortedData, 'subject')
        setEmailData(sort)
        setSubjectSortDirection('DESC')
      }
    }
  }

  return (
    <>
      <Modal
        open={true}
        onClose={handleModem}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={{ ...commonClasses.modalWrap }}>
          <Box display={'flex'} flexDirection={'row'} sx={{ marginRight: '10px' }} justifyContent={'end'}>
            <CloseIcon style={emailHistoryModalClasses.close} onClick={handleSubmit} />
          </Box>
          <Box sx={emailHistoryModalClasses.modalHistoryContent}>
            <Box sx={emailHistoryModalClasses.emailRowHead}>
              <Subtitle fontWeight='700' sx={emailHistoryModalClasses.emailLabel}>
                Sent Date
                {dateSortDirection === '' || dateSortDirection === 'ASC' ? (
                  <ArrowDropDown
                    sx={{ cursor: 'pointer', ml: 2 }}
                    onClick={() => {
                      handleSorting('date')
                    }}
                  />
                ) : (
                  <ArrowDropUp
                    sx={{ cursor: 'pointer', ml: 2 }}
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
              <Box sx={emailHistoryModalClasses.emailRow} key={index} onClick={() => handleEmailView(item)}>
                <Grid container rowSpacing={2}>
                  <Grid item xs={4}>
                    <Subtitle fontWeight='700' sx={{ ...emailHistoryModalClasses.emailLabel, color: MthColor.MTHBLUE }}>
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
        <Box sx={{ ...commonClasses.modalWrap, maxWidth: '800px' }}>
          <Box sx={{ maxHeight: '80vh', overflow: 'auto', p: 1 }}>
            <Box display={'flex'} flexDirection={'row'} sx={{ marginRight: '10px' }} justifyContent={'end'}>
              <CloseIcon style={emailHistoryModalClasses.close} onClick={() => setEmailView(false)} />
            </Box>
            <Box sx={emailHistoryModalClasses.emailViewContent}>
              {emailViewData && (
                <Box sx={{ display: 'grid' }}>
                  <Box sx={{ display: 'flex' }}>
                    <Typography sx={{ fontWeight: 'bold' }}>From: </Typography>
                    <Typography sx={{ marginLeft: '10px' }}>{emailViewData?.from_email}</Typography>
                  </Box>
                  <Box sx={emailHistoryModalClasses.historySubject}>
                    <Subtitle fontWeight='700' sx={{ width: '100%', color: MthColor.GRAY }}>
                      {emailViewData?.subject}
                    </Subtitle>
                  </Box>
                  <Box sx={emailHistoryModalClasses.body}>
                    <div dangerouslySetInnerHTML={createMarkup(emailViewData.body)} />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  )
}
