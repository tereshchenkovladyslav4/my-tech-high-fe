import React, { FunctionComponent } from 'react'
import { Backdrop, CircularProgress } from '@mui/material'
import { useRecoilState } from 'recoil'
import { loadingState } from '@mth/providers/Store/State'

export const MthLoading: FunctionComponent = () => {
  const [open] = useRecoilState(loadingState)
  return (
    <Backdrop sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 3000 }} open={open}>
      <CircularProgress color='inherit' />
    </Backdrop>
  )
}
