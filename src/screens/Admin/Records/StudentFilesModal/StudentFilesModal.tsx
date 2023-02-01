import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useMutation } from '@apollo/client'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Grid, IconButton, Modal, Tooltip } from '@mui/material'
import DownloadFileIcon from '@mth/assets/icons/file-download.svg'
import { DocumentUploadModal } from '@mth/components/DocumentUploadModal/DocumentUploadModal'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { s3URL } from '@mth/constants'
import { FileCategory, MthColor } from '@mth/enums'
import { useEnrollmentPacketDocumentListByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { uploadFile } from '@mth/services'
import { getRegionCode } from '@mth/utils'
import { RegisterStudentRecordFileMutation } from '../services'
import { recordClasses } from '../styles'
import { StudentFilesModalProps, StudentRecord, StudentRecordFile } from '../types'
import { studentFilesModalClassess } from './styles'

const StudentFilesModal: React.FC<StudentFilesModalProps> = ({ record, handleModem, handleDownload, refetch }) => {
  const { me } = useContext(UserContext)
  const [stateName, setStateName] = useState<string>('')
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false)
  const [fileTypeList, setFileTypeList] = useState<DropDownItem[]>([])
  const [selectedDocumentFileType, setSelectedDocumentFileType] = useState<string>('')

  const fileNamePrefix = useMemo(
    () => `${record?.firstName.charAt(0).toUpperCase()}.${record?.lastName}`,
    [record?.firstName, record?.lastName],
  )

  const { data: enrollmentPacketDocumentList } = useEnrollmentPacketDocumentListByRegionId(Number(me?.selectedRegionId))
  const [submitSave, {}] = useMutation(RegisterStudentRecordFileMutation)

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

  const handleFileChange = async (files: File[]) => {
    if (!files?.length) return
    const file = files[0]
    if (selectedDocumentFileType) {
      const fileType = file.name.split('.')?.at(-1)
      const renamedFile = new File([file], `${fileNamePrefix}${selectedDocumentFileType}.${fileType}`, {
        type: file.type,
      })
      const result = await uploadFile(
        renamedFile,
        FileCategory.STUDENT_RECORDS,
        getRegionCode(stateName),
        record?.studentId,
      )
      await submitSave({
        variables: {
          createStudentRecordFileInput: {
            FileId: Number(result?.data?.file?.file_id),
            RecordId: Number(record?.recordId),
            file_kind: selectedDocumentFileType,
          },
        },
      })
      setSelectedDocumentFileType('')
      refetch()
    }
  }

  const renderStudentRecordFiles = () => {
    return record?.files?.map((file, index) => (
      <Grid item key={index} xs={12} lg={3} sx={{ padding: 2 }}>
        <Box sx={recordClasses.record}>
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

  const fileTypeNode = (
    <Box sx={{ width: '50%' }}>
      <DropDown
        dropDownItems={fileTypeList}
        placeholder={'File Type'}
        labelTop
        size='medium'
        defaultValue={selectedDocumentFileType}
        borderNone={true}
        setParentValue={(val) => {
          setSelectedDocumentFileType(`${val}`)
        }}
      />
    </Box>
  )

  useEffect(() => {
    if (enrollmentPacketDocumentList?.length > 0) {
      setFileTypeList(enrollmentPacketDocumentList)
    }
  }, [enrollmentPacketDocumentList])

  useEffect(() => {
    const selectedRegion = me?.userRegion?.find((region) => region.region_id === me?.selectedRegionId)
    setStateName(selectedRegion?.regionDetail?.name || '')
  }, [me?.selectedRegionId])

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
              onClick={() => setShowUploadModal(true)}
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
        {showUploadModal && (
          <DocumentUploadModal
            handleModem={() => setShowUploadModal(false)}
            handleFile={(files: File[]) => handleFileChange(files)}
            secondaryModal={true}
            node={fileTypeNode}
            limit={1}
            isUploadAble={selectedDocumentFileType ? true : false}
          />
        )}
      </Box>
    </Modal>
  )
}

export default StudentFilesModal
