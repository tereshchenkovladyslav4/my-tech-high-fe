import React, { useState } from 'react'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import { Modal, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import moment from 'moment'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { WithdrawalEmailResponseVM } from '../type'
import { mainClasses } from './styles'

type WithdrawalEmailModalProps = {
  handleClose: () => void
  data: WithdrawalEmailResponseVM[]
}

export const WithdrawalEmailModal: React.FC<WithdrawalEmailModalProps> = ({ handleClose, data }) => {
  const [dateSortDirection, setDateSortDirection] = useState<string>('')
  const [subjectSortDirection, setSubjectSortDirection] = useState<string>('')
  const [emailData, setEmailData] = useState<WithdrawalEmailResponseVM[]>(data)
  const [emailViewData, setEmailViewData] = useState<WithdrawalEmailResponseVM>({
    from_email: '',
    subject: '',
    body: '',
    created_at: '',
  })
  const [emailView, setEmailView] = useState<boolean>(false)

  const handleEmailView = (email: WithdrawalEmailResponseVM) => {
    setEmailViewData(email)
    setEmailView(true)
  }

  const handleSorting = (key: string) => {
    const sortedData = [...emailData]
    if (key === 'date') {
      if (dateSortDirection === '' || dateSortDirection === 'DESC') {
        sortedData.sort((a, b) => {
          const dateA: Date = new Date(a.created_at)
          const dateB: Date = new Date(b.created_at)
          return dateA.getDate() - dateB.getDate()
        })
        setEmailData(sortedData)
        setDateSortDirection('ASC')
      } else {
        sortedData.sort((a, b) => {
          const dateA: Date = new Date(a.created_at)
          const dateB: Date = new Date(b.created_at)
          return dateB.getDate() - dateA.getDate()
        })
        setEmailData(sortedData)
        setDateSortDirection('DESC')
      }
    } else {
      if (subjectSortDirection === '' || subjectSortDirection === 'DESC') {
        sortedData.sort((a, b) => {
          if (a.subject[0].toLowerCase() < b.subject[0].toLowerCase()) {
            return -1
          }
          if (a.subject[0].toLowerCase() > b.subject[0].toLowerCase()) {
            return 1
          }
          return 1
        })
        setEmailData(sortedData)
        setSubjectSortDirection('ASC')
      } else {
        sortedData.sort((a, b) => {
          if (a.subject[0].toLowerCase() > b.subject[0].toLowerCase()) {
            return -1
          }
          if (a.subject[0].toLowerCase() < b.subject[0].toLowerCase()) {
            return 1
          }
          return -1
        })
        setEmailData(sortedData)
        setSubjectSortDirection('DESC')
      }
    }
  }

  return (
    <>
      <Modal
        open={true}
        onClose={() => handleClose()}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={mainClasses.modalEmailCard}>
          <Box display={'flex'} flexDirection={'row'} sx={{ marginRight: '10px' }} justifyContent={'end'}>
            <CloseIcon style={mainClasses.close} onClick={handleClose} />
          </Box>
          <Box sx={{ ...mainClasses.content, display: 'block' }}>
            <Box sx={mainClasses.emailRowHead}>
              <Subtitle fontWeight='700' sx={mainClasses.emailLabel}>
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
            {emailData &&
              emailData.slice(0, 5).map((item, index) => (
                <Box sx={mainClasses.emailRow} key={index} onClick={() => handleEmailView(item)}>
                  <Grid container rowSpacing={2}>
                    <Grid item xs={4}>
                      <Subtitle fontWeight='700' sx={mainClasses.emailLabel}>
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
        <Box sx={mainClasses.modalEmailViewCard}>
          <Box display={'flex'} flexDirection={'row'} sx={{ marginRight: '10px' }} justifyContent={'end'}>
            <CloseIcon style={mainClasses.close} onClick={() => setEmailView(false)} />
          </Box>
          <Box sx={mainClasses.emailViewContent}>
            {emailViewData && (
              <Box sx={{ display: 'grid' }}>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ fontWeight: 'bold' }}>From: </Typography>
                  <Typography sx={{ marginLeft: '10px' }}>{emailViewData?.from_email}</Typography>
                </Box>
                <Box sx={mainClasses.subject}>
                  <Subtitle fontWeight='700' sx={{ width: '100%' }}>
                    {emailViewData?.subject}
                  </Subtitle>
                </Box>
                <Box sx={mainClasses.body}>
                  <Typography
                    component={'span'}
                    variant={'body2'}
                    dangerouslySetInnerHTML={{ __html: emailViewData.body }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  )
}
