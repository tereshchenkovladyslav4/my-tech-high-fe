import React from 'react'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'

export type FormErrorProps = {
  error: string | boolean | undefined
}

export const FormError: React.FC<FormErrorProps> = ({ error }) => {
  return (
    <>
      {!!error && (
        <Subtitle
          sx={{
            color: MthColor.RED,
            fontSize: '12px',
            fontWeight: 600,
            lineHeight: '20px',
            marginLeft: '12px',
            marginTop: '4px',
            textAlign: 'left',
          }}
        >
          {error}
        </Subtitle>
      )}
    </>
  )
}
