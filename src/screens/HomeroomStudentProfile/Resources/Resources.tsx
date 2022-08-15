import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Grid, Stack } from '@mui/material'
import { sortBy } from 'lodash'
import { ResourceSubtitle } from '@mth/enums'
import { ResourceCard } from './ResourceCard'
import { ResourceCartBar } from './ResourceCartBar'
import { ResourceModal } from './ResourceModal'
import { ResourceRequest } from './ResourceRequest'
import { getStudentResourcesQuery, toggleHiddenResourceMutation, toggleResourceCartMutation } from './services'
import { EventType, Resource, ResourcePage } from './types'

export const Resources: React.FC = () => {
  const currentStudentId = Number(location.pathname.split('/').at(-1))

  const [page, setPage] = useState<ResourcePage>(ResourcePage.ROOT)
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
  const [toggleResourceCart, {}] = useMutation(toggleResourceCartMutation)

  const handleChangeResourceStatus = async (resource: Resource | undefined, eventType: EventType) => {
    if (resource) {
      switch (eventType) {
        case EventType.HIDE:
        case EventType.UNHIDE: {
          await toggleHiddenResource({
            variables: {
              toggleHiddenResourceInput: {
                student_id: currentStudentId,
                resource_id: Number(resource.resource_id),
                hidden: !resource.HiddenByStudent,
              },
            },
          })
          break
        }
        case EventType.ADD_CART: {
          await toggleResourceCart({
            variables: {
              toggleResourceCartInput: {
                student_id: currentStudentId,
                resource_id: Number(resource.resource_id),
                inCart: !resource.CartDate,
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
    if (resources?.length) {
      const items: Resource[] = sortBy(
        resources.filter((item) => item.CartDate),
        'CartDate',
      ).reverse()
      setResourcesInCart(items)
    }
  }, [resources])

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
      {page === ResourcePage.ROOT && (
        <>
          {!!resourcesInCart?.length && (
            <ResourceCartBar resourcesInCart={resourcesInCart} setPage={setPage}></ResourceCartBar>
          )}

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
                        handleChangeResourceStatus(item, EventType.ADD_CART)
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
        </>
      )}

      {page === ResourcePage.REQUEST && (
        <ResourceRequest
          resourcesInCart={resourcesInCart}
          setPage={setPage}
          handleChangeResourceStatus={handleChangeResourceStatus}
        ></ResourceRequest>
      )}

      <ResourceModal
        showHideModal={showHideModal}
        setShowHideModal={setShowHideModal}
        handleChangeResourceStatus={(eventType) => handleChangeResourceStatus(selectedResource, eventType)}
      />
    </Stack>
  )
}

export default Resources
