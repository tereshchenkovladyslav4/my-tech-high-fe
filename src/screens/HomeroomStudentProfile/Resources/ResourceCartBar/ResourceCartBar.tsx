import React, { useState } from 'react'
import EastIcon from '@mui/icons-material/East'
import { Box, Card, CardMedia, Stack, Typography } from '@mui/material'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { s3URL } from '@mth/constants'
import { HomeroomResource } from '@mth/models'
import { shouldConfirmWaitlist } from '../services'
import { ResourceCartBarProps, ResourcePage } from '../types'
import { WaitListModal } from '../WaitListModal'

const ResourceCartBar: React.FC<ResourceCartBarProps> = ({ resourcesInCart, handleChangeResourceStatus, setPage }) => {
  const SHOW_CART_LIMIT = 5
  const MAX_TITLE_LENGTH = 3
  const [joinWaitlistResources, setJoinWaitlistResources] = useState<HomeroomResource[]>([])

  const checkWaitList = () => {
    const filteredResources = resourcesInCart.filter((item) => shouldConfirmWaitlist(item))
    if (filteredResources?.length) {
      setJoinWaitlistResources(filteredResources)
    } else {
      setPage(ResourcePage.REQUEST)
    }
  }

  return (
    <Card
      sx={{
        padding: 4,
        marginTop: 4,
        marginX: 4,
        borderRadius: '16px',
        boxShadow: '0px 0px 48px rgba(0, 0, 0, 0.04)',
      }}
    >
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Subtitle sx={{ fontSize: '30px', fontWeight: 700 }}>New Request</Subtitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {resourcesInCart
            .slice(0, SHOW_CART_LIMIT)
            .reverse()
            .map((item, idx) => (
              <Box key={idx} sx={{ position: 'relative' }}>
                <CardMedia
                  component='img'
                  sx={{ width: 70, height: 88, borderRadius: 1 }}
                  src={item.image ? `${s3URL}${item.image}` : `../src/assets/quick-link-${item.background}.png`}
                />
                {!item.image && (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography fontSize='16px' component='div'>
                      {item.title?.slice(0, MAX_TITLE_LENGTH)}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          <Stack
            direction='row'
            spacing={1.5}
            sx={{ cursor: 'pointer' }}
            alignItems='center'
            onClick={() => checkWaitList()}
          >
            <EastIcon sx={{ fontSize: '36px' }} />
          </Stack>
        </Box>
      </Box>

      {!!joinWaitlistResources?.length && (
        <WaitListModal
          joinWaitlistResources={joinWaitlistResources}
          handleChangeResourceStatus={(resource, eventType) => {
            handleChangeResourceStatus(resource, eventType)
          }}
          isAllDone={() => {
            setPage(ResourcePage.REQUEST)
          }}
        />
      )}
    </Card>
  )
}

export default ResourceCartBar
