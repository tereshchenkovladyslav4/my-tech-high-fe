import React, { useEffect } from 'react'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import { Box, ButtonBase, Grid, Stack, Typography } from '@mui/material'
import { ResourceCard } from '../ResourceCard'
import { ResourceRequestProps, ResourcePage, EventType, Resource } from '../types'

const ResourceRequest: React.FC<ResourceRequestProps> = ({ resourcesInCart, handleChangeResourceStatus, setPage }) => {
  const removeInCart = (resource: Resource) => {
    const index = resourcesInCart.findIndex((item) => item.resource_id === resource.resource_id)
    if (index > -1) {
      handleChangeResourceStatus(resource, EventType.ADD_CART)
    }
    if (!resourcesInCart.length) {
      setPage(ResourcePage.ROOT)
    }
  }

  useEffect(() => {
    if (!resourcesInCart.length) {
      setPage(ResourcePage.ROOT)
    }
  }, [resourcesInCart])

  return (
    <Stack>
      <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between' paddingX={4}>
        <Grid container sx={{ p: 2, background: 'inherit' }}>
          <ButtonBase onClick={() => setPage(ResourcePage.ROOT)} sx={{ p: 1 }} disableRipple>
            <Grid container justifyContent='flex-start' alignItems='center'>
              <ArrowBackIosOutlinedIcon />
              <Typography sx={{ fontWeight: 700, fontSize: 20, ml: 1 }}>New Request</Typography>
            </Grid>
          </ButtonBase>
        </Grid>
      </Box>

      <Grid container px={4} spacing={1}>
        {resourcesInCart.map((item, idx) => (
          <Grid key={idx} item xs={4} paddingTop={4}>
            <ResourceCard
              page={ResourcePage.REQUEST}
              item={item}
              onAction={(evtType: EventType) => {
                switch (evtType) {
                  case EventType.CLICK: {
                    if (item.website) window.open(item.website, '_blank')
                    break
                  }
                  case EventType.ADD_CART: {
                    removeInCart(item)
                    break
                  }
                }
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}

export default ResourceRequest
