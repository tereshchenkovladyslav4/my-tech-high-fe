import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { SYSTEM_06, SYSTEM_01, PRIMARY_MEDIUM_MOUSEOVER } from '../../../../utils/constants'
import { useMutation, useQuery } from '@apollo/client'
import { deletePacketDocumentFileMutation, getPacketFiles } from '../services'
import { useStyles } from './styles'
import { WarningModal } from '../../../../components/WarningModal/Warning'
// @ts-ignore
import DeleteIcon from '../../../../assets/icons/icon-delete-small.svg'

export const EnrollmentPacketDocument = ({ packetData }) => {
  const classes = useStyles
  const [files, setFiles] = useState<Array<any>>([])
  const [fileIds, setFileIds] = useState('')
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState(null)

  const [deleteFile] = useMutation(deletePacketDocumentFileMutation)

  const { loading, error, data, refetch } = useQuery(getPacketFiles, {
    variables: {
      fileIds: fileIds,
    },
    fetchPolicy: 'network-only',
  })

  const onDeletefile = (id: any) => {
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
          if (packetfile.kind === 'bc' || packetfile.kind === 'ur' || packetfile.kind === 'im') {
            for (const file of data.packetFiles.results) {
              if (parseInt(packetfile.mth_file_id) === parseInt(file.file_id)) {
                const tempFile = {
                  file_id: file.file_id,
                  kind: packetfile.kind,
                  name:
                    packetData.student?.person.first_name.substring(0, 1).toUpperCase() +
                    '.' +
                    packetData.student?.person.last_name +
                    packetfile.kind.toUpperCase(),
                  url: file.signedUrl,
                }
                filesData.push(tempFile)
              }
            }
          }
        }
      }

      setFiles(filesData)
    }
  }, [loading, data])

  return (
    <Grid container sx={{ paddingTop: '20px' }}>
      <Grid item md={12} sm={12} xs={12}>
        <Subtitle color={SYSTEM_01} size='medium' fontWeight='700'>
          Documents
        </Subtitle>
      </Grid>

      <Grid container>
        <Grid
          sx={{
            '&.MuiGrid-root': {
              maxWidth: '33%',
            },
          }}
          item
          md={6}
          sm={6}
          xs={12}
        >
          <Paragraph color={SYSTEM_06} size='medium' fontWeight='400'>
            Birth Certificate
          </Paragraph>
          <Paragraph color={SYSTEM_06} size='medium' fontWeight='400'>
            Immunization
          </Paragraph>
          <Paragraph color={SYSTEM_06} size='medium' fontWeight='400'>
            Proof of Residency
          </Paragraph>
        </Grid>
        <Grid item md={6} sm={6} xs={12}>
          {files?.length > 0 ? (
            <div>
              {files?.find((e) => e.kind === 'bc') ? (
                <Paragraph
                  color={PRIMARY_MEDIUM_MOUSEOVER}
                  size='medium'
                  fontWeight='400'
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <a
                    href={files?.find((e) => e.kind === 'bc').url}
                    target='_blank'
                    style={{ cursor: 'pointer' }}
                    rel='noreferrer'
                  >
                    {files?.find((e) => e.kind === 'bc').name}
                  </a>
                  <img
                    src={DeleteIcon}
                    style={classes.deleteIcon}
                    onClick={() => onDeletefile(files?.find((e) => e.kind === 'bc').file_id)}
                  />
                </Paragraph>
              ) : (
                <Paragraph color={SYSTEM_06} size='medium' fontWeight='400'>
                  Not found
                </Paragraph>
              )}
              {files?.find((e) => e.kind === 'im') ? (
                <Paragraph
                  color={PRIMARY_MEDIUM_MOUSEOVER}
                  size='medium'
                  fontWeight='400'
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <a
                    href={files?.find((e) => e.kind === 'im').url}
                    target='_blank'
                    style={{ cursor: 'pointer' }}
                    rel='noreferrer'
                  >
                    {files?.find((e) => e.kind === 'im').name}
                  </a>
                  <img
                    src={DeleteIcon}
                    style={classes.deleteIcon}
                    onClick={() => onDeletefile(files?.find((e) => e.kind === 'im').file_id)}
                  />
                </Paragraph>
              ) : (
                <Paragraph color={SYSTEM_06} size='medium' fontWeight='400'>
                  Not found
                </Paragraph>
              )}
              {files?.find((e) => e.kind === 'ur') ? (
                <Paragraph
                  color={PRIMARY_MEDIUM_MOUSEOVER}
                  size='medium'
                  fontWeight='400'
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <a
                    href={files?.find((e) => e.kind === 'ur').url}
                    target='_blank'
                    style={{ cursor: 'pointer' }}
                    rel='noreferrer'
                  >
                    {files?.find((e) => e.kind === 'ur').name}
                  </a>
                  <img
                    src={DeleteIcon}
                    style={classes.deleteIcon}
                    onClick={() => onDeletefile(files?.find((e) => e.kind === 'ur').file_id)}
                  />
                </Paragraph>
              ) : (
                <Paragraph color={SYSTEM_06} size='medium' fontWeight='400'>
                  Not found
                </Paragraph>
              )}
            </div>
          ) : (
            <div>
              <Paragraph color={SYSTEM_06} size='medium' fontWeight='400'>
                Not found
              </Paragraph>
              <Paragraph color={SYSTEM_06} size='medium' fontWeight='400'>
                Not found
              </Paragraph>
              <Paragraph color={SYSTEM_06} size='medium' fontWeight='400'>
                Not found
              </Paragraph>
            </div>
          )}
        </Grid>
      </Grid>

      {openConfirmModal && (
        <WarningModal
          handleModem={() => setOpenConfirmModal(!openConfirmModal)}
          title='Delete Document File'
          subtitle='Are you sure you want to delete?'
          btntitle='Confirm'
          handleSubmit={onDeleteConfirm}
        />
      )}
    </Grid>
  )
}
