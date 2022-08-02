import React, { FunctionComponent, useState } from 'react'
import SystemUpdateAltOutlinedIcon from '@mui/icons-material/SystemUpdateAltOutlined'
import { Box, Stack } from '@mui/material'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { useStyles } from '../../styles'
import { ImageCropper } from '../ImageCropper'
import { StateLogoProps } from './StateLogoTypes'

export const StateLogo: FunctionComponent<StateLogoProps> = ({
  stateLogo,
  stateLogoFile,
  setStateLogoFile,
  setIsChanged,
  isChanged,
}) => {
  const classes = useStyles
  const [open, setOpen] = useState<boolean>(false)
  const [imageToCrop, setImageToCrop] = useState(undefined)
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpen(false)
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        const image = reader.result
        setImageToCrop(image)
        handleClickOpen()
        e.target.value = ''
      })

      reader.readAsDataURL(e.target.files[0])
    }
  }

  return (
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
      {open && (
        <ImageCropper
          imageToCrop={imageToCrop}
          classes={classes}
          setStateLogoFile={setStateLogoFile}
          setIsChanged={setIsChanged}
          isChanged={isChanged}
        />
      )}
    </Box>
  )
}
