import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { Box, Button, Modal } from '@mui/material'
import { filter, map } from 'lodash'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { MthColor } from '@mth/enums'
import { DocumentListItem } from './DocumentListItem'
import { documentUploadModalClasses } from './styles'
import { SubmissionModal } from './types'

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget & File
}

type ValidateFileResponse = {
  status: boolean
  message?: string
}

export const DocumentUploadModal: React.FC<SubmissionModal> = ({
  handleModem,
  handleFile,
  limit,
  secondaryModal,
  node,
}) => {
  const [validFiles, setValidFiles] = useState<File[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const preventDefault = (e: HTMLInputEvent) => {
    e.preventDefault()
  }
  const dragOver = (e: HTMLInputEvent) => {
    preventDefault(e)
  }
  const dragEnter = (e: HTMLInputEvent) => {
    preventDefault(e)
  }
  const dragLeave = (e: HTMLInputEvent) => {
    preventDefault(e)
  }
  const fileDrop = (e: HTMLInputEvent) => {
    preventDefault(e)
    const files = e.dataTransfer.files
    handleFiles(files)
  }
  const handleNewFiles = (newFiles: File[]) => {
    const filteredArr = newFiles.reduce((acc, current) => {
      const x = acc.find((item) => item.name === current.name)
      if (!x) {
        return acc.concat([current])
      } else {
        return acc
      }
    }, [] as File[])
    setValidFiles((pre) => [...pre, ...filteredArr])
  }
  const filesSelected = (e) => {
    const files = e.target.files
    handleFiles(files)
    // Have to release file input element
    e.target.value = ''
  }
  const handleFiles = (files: File[]) => {
    if (limit && files.length + validFiles.length > limit) {
      setErrorMessage(`File submission limited to ${limit} files`)
      return
    }
    let newFiles: File[] = []
    for (let i = 0; i < files.length; i++) {
      const file = validateFile(files[i])
      if (file.status === true) {
        newFiles = newFiles.concat(files[i])
      } else {
        setErrorMessage(file.message || '')
      }
    }
    handleNewFiles(newFiles)
  }
  const validateFile = (file: File): ValidateFileResponse => {
    // Get the size of the file by files.item(i).size.
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg']
    if (Math.round(file.size / 1024) > 25000) {
      return {
        status: false,
        message: 'This file exceeds maximum allowed size of 25 MB',
      }
    }
    if (validTypes.indexOf(file.type) === -1) {
      return {
        status: false,
        message: 'Please only submit pdf, jpeg, or png',
      }
    }
    return {
      status: true,
    }
  }
  const deleteFile = (file: File) => {
    setValidFiles(filter(validFiles, (validFile) => validFile !== file))
  }
  const submitAndClose = () => {
    handleFile(validFiles)
    handleModem()
  }
  const renderFiles = () =>
    map(validFiles, (file, idx) => (
      <Box key={idx}>
        <DocumentListItem file={file as File} secondaryModal={secondaryModal} closeAction={() => deleteFile(file)} />
      </Box>
    ))
  useEffect(() => {
    if (limit && validFiles?.length > limit) {
      setErrorMessage(`File submission limited to ${limit} files`)
    } else {
      setErrorMessage('')
    }
  }, [validFiles])

  return (
    <Modal
      open={true}
      onClose={() => handleModem()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      disableAutoFocus
    >
      <Box sx={documentUploadModalClasses.modalCard}>
        {secondaryModal && validFiles.length == 0 && (
          <Box display={'flex'} flexDirection={'row'} justifyContent={'end'} sx={{ marginBottom: 5 }}>
            <CloseIcon style={documentUploadModalClasses.closeBtn} onClick={() => handleModem()} />
          </Box>
        )}
        <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
          {!node && validFiles.length > 0 ? (
            <Box display='flex' flexDirection='column'>
              <Paragraph size='medium' fontWeight='700'>
                Uploaded
              </Paragraph>
              {renderFiles()}
            </Box>
          ) : node && validFiles.length > 0 ? (
            <>
              <Box display='flex' flexDirection='column'>
                <Paragraph size='medium' fontWeight='700'>
                  Uploaded
                </Paragraph>
                {renderFiles()}
              </Box>
              {node}
            </>
          ) : (
            <></>
          )}
        </Box>
        {((node && !validFiles?.length) || !node) && (
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            onDragOver={dragOver}
            onDragEnter={dragEnter}
            onDragLeave={dragLeave}
            onDrop={fileDrop}
          >
            <UploadFileIcon />
            <Paragraph size='medium' fontWeight='700' sx={documentUploadModalClasses.dragAndDropText}>
              Drag &amp; Drop to Upload
            </Paragraph>
            <Paragraph size='medium' color={MthColor.SYSTEM_06}>
              {' '}
              Or
            </Paragraph>
            <Button sx={documentUploadModalClasses.uploadButton} variant='contained'>
              <label>
                <input
                  type='file'
                  style={documentUploadModalClasses.input}
                  onChange={filesSelected}
                  multiple
                  accept='application/pdf, image/png, image/jpeg'
                />
                Browse Files
              </label>
            </Button>
            <Paragraph size='medium' fontWeight='700' color={MthColor.RED}>
              {errorMessage}
            </Paragraph>
          </Box>
        )}
        <Box justifyContent='space-between' display='flex' flexDirection='row'>
          {((secondaryModal && validFiles.length > 0) || !secondaryModal) && (
            <Button
              sx={{
                ...documentUploadModalClasses.cancelButton,
                background: secondaryModal ? MthColor.SYSTEM_08 : MthColor.BUTTON_LINEAR_GRADIENT,
                color: secondaryModal ? MthColor.BLACK : MthColor.WHITE,
              }}
              variant='contained'
              onClick={() => handleModem()}
            >
              Cancel
            </Button>
          )}
          {validFiles.length > 0 && (
            <Button
              sx={{
                ...documentUploadModalClasses.finishButton,
                background: secondaryModal ? MthColor.BLACK : MthColor.BUTTON_LINEAR_GRADIENT,
              }}
              variant='contained'
              onClick={() => submitAndClose()}
            >
              Finish
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  )
}
