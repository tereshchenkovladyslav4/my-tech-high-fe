import React, { useEffect, useState } from 'react'
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

export const DocumentUploadModal: React.FC<SubmissionModal> = ({ handleModem, handleFile, limit }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
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

  const filesSelected = (e) => {
    const files = e.target.files
    handleFiles(files)
    e.target.files = null
  }

  const handleFiles = (files: File[]) => {
    if (limit && files.length + validFiles.length > limit) {
      setErrorMessage(`File submission limited to ${limit} files`)
      return
    }
    setSelectedFiles([])
    for (let i = 0; i < files.length; i++) {
      const file = validateFile(files[i])
      if (file.status === true) {
        setSelectedFiles((prevArray) => [...prevArray, files[i]])
      } else {
        setErrorMessage(file.message || '')
      }
    }
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
        <DocumentListItem file={file as File} closeAction={() => deleteFile(file)} />
      </Box>
    ))

  useEffect(() => {
    const filteredArr = selectedFiles.reduce((acc, current) => {
      const x = acc.find((item) => item.name === current.name)
      if (!x) {
        return acc.concat([current])
      } else {
        return acc
      }
    }, [] as File[])
    setValidFiles((pre) => [...pre, ...filteredArr])
  }, [selectedFiles])

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
    >
      <Box sx={documentUploadModalClasses.modalCard}>
        <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
          {validFiles.length > 0 && (
            <Box display='flex' flexDirection='column'>
              <Paragraph size='medium' fontWeight='700'>
                Uploaded
              </Paragraph>
              {renderFiles()}
            </Box>
          )}
        </Box>
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
        <Box justifyContent='space-between' display='flex' flexDirection='row'>
          <Button sx={documentUploadModalClasses.cancelButton} variant='contained' onClick={() => handleModem()}>
            Cancel
          </Button>
          {validFiles.length > 0 && (
            <Button sx={documentUploadModalClasses.finishButton} variant='contained' onClick={() => submitAndClose()}>
              Finish
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  )
}
