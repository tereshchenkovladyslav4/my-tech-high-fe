import React, { useEffect, useState, useRef } from 'react'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'
import { Box, Button, Modal } from '@mui/material'
import { filter, map } from 'lodash'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { RED, SYSTEM_06 } from '../../../../../utils/constants'
import { DocumentListItem } from '../DocumentList/DocumentListItem'
import { useStyles } from './styles'
import { DocumentUploadModalTemplateType } from './types'

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget & File
}

type ValidateFileResponse = {
  status: boolean
  message?: string
}

export const DocumentUploadModal: DocumentUploadModalTemplateType = ({ handleModem, handleFile, limit }) => {
  const classes = useStyles

  const [selectedFiles, setSelectedFiles] = useState([])
  const [validFiles, setValidFiles] = useState<File[]>([])
  const [errorMessage, setErrorMessage] = useState('')

  const [deletedFiles, setDeletedFiles] = useState([])

  const inputRef = useRef(null)

  useEffect(() => {
    const filteredArr = selectedFiles.reduce((acc, current) => {
      const x = acc.find((item) => item.name === current.name)
      if (!x) {
        return acc.concat([current])
      } else {
        return acc
      }
    }, [])
    const filterDeletedFiles = filter(filteredArr, (file) => !deletedFiles.includes(file))
    setValidFiles([...filterDeletedFiles])
  }, [selectedFiles])

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
    if (limit && files.length > limit) {
      setErrorMessage(`File submission limited to ${limit} files`)
    } else {
      handleFiles(files)
    }
  }

  const filesSelected = (e: unknown) => {
    handleFiles(e.target.files)
  }

  const handleFiles = (files: FileList[]) => {
    const lastElement = files[files.length - 1]
    const indexToDelete = deletedFiles.findIndex((object) => {
      return object.name === lastElement.name
    })
    if (indexToDelete !== -1) {
      deletedFiles.splice(indexToDelete, 1)
    }
    for (let i = 0; i < files.length; i++) {
      const file = validateFile(files[i])
      if (file.status === true) {
        setSelectedFiles((prevArray) => [...prevArray, files[i]])
      } else {
        files[i]['invalid'] = true
        setErrorMessage(file.message)
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

  const submitAndClose = () => {
    handleFile(validFiles)
    handleModem()
  }

  const btnOnClick = (e) => {
    e.preventDefault()
    inputRef.current.click()
  }

  const deleteFile = (file: File) => {
    setValidFiles(filter(validFiles, (validFile) => validFile !== file))
    setDeletedFiles((prev) => [...prev, file])
  }

  const renderFiles = () =>
    map(validFiles, (file) => (
      <Box>
        <DocumentListItem file={file as File} closeAction={deleteFile} />
      </Box>
    ))
  return (
    <Modal
      open={true}
      onClose={() => handleModem()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={{ ...classes.modalCard, width: { xs: '95%', sm: 628 } }}>
        {validFiles.length > 0 ? (
          <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
            <Box display='flex' flexDirection='column'>
              <Paragraph size='medium' fontWeight='700'>
                Uploaded
              </Paragraph>
              {renderFiles()}
            </Box>
          </Box>
        ) : (
          <Box display={'flex'} flexDirection={'row'} justifyContent={'end'} minHeight='39px'>
            <Button sx={classes.close} onClick={() => handleModem()}>
              <svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <rect width='32' height='32' rx='4' fill='#0E0E0E' />
                <path
                  d='M21 12.0071L19.9929 11L16 14.9929L12.0071 11L11 12.0071L14.9929 16L11 19.9929L12.0071 21L16 17.0071L19.9929 21L21 19.9929L17.0071 16L21 12.0071Z'
                  fill='white'
                />
              </svg>
            </Button>
          </Box>
        )}
        <Box
          display='flex'
          flexDirection='column'
          alignItems={'center'}
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDragLeave={dragLeave}
          onDrop={fileDrop}
        >
          <SystemUpdateAltRoundedIcon sx={{ transform: 'rotate(-180deg)', fontSize: '35px' }} />
          <Paragraph size='medium' fontWeight='700' sx={classes.dragAndDropText}>
            Drag &amp; Drop to Upload
          </Paragraph>
          <Paragraph size='medium' color={SYSTEM_06} sx={{ marginY: 1, marginBottom: 0 }}>
            Or
          </Paragraph>
          <Button sx={classes.uploadButton} variant='contained' onClick={btnOnClick}>
            <label>
              <input
                ref={inputRef}
                type='file'
                style={classes.input}
                onChange={filesSelected}
                multiple
                accept='application/pdf, image/png, image/jpeg'
                value={''}
                onClick={(event) => event.stopPropagation()}
              />
              Browse Files
            </label>
          </Button>
          <Paragraph size='medium' fontWeight='700' color={RED}>
            {validFiles.length === 0 && errorMessage}
          </Paragraph>
        </Box>
        <Box
          sx={{ justifyContent: 'space-between', maxWidth: '350px', marginX: 'auto', minHeight: '64.5px' }}
          display='flex'
          flexDirection={'row'}
        >
          {validFiles.length > 0 && (
            <>
              <Button sx={classes.cancelButton} variant='contained' onClick={() => handleModem()}>
                Cancel
              </Button>
              <Button sx={classes.finishButton} variant='contained' onClick={() => submitAndClose()}>
                Finish
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Modal>
  )
}
