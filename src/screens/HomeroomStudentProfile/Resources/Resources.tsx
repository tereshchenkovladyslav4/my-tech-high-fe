import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Grid, Stack } from '@mui/material'
import { sortBy } from 'lodash'
import { ResourceSubtitle } from '@mth/enums'
import { ResourceCard } from './ResourceCard'
import { ResourceCartBar } from './ResourceCartBar'
import { ResourceDetails } from './ResourceDetails'
import { ResourceLevelSelector } from './ResourceLevelSelector'
import { ResourceModal } from './ResourceModal'
import { ResourceRequest } from './ResourceRequest'
import {
  getStudentResourcesQuery,
  shouldConfirmWaitlist,
  toggleHiddenResourceMutation,
  toggleResourceCartMutation,
} from './services'
import { EventType, Resource, ResourceLevel, ResourcePage } from './types'
import { WaitListModal } from './WaitListModal'

export const Resources: React.FC = () => {
  const currentStudentId = Number(location.pathname.split('/').at(-1))

  const [page, setPage] = useState<ResourcePage>(ResourcePage.ROOT)
  const [prePage, setPrePage] = useState<ResourcePage>(ResourcePage.ROOT)
  const [resources, setResources] = useState<Resource[]>([])
  const [resourcesInCart, setResourcesInCart] = useState<Resource[]>([])
  const [joinWaitlistResources, setJoinWaitlistResources] = useState<Resource[]>([])
  const [selectedResource, setSelectedResource] = useState<Resource>()
  const [selectedResourceLevel, setSelectedResourceLevel] = useState<ResourceLevel>()
  const [showHideModal, setShowHideModal] = useState<boolean>(false)
  const [showResourceLevelModal, setShowResourceLevelModal] = useState<boolean>(false)

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

  const handleChangeResourceStatus = async (
    resource: Resource | undefined,
    eventType: EventType,
    resourceLevelId?: number,
    waitlist_confirmed?: boolean,
  ) => {
    if (resource) {
      switch (eventType) {
        case EventType.HIDE:
        case EventType.UN_HIDE: {
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
        case EventType.ADD_CART:
        case EventType.REMOVE_CART: {
          await toggleResourceCart({
            variables: {
              toggleResourceCartInput: {
                student_id: currentStudentId,
                resource_id: Number(resource.resource_id),
                inCart: eventType == EventType.ADD_CART,
                resource_level_id: Number(resourceLevelId),
                waitlist_confirmed,
              },
            },
          })
          break
        }
      }
      await refetch()
    }
  }

  const handleCardActions = async (resource: Resource, evtType: EventType) => {
    setSelectedResource(resource)
    switch (evtType) {
      case EventType.CLICK: {
        if (resource.website) window.open(resource.website, '_blank')
        break
      }
      case EventType.ADD_CART: {
        if (resource.add_resource_level && resource.ResourceLevels?.length) {
          setShowResourceLevelModal(true)
        } else if (shouldConfirmWaitlist(resource)) {
          setJoinWaitlistResources([resource])
        } else {
          await handleChangeResourceStatus(resource, evtType)
        }
        break
      }
      case EventType.REMOVE_CART: {
        await handleChangeResourceStatus(resource, evtType)
        break
      }
      case EventType.HIDE: {
        if (resource.RequestStatus && resource.subtitle === ResourceSubtitle.PRICE) {
          setShowHideModal(true)
        } else {
          await handleChangeResourceStatus(resource, EventType.HIDE)
        }
        break
      }
      case EventType.UN_HIDE: {
        await handleChangeResourceStatus(resource, EventType.UN_HIDE)
        break
      }
      case EventType.DETAILS: {
        setPage(ResourcePage.DETAILS)
        setPrePage(ResourcePage.ROOT)
        break
      }
    }
  }

  useEffect(() => {
    if (resources?.length) {
      const items: Resource[] = sortBy(
        resources.filter((item) => item.CartDate),
        'CartDate',
      ).reverse()
      setResourcesInCart(items)
      if (selectedResource) {
        const resource = resources.find((item) => item.resource_id === selectedResource.resource_id)
        setSelectedResource(resource)
      }
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
            <ResourceCartBar
              resourcesInCart={resourcesInCart}
              handleChangeResourceStatus={(resource, eventType) =>
                handleChangeResourceStatus(resource, eventType, resource.ResourceLevelId, true)
              }
              setPage={setPage}
            />
          )}

          <Grid container padding={4} spacing={4}>
            {resources.map((item, idx) => (
              <Grid key={idx} item xs={4} paddingTop={4}>
                <ResourceCard item={item} onAction={(evtType: EventType) => handleCardActions(item, evtType)} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {page === ResourcePage.REQUEST && (
        <ResourceRequest
          currentStudentId={currentStudentId}
          resourcesInCart={resourcesInCart}
          setPage={setPage}
          handleChangeResourceStatus={(resource, eventType) =>
            handleChangeResourceStatus(resource, eventType, resource.ResourceLevelId, true)
          }
          refetch={refetch}
          goToDetails={(item: Resource) => {
            setSelectedResource(item)
            setPage(ResourcePage.DETAILS)
            setPrePage(ResourcePage.REQUEST)
          }}
        />
      )}

      {page === ResourcePage.DETAILS && selectedResource && (
        <ResourceDetails
          item={selectedResource}
          handleBack={() => setPage(prePage)}
          onCardAction={(evtType: EventType) => handleCardActions(selectedResource, evtType)}
        />
      )}

      {showResourceLevelModal && selectedResource && (
        <ResourceLevelSelector
          resource={selectedResource}
          handleCancel={() => setShowResourceLevelModal(false)}
          handleSelect={async (resourceLevelId: number) => {
            setShowResourceLevelModal(false)
            const resourceLevel = selectedResource.ResourceLevels?.find(
              (item) => item.resource_level_id == resourceLevelId,
            )
            setSelectedResourceLevel(resourceLevel)
            if (shouldConfirmWaitlist({ ...selectedResource, ResourceLevelId: resourceLevelId })) {
              setJoinWaitlistResources([selectedResource])
            } else {
              await handleChangeResourceStatus(selectedResource, EventType.ADD_CART, resourceLevelId)
            }
          }}
        />
      )}

      {!!joinWaitlistResources?.length && (
        <WaitListModal
          joinWaitlistResources={joinWaitlistResources}
          handleChangeResourceStatus={async (resource, eventType) => {
            await handleChangeResourceStatus(resource, eventType, selectedResourceLevel?.resource_level_id, true)
          }}
          isAllDone={() => {
            setJoinWaitlistResources([])
          }}
        />
      )}

      <ResourceModal
        showHideModal={showHideModal}
        setShowHideModal={setShowHideModal}
        handleChangeResourceStatus={async (eventType) => await handleChangeResourceStatus(selectedResource, eventType)}
      />
    </Stack>
  )
}

export default Resources
