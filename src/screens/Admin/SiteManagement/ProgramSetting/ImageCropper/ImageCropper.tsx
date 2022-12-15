import React, { useState, useEffect } from 'react'
import { Box, Button, Stack, Dialog, DialogTitle, DialogActions } from '@mui/material'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { mthButtonClasses } from '@mth/styles/button.style'
import { ProgramSettingChanged } from '../types'

export type StateLogoFileType = {
  name: string
  image: string
  file: File | undefined
}

export type ImageCropperProps = {
  imageToCrop: string | ArrayBuffer | null
  setStateLogoFile: (value: StateLogoFileType) => void
  setIsChanged: (value: ProgramSettingChanged) => void
  isChanged: ProgramSettingChanged
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageToCrop,
  setStateLogoFile,
  setIsChanged,
  isChanged,
}) => {
  const [cropper, setCropper] = useState<Cropper>()
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    setOpen(true)
  }, [imageToCrop])

  const blobToFile = (theBlob: Blob): File => {
    const myFile = new File([theBlob], 'image.jpeg', {
      type: theBlob.type,
    })
    return myFile
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = () => {
    setOpen(false)
    if (typeof cropper !== 'undefined') {
      cropper.getCroppedCanvas().toBlob((blob: Blob) => {
        const croppedImageFile = blobToFile(blob)
        setStateLogoFile({
          name: croppedImageFile.name,
          image: URL.createObjectURL(croppedImageFile),
          file: croppedImageFile,
        })
        setIsChanged({
          ...isChanged,
          stateLogo: true,
        })
      }, 'image/png')
    }
  }

  return (
    <>
      {imageToCrop && (
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          maxWidth={'xl'}
          sx={{
            marginX: 'auto',
            paddingY: '10px',
            borderRadius: 10,
            textAlign: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <DialogTitle sx={{ fontWeight: 'bold', marginTop: '10px', textAlign: 'left' }}>{'Image Cropper'}</DialogTitle>
          <Box sx={{ maxWidth: '50vw', minWidth: '400px', overflow: 'hidden' }}>
            <Stack>
              <Box>
                <Cropper
                  style={{ height: 'auto', width: '100%' }}
                  zoomTo={0.5}
                  initialAspectRatio={1}
                  aspectRatio={1}
                  //preview='.img-preview'
                  src={imageToCrop}
                  viewMode={3}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false}
                  onInitialized={(instance) => {
                    setCropper(instance)
                  }}
                  guides={true}
                />
              </Box>
            </Stack>
          </Box>
          <DialogActions sx={{ justifyContent: 'center', marginBottom: 2 }}>
            <Button variant='contained' sx={mthButtonClasses.xsRed} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant='contained'
              sx={{ ...mthButtonClasses.xsPrimary, marginLeft: '32px !important' }}
              onClick={handleSave}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}
