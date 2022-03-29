
import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { useFormikContext } from 'formik'
import { EnrollmentPacketFormType } from '../types'
import { useQuery } from '@apollo/client'
import { getSignatureFile } from '../../services'
import { SYSTEM_01 } from '../../../../../utils/constants'


export default function SignatureComp() {
    const { values: { signature_file_id } } = useFormikContext<EnrollmentPacketFormType>()
    const [signedUrl, setSignedUrl] = useState('')
    const { loading, data } = useQuery(getSignatureFile, {
        variables: {
            fileId: signature_file_id,
        },
        fetchPolicy: 'network-only',
    })
    useEffect(() => {
        if (data?.signatureFile) {
            setSignedUrl(data.signatureFile.signedUrl)
        }
    }, [loading, data])

    return (
        <Grid container sx={{ display: 'flex', justifyContent: 'center', marginTop: '150px' }}>
            <Grid item md={9} sm={9} xs={9} sx={{ textAlign: 'center' }}>
                {signedUrl && <img src={signedUrl} alt='signature' style={{ width: '100%' }} />}
            </Grid>
            <Grid item md={9} sm={9} xs={9}>
                <hr style={{ borderTop: `solid 1px ${SYSTEM_01}`, borderBottom: '0' }} />
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
