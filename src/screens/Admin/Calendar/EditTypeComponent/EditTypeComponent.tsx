import { Box, Card, Grid, IconButton } from '@mui/material'
import React, { useEffect, useState, useContext } from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { useStyles } from './styles'
import { CALENDAR } from '../../../../utils/constants'
import { useHistory } from 'react-router-dom'
import { EventType, EventTypeResponseVM } from '../types'
import { EditEventType } from './EditEventType'
import { EditEventTypeModal } from './EditEventTypeModal'
import CustomModal from '../../SiteManagement/EnrollmentSetting/components/CustomModal/CustomModals'
import { useMutation, useQuery } from '@apollo/client'
import { getEventTypesQuery, updateEventTypeMutation, updateEventTypesMutation } from './services'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { EventTypeTable } from './EventTypeTable'

const EditTypeComponent = () => {
  const classes = useStyles
  const history = useHistory()
  const { me } = useContext(UserContext)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showArchivedModal, setShowArchivedModal] = useState<boolean>(false)
  const [showUnarchivedModal, setShowUnarchivedModal] = useState<boolean>(false)
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null)
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [submitUpdate, {}] = useMutation(updateEventTypeMutation)
  const [submitUpdates, {}] = useMutation(updateEventTypesMutation)
  const { loading, data, refetch } = useQuery(getEventTypesQuery, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })
  const handleEditClick = (item: any) => {
    setSelectedEventType(item)
    setShowEditModal(true)
  }

  const handleUpdateEventType = async (eventType: EventType | null) => {
    if (eventType) {
      await submitUpdate({
        variables: {
          updateEventTypeInput: {
            RegionId: Number(me?.selectedRegionId),
            color: eventType.color,
            name: eventType.name,
            event_type_id: eventType.id,
            archived: !eventType.archived,
            priority: eventType.priority,
          },
        },
      })
      refetch()
    }
  }

  const handleUpdateEventTypes = async (eventTypes: EventType[]) => {
    if (eventTypes) {
      await submitUpdates({
        variables: {
          updateEventTypeInputs: {
            updateEventTypes: eventTypes.map((eventType, index) => ({
              RegionId: Number(me?.selectedRegionId),
              color: eventType.color,
              name: eventType.name,
              event_type_id: eventType.id,
              archived: eventType.archived,
              priority: index,
            })),
          },
        },
      })
      refetch()
    }
  }
  useEffect(() => {
    if (!loading && data?.eventTypes) {
      setEventTypes(
        data?.eventTypes.map((eventType: EventTypeResponseVM) => ({
          id: Number(eventType.event_type_id),
          name: eventType.name,
          color: eventType.color,
          priority: Number(eventType.priority),
          archived: eventType.archived,
        })),
      )
    }
  }, [data])
  return (
    <Card sx={classes.cardBody}>
      <Box sx={classes.pageTop}>
        <Box sx={classes.pageTitle}>
          <IconButton onClick={() => history.push(CALENDAR)} sx={classes.posi_rela}>
            <ArrowBackIosRoundedIcon sx={{ fontSize: '15px', stroke: 'black', strokeWidth: 2 }} />
          </IconButton>
          <Subtitle size='medium' fontWeight='700'>
            Edit Types
          </Subtitle>
        </Box>
      </Box>
      <Box sx={{ width: '100%', padding: 3 }}>
        <Grid container justifyContent='space-between'>
          <Grid item xs={6} sx={{ textAlign: 'left', marginTop: 'auto', marginBottom: 'auto' }}>
            <EventTypeTable
              eventTypes={eventTypes}
              handleEditClick={handleEditClick}
              setSelectedEventType={setSelectedEventType}
              setShowArchivedModal={setShowArchivedModal}
              setShowUnarchivedModal={setShowUnarchivedModal}
              handleUpdateEventTypes={handleUpdateEventTypes}
              setEventTypes={setEventTypes}
            />
          </Grid>
          <Grid item xs={6}>
            <Box paddingX={'50px'} paddingY={'45px'}>
              <EditEventType eventTypeCount={eventTypes.length} onCancel={() => {}} onSave={refetch} />
            </Box>
          </Grid>
        </Grid>
      </Box>
      {showEditModal && (
        <EditEventTypeModal
          eventType={selectedEventType}
          onCancel={() => setShowEditModal(false)}
          onSave={() => {
            setShowEditModal(false)
            refetch()
          }}
        />
      )}
      {showArchivedModal && (
        <CustomModal
          title='Archive'
          description='Are you sure you want to archive this Event Type?'
          cancelStr='Cancel'
          confirmStr='Archive'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowArchivedModal(false)
          }}
          onConfirm={() => {
            handleUpdateEventType(selectedEventType)
            setShowArchivedModal(false)
          }}
        />
      )}
      {showUnarchivedModal && (
        <CustomModal
          title='Unarchive'
          description='Are you sure you want to unarchive this Event Type?'
          cancelStr='Cancel'
          confirmStr='Unarchive'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowUnarchivedModal(false)
          }}
          onConfirm={() => {
            handleUpdateEventType(selectedEventType)
            setShowUnarchivedModal(false)
          }}
        />
      )}
    </Card>
  )
}

export default EditTypeComponent
