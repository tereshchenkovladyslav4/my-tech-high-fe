import React, { useEffect, useState, useRef, ChangeEvent, DragEvent, MouseEvent } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'
import { Box, Button, Modal } from '@mui/material'
import { filter, map } from 'lodash'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { MthColor } from '@mth/enums'
import { mthButtonClasses } from '@mth/styles/button.style'
import { DocumentListItem } from './DocumentListItem'
import { documentUploadModalClasses } from './styles'
import { SubmissionModal } from './types'

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
  const inputRef = useRef<HTMLInputElement>(null)

  const dragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }
  const dragEnter = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
  }
  const dragLeave = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
  }
  const fileDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    const files = e?.dataTransfer?.files
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
  const filesSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    handleFiles(files)
    // Have to release file input element
    e.target.value = ''
  }
  const handleFiles = (files: File[] | FileList | undefined | null) => {
    if (!files?.length) return
    if (limit && files.length + validFiles.length > limit) {
      setErrorMessage(`File submission limited to ${limit} files`)
      return
    }
    let newFiles: File[] = []
    for (let i = 0; i < files.length; i++) {
      const file = validateFile(files[i])
      if (file.status) {
        newFiles = newFiles.concat(files[i])
      } else {
        setErrorMessage(file.message || '')
      }
    }
    handleNewFiles(newFiles)
  }
  const validateFile = (file: File): ValidateFileResponse => {
    // Get the size of the file by files.item(i).size.
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/gif', 'image/bmp']
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
  const btnOnClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    inputRef.current?.click()
  }
  const renderFiles = () =>
    map(validFiles, (file, idx) => (
      <Box key={idx}>
        <DocumentListItem file={file as File} closeAction={() => deleteFile(file)} />
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
      <Box sx={{ ...documentUploadModalClasses.modalCard, width: { xs: '95%', sm: 628 } }}>
        {validFiles.length == 0 && (
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
            <SystemUpdateAltRoundedIcon sx={{ transform: 'rotate(-180deg)', fontSize: '35px' }} />
            <Paragraph size='medium' fontWeight='700' sx={documentUploadModalClasses.dragAndDropText}>
              Drag &amp; Drop to Upload
            </Paragraph>
            <Paragraph size='medium' color={MthColor.SYSTEM_06} sx={{ marginBottom: 2 }}>
              Or
            </Paragraph>
            <Button sx={{ ...mthButtonClasses.roundSmallBlack, width: '152px' }} onClick={btnOnClick}>
              <label style={{ cursor: 'pointer' }}>
                <input
                  ref={inputRef}
                  type='file'
                  style={documentUploadModalClasses.input}
                  onChange={filesSelected}
                  multiple
                  accept='application/pdf, image/png, image/jpeg'
                  onClick={(event) => event.stopPropagation()}
                />
                Browse Files
              </label>
            </Button>
            <Paragraph size='medium' fontWeight='700' color={MthColor.RED}>
              {errorMessage}
            </Paragraph>
          </Box>
        )}
        <Box
          sx={{ justifyContent: 'space-around', maxWidth: '400px', marginX: 'auto', mt: 4, minHeight: '36px' }}
          display='flex'
          flexDirection={'row'}
        >
          {validFiles.length > 0 && (
            <>
              <Button
                sx={{
                  ...mthButtonClasses.roundSmallGray,
                  width: { xs: '135px', sm: '152px' },
                  marginRight: { xs: '15px', sm: '0px' },
                }}
                onClick={() => handleModem()}
              >
                Cancel
              </Button>
              <Button
                sx={{
                  ...(secondaryModal ? mthButtonClasses.roundSmallBlack : mthButtonClasses.roundSmallPrimary),
                  width: { xs: '135px', sm: '152px' },
                }}
                onClick={() => submitAndClose()}
              >
                Finish
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Modal>
  )
}
