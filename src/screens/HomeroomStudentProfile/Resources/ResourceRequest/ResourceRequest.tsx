import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import { Box, ButtonBase, Grid, Stack, Typography } from '@mui/material'
import { CartEventType } from '@mth/enums'
import { HomeroomResource } from '@mth/models'
import { ResourceCard } from '../ResourceCard'
import { shouldConfirmWaitlist, requestResourcesMutation } from '../services'
import { ResourceRequestProps, ResourcePage } from '../types'
import { WaitListModal } from '../WaitListModal'
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
  const [waitingRefetch, setWaitingRefetch] = useState<boolean>(false)
  const [joinWaitlistResources, setJoinWaitlistResources] = useState<HomeroomResource[]>([])

  const [requestResources, {}] = useMutation(requestResourcesMutation)

  const checkWaitList = async () => {
    const filteredResources = resourcesInCart.filter((item) => shouldConfirmWaitlist(item))
    if (filteredResources?.length) {
      setJoinWaitlistResources(filteredResources)
    } else {
      await handleConfirm()
    }
  }

  const removeInCart = (resource: HomeroomResource) => {
    const index = resourcesInCart.findIndex((item) => item.resource_id === resource.resource_id)
    if (index > -1) {
      handleChangeResourceStatus(resource, CartEventType.REMOVE_CART)
    }
    if (!resourcesInCart.length) {
      setPage(ResourcePage.ROOT)
    }
  }

  const handleConfirm = async () => {
    setJoinWaitlistResources([])
    const result = await requestResources({
      variables: {
        requestResourcesInput: {
          student_id: currentStudentId,
        },
      },
    })
    refetch()
    if (result?.data?.requestResources) {
      setPage(ResourcePage.ROOT)
    } else {
      // Failed to request. Have to check waitlist again.
      setWaitingRefetch(true)
      refetch()
    }
  }

  useEffect(() => {
    if (!resourcesInCart.length) {
      setPage(ResourcePage.ROOT)
    }
    const totalPrice = resourcesInCart.reduce((acc, current) => {
      return acc + (current.price || 0)
    }, 0)
    setTotalPrice(totalPrice)

    if (waitingRefetch) {
      setWaitingRefetch(false)
      checkWaitList()
    }
  }, [resourcesInCart])

  return (
    <Stack sx={{ p: 4 }}>
      <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between'>
        <Grid container sx={{ px: 5, background: 'inherit' }}>
          <Grid container justifyContent='flex-start' alignItems='center'>
            <ButtonBase onClick={() => setPage(ResourcePage.ROOT)} disableRipple>
              <Stack sx={{ p: '4px' }}>
                <ArrowBackIosOutlinedIcon />
              </Stack>
            </ButtonBase>
            <Typography sx={{ fontWeight: 700, fontSize: 20, ml: '20px' }}>New Request</Typography>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4} sx={{ pt: 4 }}>
        {resourcesInCart.map((item, idx) => (
          <Grid key={idx} item xs={4}>
            <ResourceCard
              page={ResourcePage.REQUEST}
              item={item}
              onAction={(evtType: CartEventType) => {
                switch (evtType) {
                  case CartEventType.CLICK: {
                    if (item.website) window.open(item.website, '_blank')
                    break
                  }
                  case CartEventType.REMOVE_CART: {
                    removeInCart(item)
                    break
                  }
                  case CartEventType.DETAILS: {
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
          onConfirm={checkWaitList}
          onCancel={() => {
            setPage(ResourcePage.ROOT)
          }}
        />
      </Box>

      {!!joinWaitlistResources?.length && (
        <WaitListModal
          joinWaitlistResources={joinWaitlistResources}
          handleChangeResourceStatus={(resource, eventType) => {
            handleChangeResourceStatus(resource, eventType)
          }}
          isAllDone={handleConfirm}
        />
      )}
    </Stack>
  )
}

export default ResourceRequest
