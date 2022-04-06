import React, { useState, useEffect } from 'react'
import { Box, TextField, Typography, Stack } from '@mui/material'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import SystemUpdateAltOutlinedIcon from '@mui/icons-material/SystemUpdateAltOutlined'
import { StateLogoFileType, StateLogoProps } from './StateLogoTypes'

export default function StateLogo({
  stateLogo,
  setStateLogo,
  stateLogoFile,
  setStateLogoFile,
  setIsChanged,
}: StateLogoProps) {
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files[0]) {
      const file = e.target.files[0]
      setStateLogoFile({
        name: file.name,
        image: URL.createObjectURL(file),
        file: file,
      })
      setIsChanged(true)
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
          style={{ display: 'flex', justifyContent: 'space-around', minWidth: 500 }}
          htmlFor='uploadStateLogoImageId'
        >
          <Stack sx={{ cursor: 'pointer' }} direction='column' justifyContent={'center'} alignItems='center'>
            <SystemUpdateAltOutlinedIcon sx={{ transform: 'rotate(180deg)' }} fontSize='large' />
            <Subtitle size={12} fontWeight='500'>
              Upload Photo
            </Subtitle>
          </Stack>
          <Box>
            <img
              src={stateLogoFile ? stateLogoFile.image : stateLogo}
              width={150}
              style={{ borderTopRightRadius: 10, borderTopLeftRadius: 10, cursor: 'pointer' }}
            />
          </Box>
        </label>
      </Box>
    </Stack>
  )
}
