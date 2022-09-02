import React, { useEffect, useState } from 'react'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import MenuIcon from '@mui/icons-material/Menu'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import { Box, Button, Tooltip, Typography } from '@mui/material'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
  DraggingStyle,
  NotDraggingStyle,
  DropResult,
} from 'react-beautiful-dnd'
import { EventType, EventTypeTableProps } from '../../types'
import { eventTypeClassess } from '../styles'

const EventTypeTable: React.FC<EventTypeTableProps> = ({
  eventTypes,
  setIsChanged,
  handleEditClick,
  setSelectedEventType,
  setShowArchivedModal,
  setShowUnarchivedModal,
  handleUpdateEventTypes,
}) => {
  const [isDragDisable, setIsDragDisable] = useState<boolean>(true)
  const [dragableItems, setDragableItems] = useState<EventType[]>([])
  const archivedTypes = () =>
    dragableItems
      ?.filter((type) => type.archived)
      .map((eventType, index) => (
        <Box key={index} sx={{ ...eventTypeClassess.tableCotainer, color: '#A3A3A4' }}>
          <Typography sx={eventTypeClassess.typeName}>{eventType.name}</Typography>
          <Typography sx={eventTypeClassess.color}>{eventType.color.toLocaleUpperCase()}</Typography>
          <Box sx={eventTypeClassess.circleBox}>
            <Box sx={{ ...eventTypeClassess.circle, backgroundColor: eventType.color }}></Box>
          </Box>
          <Box sx={eventTypeClassess.action}>
            <Tooltip title='Unarchive' placement='top'>
              <CallMissedOutgoingIcon
                sx={{ ...eventTypeClassess.iconCursor, marginLeft: '50px' }}
                fontSize='medium'
                onClick={() => {
                  setSelectedEventType(eventType)
                  setShowUnarchivedModal(true)
                }}
              />
            </Tooltip>
          </Box>
        </Box>
      ))

  const reorder = (list: EventType[], startIndex: number, endIndex: number) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  const getListStyle = (isDraggingOver: boolean) => ({
    width: '100%',
    background: isDraggingOver ? 'lightgrey' : 'lightgrey',
  })

  const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    background: isDragging ? 'white' : 'white',
    // styles we need to apply on draggables
    ...draggableStyle,
  })

  const handleCancelClick = () => {
    setIsChanged(false)
    setDragableItems(eventTypes)
  }

  const handleSaveClick = () => {
    setIsChanged(false)
    handleUpdateEventTypes(dragableItems)
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const items = reorder(
      dragableItems.filter((eventType) => !eventType.archived),
      result.source.index,
      result.destination.index,
    )
    setIsChanged(true)
    setDragableItems(items.concat(dragableItems.filter((type) => type.archived)))
  }

  useEffect(() => {
    setDragableItems(eventTypes)
  }, [eventTypes])

  return (
    <Box sx={eventTypeClassess.border}>
      <Box sx={eventTypeClassess.tableCotainer}>
        <Typography sx={{ ...eventTypeClassess.typeName, fontWeight: 'bold' }}>Type Name</Typography>
        <Typography sx={{ ...eventTypeClassess.color, fontWeight: 'bold' }}>Color</Typography>
      </Box>
      <Box>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='droppable'>
            {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
              <Box {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                {dragableItems
                  .filter((eventType) => !eventType.archived)
                  .map((item, index) => (
                    <Draggable
                      key={item.id.toString()}
                      draggableId={item.id.toString()}
                      index={index}
                      isDragDisabled={isDragDisable}
                    >
                      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                        >
                          <Box key={index} sx={eventTypeClassess.tableCotainer} draggable='false'>
                            <Typography
                              sx={eventTypeClassess.typeName}
                              onMouseOver={() => {
                                setIsDragDisable(true)
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Typography
                              sx={eventTypeClassess.color}
                              onMouseOver={() => {
                                setIsDragDisable(true)
                              }}
                            >
                              {item.color.toLocaleUpperCase()}
                            </Typography>
                            <Box
                              sx={eventTypeClassess.circleBox}
                              onMouseOver={() => {
                                setIsDragDisable(true)
                              }}
                            >
                              <Box sx={{ ...eventTypeClassess.circle, backgroundColor: item.color }}></Box>
                            </Box>
                            <Box sx={eventTypeClassess.action}>
                              <Tooltip title='Edit' placement='top'>
                                <ModeEditIcon
                                  sx={eventTypeClassess.iconCursor}
                                  fontSize='medium'
                                  onClick={() => handleEditClick(item)}
                                  onMouseOver={() => {
                                    setIsDragDisable(true)
                                  }}
                                />
                              </Tooltip>
                              <Tooltip title='Archive' placement='top'>
                                <SystemUpdateAltIcon
                                  sx={eventTypeClassess.iconCursor}
                                  fontSize='medium'
                                  onClick={() => {
                                    setSelectedEventType(item)
                                    setShowArchivedModal(true)
                                  }}
                                  onMouseOver={() => {
                                    setIsDragDisable(true)
                                  }}
                                />
                              </Tooltip>
                              <Tooltip title='Move' placement='top'>
                                <MenuIcon
                                  sx={eventTypeClassess.iconCursor}
                                  onMouseOver={() => {
                                    setIsDragDisable(false)
                                  }}
                                  fontSize='medium'
                                />
                              </Tooltip>
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
      {archivedTypes()}
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', paddingY: '50px' }}>
        <Button sx={eventTypeClassess.cancelBtn} onClick={() => handleCancelClick()}>
          Cancel
        </Button>
        <Button sx={eventTypeClassess.saveBtn} onClick={() => handleSaveClick()}>
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default EventTypeTable
