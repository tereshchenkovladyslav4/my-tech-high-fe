import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Grid, Stack } from '@mui/material'
import { ResourceSubtitle } from '@mth/enums'
import { ResourceCard } from './ResourceCard'
import { ResourceCartBar } from './ResourceCartBar'
import { ResourceModal } from './ResourceModal'
import { getStudentResourcesQuery, toggleHiddenResourceMutation } from './services'
import { EventType, Resource } from './types'

export const Resources: React.FC = () => {
  const currentStudentId = location.pathname.split('/').at(-1)
  const [resources, setResources] = useState<Resource[]>([])
  const [resourcesInCart, setResourcesInCart] = useState<Resource[]>([])
  const [selectedResource, setSelectedResource] = useState<Resource>()
  const [showHideModal, setShowHideModal] = useState<boolean>(false)

  const {
    loading,
    data: resourcesData,
    refetch,
  } = useQuery(getStudentResourcesQuery, {
    variables: { studentId: currentStudentId },
    skip: !currentStudentId,
    fetchPolicy: 'network-only',
  })
  const [toggleHiddenResource, {}] = useMutation(toggleHiddenResourceMutation)

  const checkCart = (resource: Resource) => {
    const index = resourcesInCart.findIndex((item) => item.resource_id === resource.resource_id)
    if (resource.inCart && index < 0) {
      resourcesInCart.splice(0, 0, resource)
      setResourcesInCart(resourcesInCart)
    }
    if (!resource.inCart && index > -1) {
      resourcesInCart.splice(index, 1)
      setResourcesInCart(resourcesInCart)
    }
  }

  const handleChangeResourceStatus = async (resource: Resource | undefined, eventType: EventType) => {
    if (resource) {
      switch (eventType) {
        case EventType.HIDE:
        case EventType.UNHIDE: {
          await toggleHiddenResource({
            variables: {
              toggleHiddenResourceInput: {
                student_id: 2839,
                resource_id: Number(resource.resource_id),
                hidden: !resource.HiddenByStudent,
              },
            },
          })
          break
        }
      }
      refetch()
    }
  }

  useEffect(() => {
    if (!loading && resourcesData) {
      const colors = ['blue', 'orange']
      const { studentResources: resources }: { studentResources: Resource[] } = resourcesData
      resources?.filter((item) => !item.image).map((item, index) => (item.background = colors[index % 2]))
      setResources(resources || [])
    }
  }, [loading, resourcesData])

  return (
    <Stack>
      {!!resourcesInCart?.length && <ResourceCartBar resourcesInCart={resourcesInCart}></ResourceCartBar>}

      <Grid container padding={4} spacing={1}>
        {resources.map((item, idx) => (
          <Grid key={idx} item xs={4} paddingTop={4}>
            <ResourceCard
              item={item}
              onAction={(evtType: EventType) => {
                setSelectedResource(item)
                switch (evtType) {
                  case EventType.CLICK: {
                    if (item.website) window.open(item.website, '_blank')
                    break
                  }
                  case EventType.ADD_CART: {
                    item.inCart = !item.inCart
                    checkCart(item)
                    break
                  }
                  case EventType.HIDE: {
                    if ((item.accepted || item.requested) && item.subtitle === ResourceSubtitle.PRICE) {
                      setShowHideModal(true)
                    } else {
                      handleChangeResourceStatus(item, EventType.HIDE)
                    }
                    break
                  }
                  case EventType.UNHIDE: {
                    handleChangeResourceStatus(item, EventType.UNHIDE)
                    break
                  }
                }
              }}
            />
          </Grid>
        ))}
      </Grid>

      <ResourceModal
        showHideModal={showHideModal}
        setShowHideModal={setShowHideModal}
        handleChangeResourceStatus={(eventType) => handleChangeResourceStatus(selectedResource, eventType)}
      />
    </Stack>
  )
}

export default Resources
