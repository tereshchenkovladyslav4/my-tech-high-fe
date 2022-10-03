import React, { useState } from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { Box, Button, Typography } from '@mui/material'
import { SNOWPACK_PUBLIC_S3_UPLOAD } from '@mth/constants'
import { MthModal } from '../MthModal/MthModal'
import FileItem from './FileItem'
import { useStyles } from './styles'
import { FileUploadType, FormDataItemType, RefUploaderHandle } from './types'

const MthUpload: React.ForwardRefRenderFunction<RefUploaderHandle, FileUploadType> = (props, ref) => {
  const {
    children,
    maxCount,
    multiple = false,
    limitSize = 25000,
    formData,
    onConfirm = () => {},
    accept = ['application/pdf', 'image/png', 'image/jpeg'],
  } = props
  const inputRef = React.createRef<HTMLInputElement>()
  const [open, setOpen] = useState<boolean>(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [dragging, setDragging] = React.useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleConfirm = () => {
    onConfirm()
  }

  const uploadPhoto = (additionalFormDataForce?: FormDataItemType[]): Promise<boolean | string> => {
    return new Promise(async (resolve) => {
      if (maxCount === 1 && !!uploadedFiles && uploadedFiles.length > 1) {
        const file: File = uploadedFiles[1]
        if (file) {
          const body = new FormData()
          body.append('file', file)
          const additionalFormData = additionalFormDataForce || formData
          if (additionalFormData) {
            additionalFormData.forEach((formItem: FormDataItemType) => {
              body.append(formItem.key, formItem.value)
            })
          }
          const response = await fetch(SNOWPACK_PUBLIC_S3_UPLOAD, {
            method: 'POST',
            body,
            headers: {
              Authorization: `Bearer ${localStorage.getItem('JWT')}`,
            },
          })
          const imageUrl = await response.json()
          resolve(imageUrl.data.file.item1)
        }
        resolve(true)
      }
    })
  }
  const validateFileHadError = (file: File): string => {
    if (Math.round(file.size / 1024) > limitSize)
      return `This file exceeds maximum allowed size of ${limitSize / 1000} MB`
    if (accept.indexOf(file.type) === -1) {
      // ['pdf', 'png', 'jpeg'] .jpg, .png, .jpeg, .webp
      const extensions = accept
        .map((el) => {
          if (el) {
            const extensionArr = el.split('/')
            if (extensionArr[1]) {
              if (extensionArr[1] !== '*') return extensionArr[1]
              else return extensionArr[0]
            }
            return extensionArr[0]
          } else return el
        })
        .filter((el) => !!el)
      return `Please only submit ${[...new Set(extensions)].join(', ')} for file ${file.name}`
    }
    return ''
  }

  const handleFiles = (files: FileList | null) => {
    if (files) {
      const newErrors: string[] = []
      const validFiles = [...uploadedFiles]
      for (let i = 0; i < files.length; i++) {
        const errorMessage = validateFileHadError(files[i])
        if (errorMessage) {
          newErrors.push(errorMessage)
        } else {
          if (maxCount && validFiles.length >= maxCount) {
            setErrorMessage(`File submission limited to ${maxCount} files`)
          } else validFiles.push(files[i])
        }
      }
      setErrors(newErrors)
      setUploadedFiles(validFiles)
    }
  }

  const handleDelete = (file: File) => {
    const newFiles = uploadedFiles.filter((validFile) => validFile !== file)
    setUploadedFiles(newFiles)
    if (maxCount && newFiles.length >= maxCount) {
      setErrorMessage(`File submission limited to ${maxCount} files`)
    } else setErrorMessage('')
  }

  React.useImperativeHandle(ref, () => ({
    uploadPhoto,
  }))

  const handleFileOpen = () => {
    inputRef.current?.click()
  }

  const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const dragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
  }

  const dragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
  }

  const fileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    const files = e.dataTransfer.files
    handleFiles(files)
  }

  return (
    <div>
      <div onClick={() => setOpen(true)}>{children || <div>Upload</div>}</div>
      <MthModal
        width={756}
        open={open}
        noCloseOnBackdrop
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        confirmStr='Finish'
        confirmBtnClass='btn-gradient'
        showBtnClose={uploadedFiles.length === 0}
        showBtnCancel={uploadedFiles.length > 0}
        showBtnConfirm={uploadedFiles.length > 0}
      >
        <Box sx={useStyles.upload}>
          <Box className='uploaded-list'>
            {uploadedFiles.length > 0 && (
              <>
                <Typography component={'h4'} fontWeight='700' fontSize='12px'>
                  Uploaded
                </Typography>
                {uploadedFiles.map((file: File, idx: number) => (
                  <FileItem key={idx} file={file} onDelete={(file: File) => handleDelete(file)} />
                ))}
              </>
            )}
          </Box>
          <Box className='uploader-container'>
            <Box
              className={`k-upload${dragging ? ' active' : ''}`}
              onDragOver={dragOver}
              onDragEnter={dragEnter}
              onDragLeave={dragLeave}
              onDrop={fileDrop}
            >
              <input
                ref={inputRef}
                className='box__file'
                type='file'
                name='file'
                id='file'
                accept={accept.join(', ')}
                multiple={maxCount !== 1 && multiple}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)}
              />
              <Box className='k-upload-label bg-light'>
                <UploadFileIcon />
                <Typography fontSize={12} fontWeight='700' sx={{ mt: '26px' }}>
                  Drag &amp; Drop to Upload
                </Typography>
              </Box>
            </Box>
            <Typography fontSize={12}>Or</Typography>
            <Button
              variant='contained'
              onClick={handleFileOpen}
              sx={{ px: 6, py: '13px', borderRadius: '50px', fontSize: '10px' }}
            >
              Browse Files
            </Button>
          </Box>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            {errorMessage && (
              <Typography fontSize={12} color='red'>
                {errorMessage}
              </Typography>
            )}
            {errors.map((error) => (
              <>
                {!!error && (
                  <Typography fontSize={12} color='red'>
                    {error}
                  </Typography>
                )}
              </>
            ))}
          </Box>
        </Box>
      </MthModal>
    </div>
  )
}

export default React.forwardRef(MthUpload)
