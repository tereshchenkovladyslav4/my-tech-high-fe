import React from 'react'
import { useMutation } from '@apollo/client'
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined'
import AddIcon from '@mui/icons-material/Add'
import { Avatar, Button, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import { useHistory } from 'react-router-dom'
import { Metadata } from '@mth/components/Metadata/Metadata'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, MthRoute } from '@mth/enums'
import { becomeUserMutation } from '@mth/graphql/mutation/user'
import { UserInfo } from '@mth/providers/UserContext/UserProvider'

type HeaderProps = {
  userData: unknown
  setOpenObserverModal: () => void
  observers: unknown
  handleChangeParent: () => void
  selectedParent: unknown
  parentId: number
  me: UserInfo
}
export const Header: React.FC<HeaderProps> = ({
  userData,
  setOpenObserverModal,
  observers,
  handleChangeParent,
  selectedParent,
  parentId,
  me,
}) => {
  const handleOpenObserverModal = () => {
    setOpenObserverModal(true)
    // if (selectedParentType == "parent") {
    // }
  }

  const history = useHistory()
  const [becomeUserAction] = useMutation(becomeUserMutation)

  const becomeUser = (id) => {
    becomeUserAction({
      variables: {
        userId: Number(id),
      },
    })
      .then((resp) => {
        localStorage.setItem('masquerade', resp.data.masqueradeUser.jwt)
        localStorage.setItem('previousPage', location.href.replace(import.meta.env.SNOWPACK_PUBLIC_WEB_URL, ''))
      })
      .then(() => {
        history.push(MthRoute.DASHBOARD.toString())
        location.reload()
      })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Box sx={{ cursor: 'pointer' }} onClick={() => handleChangeParent(userData)}>
        <Metadata
          title={
            userData && (
              <Subtitle
                fontWeight='800'
                color={selectedParent === parseInt(parentId) ? MthColor.MTHBLUE : MthColor.SYSTEM_01}
                size='medium'
              >
                {userData.first_name} {userData.last_name}
              </Subtitle>
            )
          }
          subtitle={
            <Box display={'flex'} flexDirection='row' alignItems={'center'} alignContent='center'>
              <Paragraph fontWeight='600' color={MthColor.SYSTEM_11} sx={{ fontSize: '16px' }}>
                Parent
              </Paragraph>
              {selectedParent === parseInt(parentId) && Boolean(me.masquerade) && (
                <Tooltip title='Masquerade' onClick={() => becomeUser(userData.user.user_id)}>
                  <AccountBoxOutlinedIcon
                    sx={{ color: '#4145FF', marginLeft: 1, height: 15, width: 15, marginTop: 0.25 }}
                  />
                </Tooltip>
              )}
            </Box>
          }
          image={
            <Avatar
              alt={userData && (userData.preferred_first_name ?? userData.first_name)}
              src='image'
              variant='rounded'
              style={{ marginRight: 8 }}
            />
          }
        />
      </Box>
      {observers.map((item, idx) => (
        <Box
          sx={{
            marginLeft: '12px',
            cursor: 'pointer',
          }}
          key={idx}
          onClick={() => handleChangeParent(item)}
        >
          <Metadata
            title={
              <Subtitle
                fontWeight='800'
                color={selectedParent === parseInt(item.observer_id) ? MthColor.MTHBLUE : MthColor.SYSTEM_01}
                size='medium'
              >
                {item.person.first_name} {item.person.last_name}
              </Subtitle>
            }
            subtitle={
              <Box display={'flex'} flexDirection='row' alignItems={'center'} alignContent='center'>
                <Paragraph fontWeight='600' color={MthColor.SYSTEM_11} sx={{ fontSize: '16px' }}>
                  Observer
                </Paragraph>
                {selectedParent === parseInt(parentId) && Boolean(me.masquerade) && (
                  <Tooltip title='Masquerade' onClick={() => becomeUser(userData.user.user_id)}>
                    <AccountBoxOutlinedIcon
                      sx={{ color: '#4145FF', marginLeft: 1, height: 15, width: 15, marginTop: 0.25 }}
                    />
                  </Tooltip>
                )}
              </Box>
            }
            image={
              <Avatar
                alt={item.person.preferred_first_name ?? item.person.first_name}
                src='image'
                variant='rounded'
                style={{ marginRight: 8 }}
              />
            }
          />
        </Box>
      ))}

      <Button
        onClick={handleOpenObserverModal}
        disableElevation
        variant='contained'
        sx={{
          marginLeft: '12px',
          background: '#FAFAFA',
          color: 'black',
          textTransform: 'none',
          fontSize: '16px',
          '&:hover': {
            background: '#F5F5F5',
            color: '#000',
          },
        }}
        startIcon={<AddIcon />}
      >
        Add Observer
      </Button>
    </Box>
  )
}
