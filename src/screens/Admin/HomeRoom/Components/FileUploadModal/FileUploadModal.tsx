import React, { useEffect, useState } from 'react'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'
import { Box, Button, Modal } from '@mui/material'
import { MthColor } from '@mth/enums'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { FileUploadModalClasses } from './styles'
import { FileUploadModalProps } from './types'

type ValidateFileResponse = {
  status: boolean
  message?: string
}

const FileUploadModal: FileUploadModalProps = ({
  open,
  isDownloadTemplate = false,
  onClose,
  handleFile,
  onDownloadTemplate,
}) => {
  const classes = FileUploadModalClasses
  const [validFile, setValidFile] = useState<File>()
  const [errorMessage, setErrorMessage] = useState('')

  const inputRef = React.createRef<HTMLInputElement>()

  useEffect(() => {
    if (open) {
      setValidFile(undefined)
      setErrorMessage('')
    }
  }, [open])

  const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const dragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const dragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const fileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 1) {
      setErrorMessage('File submission limited to 1 file')
    } else {
      handleFiles(files[0])
    }
  }

  const filesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files?.[0] as File)
  }

  const handleFiles = (file: File) => {
    const validatedFile = validateFile(file)
    if (validatedFile.status) {
      setValidFile(file)
      setErrorMessage('')
    } else {
      setErrorMessage(validatedFile?.message as string)
    }
  }

  const validateFile = (file: File): ValidateFileResponse => {
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (Math.round(file.size / 1024) > 25000) {
      return {
        status: false,
        message: 'This file exceeds maximum allowed size of 25 MB',
      }
    }
    if (validTypes.indexOf(file.type) === -1) {
      return {
        status: false,
        message: 'Incorrect Format',
      }
    }
    return {
      status: true,
    }
  }

  const submitAndClose = () => {
    if (validFile && handleFile) {
      handleFile(validFile)
    }
    onClose()
  }

  const deleteFile = (file?: File) => {
    if (file) {
      setValidFile(undefined)
    }
  }

  const renderFiles = () => (
    <Box onClick={() => {}} display='flex' flexDirection='row' alignItems='flex-end' color='#7B61FF' marginTop='6px'>
      <Paragraph sx={classes.text}>{validFile?.name}</Paragraph>
      <Button sx={classes.deleteIcon} onClick={() => deleteFile(validFile)}>
        <svg width='10' height='18' viewBox='0 0 14 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M9.12 7.47L7 9.59L4.87 7.47L3.46 8.88L5.59 11L3.47 13.12L4.88 14.53L7 12.41L9.12 14.53L10.53 13.12L8.41 11L10.53 8.88L9.12 7.47ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5ZM1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM3 6H11V16H3V6Z'
            fill='#323232'
          />
        </svg>
      </Button>
    </Box>
  )

  return (
    <Modal open={open} onClose={onClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Box sx={{ ...classes.modalCard, width: { xs: '95%', sm: 628 } }}>
        {validFile ? (
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
            <Button sx={classes.close} onClick={onClose}>
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
          {!validFile && isDownloadTemplate && (
            <Button sx={{ color: MthColor.MTHBLUE }} onClick={() => onDownloadTemplate && onDownloadTemplate()}>
              Download Template
            </Button>
          )}
          <Paragraph size='medium' color={MthColor.SYSTEM_06} sx={{ marginY: 1, marginBottom: 0 }}>
            Or
          </Paragraph>
          <Button
            sx={classes.uploadButton}
            variant='contained'
            onClick={(e) => {
              e.preventDefault()
              inputRef.current?.click()
            }}
          >
            <label>
              <input
                ref={inputRef}
                type='file'
                style={classes.input}
                onChange={filesSelected}
                accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                value={''}
                onClick={(event) => event.stopPropagation()}
              />
              Browse Files
            </label>
          </Button>
          <Paragraph size='medium' fontWeight='700' color={MthColor.RED}>
            {!validFile && errorMessage}
          </Paragraph>
        </Box>

        <Box
          sx={{ justifyContent: { xs: 'center', sm: 'space-around' }, minHeight: '64.5px' }}
          display='flex'
          flexDirection={'row'}
        >
          {validFile && (
            <>
              <Button sx={classes.cancelButton} variant='contained' onClick={onClose}>
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

export default FileUploadModal
