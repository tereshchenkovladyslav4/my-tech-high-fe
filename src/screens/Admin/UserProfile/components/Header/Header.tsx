import { Avatar, Button } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { Metadata } from '../../../../../components/Metadata/Metadata'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { MTHBLUE } from '../../../../../utils/constants'
import AddIcon from '@mui/icons-material/Add'

export const Header = ({
  userData,
  setOpenObserverModal,
  observers,
  handleChangeParent,
  selectedParent,
  parentId,
  isParent,
}) => {
  const handleOpenObserverModal = () => {
    setOpenObserverModal(true)
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
              <Subtitle fontWeight='700' color={isParent && selectedParent === parentId ? '#4145FF' : '#cccccc'}>
                {userData.first_name} {userData.last_name}
              </Subtitle>
            )
          }
          subtitle={
            <Paragraph color='#cccccc' size={'large'}>
              Parent
            </Paragraph>
          }
          image={<Avatar alt='Remy Sharp' variant='rounded' style={{ marginRight: 8 }} />}
        />
      </Box>
      {observers.map((item) => (
        <Box
          sx={{
            marginLeft: '12px',
            cursor: 'pointer',
          }}
          onClick={() => handleChangeParent(item)}
        >
          <Metadata
            title={
              <Subtitle fontWeight='700' color={selectedParent === item.observer_id ? '#4145FF' : '#cccccc'}>
                {item.person.first_name} {item.person.last_name}
              </Subtitle>
            }
            subtitle={
              <Paragraph color='#cccccc' size={'large'}>
                Observer
              </Paragraph>
            }
            image={<Avatar alt='Remy Sharp' variant='rounded' style={{ marginRight: 8 }} />}
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
