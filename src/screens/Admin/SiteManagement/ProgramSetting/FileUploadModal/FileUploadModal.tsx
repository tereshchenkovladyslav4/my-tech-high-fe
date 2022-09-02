import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Modal } from '@mui/material'
import { filter, has, includes, map, pull } from 'lodash'
import UploadFileIcon from '@mth/assets/icons/file-upload.svg'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { SNOWPACK_PUBLIC_COUNTIES_TEMPLATE, SNOWPACK_PUBLIC_SCHOOL_DISTRICT_TEMPLATE } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { S3FileType } from '@mth/screens/Enrollment/Documents/components/DocumentUploadModal/types'
import { FileListItem } from './FileListItem'
import { fileUploadModalClassess } from './styles'
import { SubmissionModal } from './types'

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget & File
}

export const FileUploadModal: React.FC<SubmissionModal> = ({
  handleModem,
  handleFile,
  multi,
  extensions,
  limit,
  invalidMessage,
  type,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [validFiles, setValidFiles] = useState<File[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [deletedFiles, setDeletedFiles] = useState<File[]>([])
  const template = type === 'county' ? SNOWPACK_PUBLIC_COUNTIES_TEMPLATE : SNOWPACK_PUBLIC_SCHOOL_DISTRICT_TEMPLATE

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
    const files = e?.dataTransfer?.files
    addDeletedFiles(files)
    if (limit && files.length > limit) {
      setErrorMessage(`File submission limited to ${limit} files`)
    } else {
      handleFiles(files)
    }
  }

  const filesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('')
    const files = e.target.files as unknown as File[]
    addDeletedFiles(files)
    handleFiles(files as unknown as File[])
  }

  const readFile = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onloadend = (event) => {
        const parsedFile = csvToArray(event?.target?.result)
        let isValid
        if (type === 'county') {
          isValid = map(parsedFile, (currFile) => has(currFile, 'County Name\r'))
        } else {
          isValid = map(
            parsedFile,
            (currFile) => has(currFile, 'School District Code\r') && has(currFile, 'School District Name'),
          )
        }
        if (!isValid.includes(false)) {
          resolve({})
        } else {
          setErrorMessage('Incorrect Format')
          reject()
        }
      }
    })
  }

  const addDeletedFiles = (files: File[]) => {
    map(files, (file) => {
      if (includes(JSON.stringify(deletedFiles), JSON.stringify(file))) {
        setDeletedFiles((prev) => {
          const newFiles = [...prev]
          pull(newFiles, deletedFiles[0])
          return newFiles
        })
      }
    })
  }

  const handleFiles = (files: File[]) => {
    for (let i = 0; i < files.length; i++) {
      // readfile then validate file file
      readFile(files[i]).then(() => {
        const file = validateFile(files[i])
        if (file.status === true) {
          setSelectedFiles((prevArray) => [...prevArray, files[i]])
        } else {
          files[i]['invalid'] = true
          setErrorMessage(file.message)
        }
      })
    }
  }

  const csvToArray = (str: string, delimiter = ',') => {
    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    const headers = str.slice(0, str.indexOf('\n')).split(delimiter)

    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf('\n') + 1).split('\n')

    // Map the rows
    // split values from each row into an array
    // use headers.reduce to create an object
    // object properties derived from headers:values
    // the object passed as an element of the array
    const arr = rows.map(function (row) {
      const values = row.split(delimiter)
      const el = headers.reduce(function (object, header, index) {
        object[header] = values[index]
        return object
      }, {})
      return el
    })

    // return the array
    return arr
  }

  const validateFile = (file: File) => {
    const validTypes = extensions?.replace(/\s/g, '').split(',')
    if (Math.round(file.size / 1024) > 25000) {
      return {
        status: false,
        message: 'This file exceeds maximum allowed size of 25 MB',
      }
    }
    if (validTypes?.indexOf(file.type) === -1) {
      return {
        status: false,
        message: invalidMessage,
      }
    }
    return { status: true }
  }

  const submitAndClose = () => {
    handleFile(validFiles)
    handleModem()
  }

  const deleteFile = (file: File | S3FileType) => {
    setValidFiles(filter(validFiles, (validFile) => validFile !== file))
    if (deletedFiles) setDeletedFiles([...deletedFiles, file])
  }

  const renderFiles = () =>
    map(validFiles, (file) => (
      <Box sx={{ padding: '15px' }}>
        <FileListItem file={file as File} deleteAction={deleteFile} hasDeleteAction={true} />
      </Box>
    ))

  useEffect(() => {
    const filteredArr = selectedFiles.reduce((acc, current) => {
      const x = acc.find((item) => item?.name && item?.name === current?.name)
      if (!x) {
        return acc.concat([current])
      } else {
        return acc
      }
    }, [])
    const filterDeletedFiles = filter(filteredArr, (file) => !deletedFiles.includes(file))
    setValidFiles([...filterDeletedFiles])
  }, [selectedFiles])

  return (
    <Modal
      open={true}
      onClose={() => handleModem()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      disableAutoFocus={true}
    >
      <Box sx={fileUploadModalClassess.modalCard}>
        {validFiles.length == 0 && (
          <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
            <CloseIcon style={fileUploadModalClassess.close} onClick={() => handleModem()} />
          </Box>
        )}
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
          display={limit && validFiles.length >= limit ? 'none' : 'flex'}
          flexDirection='column'
          alignItems={'center'}
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDragLeave={dragLeave}
          onDrop={fileDrop}
          sx={{ marginY: '40px' }}
        >
          {!(validFiles?.length > 0) && (
            <>
              <img src={UploadFileIcon} alt='Upload Icon' />
              <Paragraph size='medium' fontWeight='700' sx={fileUploadModalClassess.dragAndDropText}>
                Drag &amp; Drop to Upload
              </Paragraph>
              <Paragraph sx={{ cursor: 'pointer' }} color='blue' onClick={() => window.open(template)}>
                Download Template
              </Paragraph>
              <Paragraph size='medium' color={MthColor.SYSTEM_06}>
                {' '}
                Or
              </Paragraph>
              <Button sx={fileUploadModalClassess.uploadButton} variant='contained'>
                {multi ? (
                  <label>
                    <input
                      type='file'
                      style={fileUploadModalClassess.input}
                      onChange={filesSelected}
                      multiple
                      accept={extensions}
                      onClick={(event) => {
                        event.currentTarget.value = ''
                      }}
                    />
                    Browse Files
                  </label>
                ) : (
                  <label>
                    <input
                      type='file'
                      style={fileUploadModalClassess.input}
                      onChange={filesSelected}
                      accept={extensions}
                      onClick={(event) => {
                        event.currentTarget.value = ''
                      }}
                    />
                    Browse File
                  </label>
                )}
              </Button>
              <Paragraph size='medium' fontWeight='700' color={MthColor.RED}>
                {errorMessage}
              </Paragraph>
            </>
          )}
        </Box>
        {validFiles.length > 0 && (
          <Box justifyContent={'space-evenly'} display='flex' flexDirection={'row'}>
            <Button sx={fileUploadModalClassess.cancelButton} variant='contained' onClick={() => handleModem()}>
              Cancel
            </Button>
            <Button sx={fileUploadModalClassess.finishButton} variant='contained' onClick={() => submitAndClose()}>
              Finish
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  )
}
