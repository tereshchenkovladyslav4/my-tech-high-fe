import React, { FunctionComponent } from 'react'
import { useMutation } from '@apollo/client'
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined'
import AddIcon from '@mui/icons-material/Add'
import { Avatar, Button, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import { useHistory } from 'react-router-dom'
import { UserInfo } from '@mth/providers/UserContext/UserProvider'
import { Metadata } from '../../../../../components/Metadata/Metadata'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { becomeUserMutation } from '../../../../../graphql/mutation/user'
import { DASHBOARD } from '../../../../../utils/constants'

type HeaderProps = {
  userData: unknown
  setOpenObserverModal: () => void
  observers: unknown
  handleChangeParent: () => void
  selectedParent: unknown
  parentId: number
  me: UserInfo
}
export const Header: FunctionComponent<HeaderProps> = ({
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
        history.push(DASHBOARD)
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
              <Subtitle fontWeight='700' color={selectedParent === parseInt(parentId) ? '#4145FF' : '#cccccc'}>
                {userData.first_name} {userData.last_name}
              </Subtitle>
            )
          }
          subtitle={
            <Box display={'flex'} flexDirection='row' alignItems={'center'} alignContent='center'>
              <Paragraph color='#cccccc' size={'large'}>
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
              <Subtitle fontWeight='700' color={selectedParent === parseInt(item.observer_id) ? '#4145FF' : '#cccccc'}>
                {item.person.first_name} {item.person.last_name}
              </Subtitle>
            }
            subtitle={
              <Box display={'flex'} flexDirection='row' alignItems={'center'} alignContent='center'>
                <Paragraph color='#cccccc' size={'large'}>
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
