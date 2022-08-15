import React from 'react'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Grid, IconButton, Modal, Tooltip } from '@mui/material'
import DownloadFileIcon from '@mth/assets/icons/file-download.svg'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { s3URL } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { recordClassess } from '../styles'
import { StudentFilesModalProps, StudentRecord, StudentRecordFile } from '../types'
import { studentFilesModalClassess } from './styles'

const StudentFilesModal: React.FC<StudentFilesModalProps> = ({ record, handleModem, handleDownload }) => {
  const handleFileClick = (file: StudentRecordFile) => {
    if (file?.filePath) {
      window.open(`${s3URL}${file.filePath}`)
    }
  }

  const handleFileDownload = (file: StudentRecordFile) => {
    if (record) {
      const downloadItem: StudentRecord = {
        ...record,
        files: record?.files?.filter((item) => item?.fileId === file.fileId),
      }

      handleDownload([downloadItem], true)
    }
  }

  const renderStudentRecordFiles = () => {
    return record?.files?.map((file, index) => (
      <Grid item key={index} xs={12} lg={3} sx={{ padding: 2 }}>
        <Box sx={recordClassess.record}>
          <Paragraph
            size='medium'
            sx={{ cursor: 'pointer', color: MthColor.MTHBLUE, maxWidth: '100px', wordWrap: 'break-word' }}
            fontWeight='700'
            onClick={() => handleFileClick(file)}
          >
            {`${file.fileName}`}
          </Paragraph>
          <Box
            sx={{ marginLeft: '10px', maxWidth: '40px', cursor: 'pointer' }}
            onClick={() => handleFileDownload(file)}
          >
            <Tooltip title='Download' placement='top'>
              <img src={DownloadFileIcon} alt='Download Icon' />
            </Tooltip>
          </Box>
        </Box>
      </Grid>
    ))
  }

  return (
    <Modal
      open={true}
      onClose={() => handleModem()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      disableAutoFocus={true}
    >
      <Box sx={studentFilesModalClassess.modalCard}>
        <Box sx={studentFilesModalClassess.header}>
          <Box sx={{ ...studentFilesModalClassess.header, width: '50%', paddingX: 2 }}>
            <Subtitle
              sx={{ marginY: 'auto' }}
              size='medium'
              fontWeight='700'
            >{`${record?.lastName}, ${record?.firstName}`}</Subtitle>
            <Tooltip title='Download All' placement='top'>
              <img
                src={DownloadFileIcon}
                style={{ cursor: 'pointer' }}
                alt='Download Icon'
                onClick={() => {
                  if (record) handleDownload([record])
                }}
              />
            </Tooltip>
            <Button
              disableElevation
              variant='contained'
              sx={studentFilesModalClassess.addButton}
              startIcon={<AddIcon />}
            >
              <Subtitle sx={{ whiteSpace: 'nowrap' }}>Add File</Subtitle>
            </Button>
          </Box>
          <IconButton sx={{ padding: 0, top: '-5px' }} onClick={handleModem}>
            <CloseIcon style={studentFilesModalClassess.close} />
          </IconButton>
        </Box>
        <Box>
          <Grid container sx={{ textAlign: 'left' }}>
            <Grid item container xs={12} lg={12}>
              {renderStudentRecordFiles()}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  )
}

export default StudentFilesModal
