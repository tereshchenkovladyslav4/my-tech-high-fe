import React, { FunctionComponent } from 'react'
import { Box, Avatar, Button } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { UserInfo } from '@mth/providers/UserContext/UserProvider'
import { Person } from '../../screens/HomeroomStudentProfile/Student/types'
import { DASHBOARD } from '../../utils/constants'
import { Paragraph } from '../Typography/Paragraph/Paragraph'

type MasqueradeFooterProps = {
  me: UserInfo
}
export const MasqueradeFooter: FunctionComponent<MasqueradeFooterProps> = ({ me }) => {
  const getProfilePhoto = (person: Person) => {
    if (!person?.photo) return 'image'

    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + person?.photo
  }

  const history = useHistory()

  return (
    <Box
      sx={{
        background: 'rgba(236, 89, 37, 0.7)',
        width: '100%',
        height: '100px',
        bottom: 0,
        zIndex: 999999,
        position: 'sticky',
        display: 'flex',
        justifyContent: 'space-between',
        paddingX: 10,
        alignContent: 'center',
        paddingY: 2,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Avatar
          alt={me.first_name}
          variant='rounded'
          src={getProfilePhoto(me.profile as Person)}
          sx={{ marginRight: 2, height: 45, width: 45 }}
        />
        <Paragraph size='large' color='white' fontWeight='700'>
          You are currently acting as {me.first_name}
        </Paragraph>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Button
          variant='contained'
          onClick={() => {
            localStorage.removeItem('masquerade')
            const prevPage = localStorage.getItem('previousPage')
            history.push(prevPage || DASHBOARD)
            location.reload()
          }}
          sx={{
            background: 'rgba(231, 231, 231, 1)',
            color: 'black',
            borderRadius: '33.33440017700195px',
            '&:hover': {
              background: '#000',
              color: '#fff',
            },
            paddingY: 1,
            paddingX: 4,
          }}
        >
          Stop Acting as User
        </Button>
      </Box>
    </Box>
  )
}
