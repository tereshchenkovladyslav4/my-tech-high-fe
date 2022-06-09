import { Box, Button, Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FileUploadModalTemplateType } from './types'
import { useStyles } from './styles'
import CloseIcon from '@mui/icons-material/Close'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import {
  RED,
  SNOWPACK_PUBLIC_COUNTIES_TEMPLATE,
  SNOWPACK_PUBLIC_SCHOOL_DISTRICT_TEMPLATE,
  SYSTEM_06,
} from '../../../../../utils/constants'
import { filter, has, includes, isEqual, map, pull, remove } from 'lodash'
import { FileListItem } from './FileListItem'
import UploadFileIcon from '../../../../../assets/icons/file-upload.svg'

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget & File
}

type ValidateFileResponse = {
  status: boolean
  message?: string
}
export const FileUploadModal: FileUploadModalTemplateType = ({
  handleModem,
  handleFile,
  multi,
  extensions,
  limit,
  invalidMessage,
  type,
}) => {
  const classes = useStyles
  const [selectedFiles, setSelectedFiles] = useState([])
  const [validFiles, setValidFiles] = useState<File[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [deletedFiles, setDeletedFiles] = useState([])
  const template = type === 'county' ? SNOWPACK_PUBLIC_COUNTIES_TEMPLATE : SNOWPACK_PUBLIC_SCHOOL_DISTRICT_TEMPLATE

  useEffect(() => {
    let filteredArr = selectedFiles.reduce((acc, current) => {
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
    addDeletedFiles(files)
    if (limit && files.length > limit) {
      setErrorMessage(`File submission limited to ${limit} files`)
    } else {
      handleFiles(files)
    }
  }

  const filesSelected = (e: any) => {
    setErrorMessage('')
    const files = e.target.files as File[]
    addDeletedFiles(files)
    handleFiles(files as unknown as FileList[])
  }

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onloadend = (event) => {
        const parsedFile = csvToArray(event.target.result)
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
          reject
        }
      }
    })
  }

  const addDeletedFiles = (files) => {
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

  const handleFiles = (files: FileList[]) => {
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

  const csvToArray = (str, delimiter = ',') => {
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
    if (validTypes.indexOf(file.type) === -1) {
      console.log(extensions, file.type, 'fileType')
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

  const deleteFile = (file: File) => {
    setValidFiles(filter(validFiles, (validFile) => validFile !== file))
    setDeletedFiles((prev) => [...prev, file])
  }

  const renderFiles = () =>
    map(validFiles, (file) => (
      <Box sx={{ padding: '15px' }}>
        <FileListItem file={file as File} closeAction={deleteFile} />
      </Box>
    ))

  return (
    <Modal
      open={true}
      onClose={() => handleModem()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      disableAutoFocus={true}
    >
      <Box sx={classes.modalCard}>
        {validFiles.length == 0 && (
          <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
            <CloseIcon style={classes.close} onClick={() => handleModem()} />
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
          display={validFiles.length >= limit ? `none` : `flex`}
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
              <Paragraph size='medium' fontWeight='700' sx={classes.dragAndDropText}>
                Drag &amp; Drop to Upload
              </Paragraph>
              <Paragraph sx={{ cursor: 'pointer' }} color='blue' onClick={() => window.open(template)}>
                Download Template
              </Paragraph>
              <Paragraph size='medium' color={SYSTEM_06}>
                {' '}
                Or
              </Paragraph>
              <Button sx={classes.uploadButton} variant='contained'>
                {multi ? (
                  <label>
                    <input
                      type='file'
                      style={classes.input}
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
                      style={classes.input}
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
              <Paragraph size='medium' fontWeight='700' color={RED}>
                {errorMessage}
              </Paragraph>
            </>
          )}
        </Box>
        {validFiles.length > 0 && (
          <Box justifyContent={'space-evenly'} display='flex' flexDirection={'row'}>
            <Button sx={classes.cancelButton} variant='contained' onClick={() => handleModem()}>
              Cancel
            </Button>
            <Button sx={classes.finishButton} variant='contained' onClick={() => submitAndClose()}>
              Finish
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  )
}
