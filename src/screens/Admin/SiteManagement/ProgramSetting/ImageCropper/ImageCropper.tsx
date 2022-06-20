import React, { useState, useEffect } from 'react'
import Cropper from 'react-cropper'
import { Box, Button, Stack, Dialog, DialogTitle, DialogActions } from '@mui/material'
import 'cropperjs/dist/cropper.css'

export type StateLogoFileType = {
  name: string
  image: string
  file: File | undefined
}

export type ImageCropperProps = {
  imageToCrop: any
  classes: any
  setStateLogoFile: (value: StateLogoFileType) => void
  setIsChanged: (value: boolean) => void
}

export default function ImageCropper({ imageToCrop, classes, setStateLogoFile, setIsChanged }: ImageCropperProps) {
  const [cropper, setCropper] = useState<any>()
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    setOpen(true)
  }, [imageToCrop])

  const blobToFile = (theBlob: Blob, fileName: string = 'CroppedImage'): File => {
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
        setIsChanged(true)
      }, 'image/png')
    }
  }

  return (
    <>
      {imageToCrop && (
        <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={'xl'} sx={classes.imageCropper}>
          <DialogTitle sx={classes.imageCropperDialogTitle}>{'Image Cropper'}</DialogTitle>
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
          <DialogActions sx={classes.dialogAction}>
            <Button variant='contained' sx={classes.cancelButton} onClick={handleClose}>
              Cancel
            </Button>
            <Button variant='contained' sx={classes.submitButton} onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}
