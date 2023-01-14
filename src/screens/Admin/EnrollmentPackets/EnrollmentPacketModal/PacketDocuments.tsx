import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Grid, Box } from '@mui/material'
import DeleteIcon from '@mth/assets/icons/icon-delete-small.svg'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, QUESTION_TYPE } from '@mth/enums'
import { CustomModal } from '../../SiteManagement/EnrollmentSetting/components/CustomModal/CustomModals'
import { deletePacketDocumentFileMutation, getPacketFiles } from '../services'
import { PacketModalQuestionsContext } from './providers'
import { useStyles } from './styles'

type EnrollmentPacketDocumentProps = {
  packetData: unknown
}

export const EnrollmentPacketDocument: React.FC<EnrollmentPacketDocumentProps> = ({ packetData }) => {
  const questions = useContext(PacketModalQuestionsContext)
  const classes = useStyles
  const [files, setFiles] = useState<Array<File>>([])
  const [fileIds, setFileIds] = useState('')
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState(null)

  const [deleteFile] = useMutation(deletePacketDocumentFileMutation)

  const { loading, data, refetch } = useQuery(getPacketFiles, {
    variables: {
      fileIds: fileIds,
    },
    fetchPolicy: 'network-only',
  })

  const onDeletefile = (id: number) => {
    setOpenConfirmModal(true)
    setSelectedFileId(id)
  }

  const onDeleteConfirm = async () => {
    await deleteFile({ variables: { fileId: `${selectedFileId}` } })
    refetch()
    setOpenConfirmModal(false)
  }

  useEffect(() => {
    if (packetData.files.length > 0) {
      const ids = []
      for (const packetfile of packetData.files) {
        ids.push(packetfile.mth_file_id)
      }
      setFileIds(ids.toString())
    }
  }, [packetData])

  useEffect(() => {
    if (data !== undefined) {
      const filesData = []
      if (packetData.files.length > 0) {
        for (const packetfile of packetData.files) {
          // if (packetfile.kind === 'bc' || packetfile.kind === 'ur' || packetfile.kind === 'im') {
          for (const file of data.packetFiles.results) {
            if (parseInt(packetfile.mth_file_id) === parseInt(file.file_id)) {
              const tempFile = {
                file_id: file.file_id,
                kind: packetfile.kind,
                name: file.name,
                url: file.signedUrl,
              }
              filesData.push(tempFile)
            }
          }
          // }
        }
      }
      setFiles(filesData)
    }
  }, [loading, data])
  return (
    <Grid container sx={{ paddingTop: '20px' }}>
      <Grid item md={12} sm={12} xs={12}>
        <Subtitle sx={{ fontSize: '18px', marginBottom: 1 }} color={MthColor.SYSTEM_01} fontWeight='700'>
          Documents
        </Subtitle>
      </Grid>

      <Grid container>
        <Grid
          sx={{
            '&.MuiGrid-root': {
              maxWidth: '640px',
            },
          }}
          item
          md={12}
          sm={12}
          xs={12}
        >
          {questions?.length > 0 &&
            questions
              ?.find((tab) => tab.tab_name === 'Documents')
              ?.groups[0]?.questions?.map((q, index): ReactElement | undefined => {
                if (q.type === QUESTION_TYPE.UPLOAD) {
                  const filteredFiles = files?.filter((file) => file.kind === q.question)
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: '8px' }}>
                      <Box sx={{ minWidth: '200px', maxWidth: '200px' }}>
                        <Paragraph key={index} color={MthColor.SYSTEM_06} sx={{ fontSize: '14px' }} fontWeight='400'>
                          {q.question}
                        </Paragraph>
                      </Box>
                      <Box
                        sx={{
                          width: '100%',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill,minmax(160px, 1fr))',
                          columnGap: 2,
                        }}
                      >
                        {files?.length > 0 ? (
                          filteredFiles.length > 0 ? (
                            filteredFiles
                              .sort((a, b) => {
                                if (a.name < b.name) {
                                  return -1
                                }
                                if (a.name > b.name) {
                                  return 1
                                }
                                return 0
                              })
                              .map((obj, fIndex) => {
                                return (
                                  <Paragraph
                                    key={`file-${fIndex}`}
                                    color={MthColor.PRIMARY_MEDIUM_MOUSEOVER}
                                    fontWeight='400'
                                    sx={{
                                      fontSize: '14px',
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      marginBottom: '4px',
                                      // width: '156px',
                                      wordBreak: 'break-all',
                                    }}
                                  >
                                    <a
                                      href={obj.url}
                                      target='_blank'
                                      style={{ cursor: 'pointer', textDecoration: 'unset' }}
                                      rel='noreferrer'
                                    >
                                      {obj.name.split('.').slice(0, -1).join('.')}
                                    </a>
                                    <img
                                      src={DeleteIcon}
                                      style={classes.deleteIcon}
                                      onClick={() => onDeletefile(obj.file_id)}
                                    />
                                  </Paragraph>
                                )
                              })
                          ) : (
                            <Paragraph color={MthColor.SYSTEM_06} sx={{ fontSize: '14px' }} fontWeight='400'>
                              Not found
                            </Paragraph>
                          )
                        ) : (
                          <Paragraph color={MthColor.SYSTEM_06} sx={{ fontSize: '14px' }} fontWeight='400'>
                            Not found
                          </Paragraph>
                        )}
                      </Box>
                    </Box>
                  )
                } else {
                  return undefined
                }
              })}
        </Grid>
      </Grid>

      {openConfirmModal && (
        <CustomModal
          title='Delete File'
          description='Are you sure you want to delete this file?'
          confirmStr='Delete'
          cancelStr='Cancel'
          onConfirm={onDeleteConfirm}
          onClose={() => setOpenConfirmModal(false)}
        />
      )}
    </Grid>
  )
}
