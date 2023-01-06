import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import { useFormContext } from 'react-hook-form'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { getSignatureFile } from '../../services'
import { EnrollmentPacketFormType } from '../types'

export const SignatureComp: React.FC = () => {
  const { watch } = useFormContext<EnrollmentPacketFormType>()
  const signature_file_id = watch('signature_file_id')

  const [signedUrl, setSignedUrl] = useState('')
  const { data } = useQuery(getSignatureFile, {
    variables: {
      fileId: signature_file_id,
    },
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
    if (data?.signatureFile?.signedUrl) {
      setSignedUrl(data.signatureFile.signedUrl)
    }
  }, [data?.signatureFile?.signedUrl])

  return (
    <Grid container sx={{ display: 'flex', justifyContent: 'center', marginTop: '150px' }}>
      <Grid item md={9} sm={9} xs={9} sx={{ textAlign: 'center' }}>
        {signedUrl && <img src={signedUrl} alt='signature' style={{ width: '50%' }} />}
      </Grid>
      <Grid item md={9} sm={9} xs={9}>
        <hr style={{ borderTop: `solid 1px ${MthColor.SYSTEM_01}`, borderBottom: '0' }} />
      </Grid>
      <Grid item md={12} sm={12} xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box display='flex' flexDirection='column'>
          <Subtitle size='small' fontWeight='500'>
            Signature
          </Subtitle>
        </Box>
      </Grid>
    </Grid>
  )
}
