import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import { Box, ButtonBase, Grid, Stack, Typography } from '@mui/material'
import { ResourceCard } from '../ResourceCard'
import { requestResourcesMutation } from '../services'
import { ResourceRequestProps, ResourcePage, EventType, Resource } from '../types'
import ResourceConfirm from './ResourceConfirm'

const ResourceRequest: React.FC<ResourceRequestProps> = ({
  currentStudentId,
  resourcesInCart,
  handleChangeResourceStatus,
  setPage,
  refetch,
  goToDetails,
}) => {
  const [totalPrice, setTotalPrice] = useState<number>(0)

  const [requestResources, {}] = useMutation(requestResourcesMutation)

  const removeInCart = (resource: Resource) => {
    const index = resourcesInCart.findIndex((item) => item.resource_id === resource.resource_id)
    if (index > -1) {
      handleChangeResourceStatus(resource, EventType.ADD_CART)
    }
    if (!resourcesInCart.length) {
      setPage(ResourcePage.ROOT)
    }
  }

  const handleConfirm = async () => {
    const resourceIds: number[] = resourcesInCart.reduce((acc, current) => {
      return acc.concat([Number(current.resource_id)])
    }, [] as number[])
    const result = await requestResources({
      variables: {
        requestResourcesInput: {
          student_id: currentStudentId,
          resourceIds: resourceIds,
        },
      },
    })
    refetch()
    if (result) setPage(ResourcePage.ROOT)
  }

  useEffect(() => {
    if (!resourcesInCart.length) {
      setPage(ResourcePage.ROOT)
    }
    const totalPrice = resourcesInCart.reduce((acc, current) => {
      return acc + (current.price || 0)
    }, 0)
    setTotalPrice(totalPrice)
  }, [resourcesInCart])

  return (
    <Stack sx={{ p: 4 }}>
      <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
        <Grid container sx={{ px: 5, background: 'inherit' }}>
          <ButtonBase onClick={() => setPage(ResourcePage.ROOT)} disableRipple>
            <Grid container justifyContent='flex-start' alignItems='center'>
              <Stack sx={{ p: '4px' }}>
                <ArrowBackIosOutlinedIcon />
              </Stack>
              <Typography sx={{ fontWeight: 700, fontSize: 20, ml: '20px' }}>New Request</Typography>
            </Grid>
          </ButtonBase>
        </Grid>
      </Box>

      <Grid container spacing={4} sx={{ pt: 4 }}>
        {resourcesInCart.map((item, idx) => (
          <Grid key={idx} item xs={4}>
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
                  case EventType.DETAILS: {
                    goToDetails(item)
                    break
                  }
                }
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ marginTop: 4 }}>
        <ResourceConfirm
          totalPrice={totalPrice}
          onConfirm={() => {
            handleConfirm()
          }}
          onCancel={() => {
            setPage(ResourcePage.ROOT)
          }}
        />
      </Box>
    </Stack>
  )
}

export default ResourceRequest
