import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import MenuIcon from '@mui/icons-material/Menu'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import { useStyles } from '../styles'
import { EventType } from '../../types'

type EventTypeTableProps = {
  eventTypes: EventType[]
  handleEditClick: (value: EventType) => void
  setSelectedEventType: (value: EventType) => void
  setShowArchivedModal: (value: boolean) => void
  setShowUnarchivedModal: (value: boolean) => void
  handleUpdateEventTypes: (value: EventType[]) => void
  setEventTypes: (value: EventType[]) => void
}

const EventTypeTable = ({
  eventTypes,
  handleEditClick,
  setSelectedEventType,
  setShowArchivedModal,
  setShowUnarchivedModal,
  handleUpdateEventTypes,
  setEventTypes,
}: EventTypeTableProps) => {
  const classes = useStyles
  const [isDragDisable, setIsDragDisable] = useState<boolean>(true)
  const archivedTypes = () =>
    eventTypes
      ?.filter((type) => type.archived)
      .map((eventType, index) => (
        <Box key={index} sx={{ ...classes.tableCotainer, color: '#A3A3A4' }}>
          <Typography sx={classes.typeName}>{eventType.name}</Typography>
          <Typography sx={classes.color}>{eventType.color.toLocaleUpperCase()}</Typography>
          <Box sx={classes.circleBox}>
            <Box sx={{ ...classes.circle, backgroundColor: eventType.color }}></Box>
          </Box>
          <Box sx={classes.action}>
            <CallMissedOutgoingIcon
              sx={classes.iconCursor}
              fontSize='medium'
              onClick={() => {
                setSelectedEventType(eventType)
                setShowUnarchivedModal(true)
              }}
            />
          </Box>
        </Box>
      ))

  const reorder = (list: EventType[], startIndex: number, endIndex: number) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  const getListStyle = (isDraggingOver: any) => ({
    width: '100%',
    background: isDraggingOver ? 'lightgrey' : 'lightgrey',
  })

  const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    background: isDragging ? 'white' : 'white',
    // styles we need to apply on draggables
    ...draggableStyle,
  })

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }

    const items = reorder(
      eventTypes.filter((eventType) => !eventType.archived),
      result.source.index,
      result.destination.index,
    )

    handleUpdateEventTypes(items)
    setEventTypes(items.concat(eventTypes.filter((type) => type.archived)))
  }

  return (
    <Box
      sx={{
        padding: '40px',
        paddingBottom: '20px',
        borderRight: '1px solid #E7E7E7',
        position: 'relative',
      }}
    >
      <Box sx={classes.tableCotainer}>
        <Typography sx={{ ...classes.typeName, fontWeight: 'bold' }}>Type Name</Typography>
        <Typography sx={{ ...classes.color, fontWeight: 'bold' }}>Color</Typography>
      </Box>
      <Box>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='droppable'>
            {(provided: any, snapshot: any) => (
              <Box {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                {eventTypes
                  .filter((eventType) => !eventType.archived)
                  .map((item, index) => (
                    <Draggable
                      key={item.id.toString()}
                      draggableId={item.id.toString()}
                      index={index}
                      isDragDisabled={isDragDisable}
                    >
                      {(provided: any, snapshot: any) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                        >
                          <Box key={index} sx={classes.tableCotainer} draggable='false'>
                            <Typography
                              sx={classes.typeName}
                              onMouseOver={() => {
                                setIsDragDisable(true)
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Typography
                              sx={classes.color}
                              onMouseOver={() => {
                                setIsDragDisable(true)
                              }}
                            >
                              {item.color.toLocaleUpperCase()}
                            </Typography>
                            <Box
                              sx={classes.circleBox}
                              onMouseOver={() => {
                                setIsDragDisable(true)
                              }}
                            >
                              <Box sx={{ ...classes.circle, backgroundColor: item.color }}></Box>
                            </Box>
                            <Box sx={classes.action}>
                              <MenuIcon
                                sx={classes.iconCursor}
                                onMouseOver={() => {
                                  setIsDragDisable(false)
                                }}
                                fontSize='medium'
                              />
                              <ModeEditIcon
                                sx={classes.iconCursor}
                                fontSize='medium'
                                onClick={() => handleEditClick(item)}
                                onMouseOver={() => {
                                  setIsDragDisable(true)
                                }}
                              />
                              <SystemUpdateAltIcon
                                sx={classes.iconCursor}
                                fontSize='medium'
                                onClick={() => {
                                  setSelectedEventType(item)
                                  setShowArchivedModal(true)
                                }}
                                onMouseOver={() => {
                                  setIsDragDisable(true)
                                }}
                              />
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
    </Box>
  )
}

export default EventTypeTable
