import React, { useState, useEffect } from 'react'
import { Box, Button, FormGroup, Typography, Stack, Dialog, DialogTitle, DialogActions } from '@mui/material'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { ImageCropper } from '../../../../../components/ImageCropper'
import SystemUpdateAltOutlinedIcon from '@mui/icons-material/SystemUpdateAltOutlined'
import { StateLogoProps } from './StateLogoTypes'
import { useStyles } from '../../styles'

export default function StateLogo({
  stateLogo,
  setStateLogo,
  stateLogoFile,
  setStateLogoFile,
  setIsChanged,
}: StateLogoProps) {
  const classes = useStyles
  const [open, setOpen] = useState<boolean>(false)
  const [imageToCrop, setImageToCrop] = useState(undefined)
  const [croppedImage, setCroppedImage] = useState(undefined)
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = () => {
    setOpen(false)
    setStateLogoFile({
      name: croppedImage.name,
      image: URL.createObjectURL(croppedImage),
      file: croppedImage,
    })
    setIsChanged(true)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        const image = reader.result

        setImageToCrop(image)
        handleClickOpen()
      });

      reader.readAsDataURL(e.target.files[0]);
    }
  }

  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ my: 2 }}>
      <Subtitle size={16} fontWeight='600' textAlign='left' sx={{ minWidth: 150 }}>
        State Logo
      </Subtitle>
      <Typography>|</Typography>
      <Box>
        <input
          style={{ display: 'none' }}
          id='uploadStateLogoImageId'
          type='file'
          accept='image/png, image/jpeg'
          onChange={(e) => handleFileInput(e)}
        />
        <label
          style={{ display: 'flex', justifyContent: 'space-around', minWidth: 200 }}
          htmlFor='uploadStateLogoImageId'
        >
          {!(stateLogoFile || stateLogo) && (
            <Stack sx={{ cursor: 'pointer' }} direction='column' justifyContent={'center'} alignItems='center'>
              <SystemUpdateAltOutlinedIcon sx={{ transform: 'rotate(180deg)' }} fontSize='large' />
              <Subtitle size={12} fontWeight='500'>
                Upload Photo
              </Subtitle>
            </Stack>
          )}
          {(stateLogoFile || stateLogo) && (
            <Box>
              <img src={stateLogoFile ? stateLogoFile.image : stateLogo} width={150} style={{ cursor: 'pointer' }} />
            </Box>
          )}
        </label>
        <Dialog
          open={open}
          onClose={handleClose}
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
          <DialogTitle
            sx={{
              fontWeight: 'bold',
              marginTop: '10px',
              textAlign: 'left'
            }}
          >
            {'Image Cropper'}
          </DialogTitle>
          <Box sx={{ width: '500px', height: 'auto' }}>
            <ImageCropper imageToCrop={imageToCrop} onImageCropped={(croppedImage) => setCroppedImage(croppedImage)}/>
          </Box>
          <DialogActions
            sx={{
              justifyContent: 'center',
              marginBottom: 2,
            }}
          >
            <Button variant='contained' sx={classes.cancelButton} onClick={handleClose} >
              Cancel
            </Button>
            <Button variant='contained' sx={classes.submitButton} onClick={handleSave} >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Stack>
  )
}
