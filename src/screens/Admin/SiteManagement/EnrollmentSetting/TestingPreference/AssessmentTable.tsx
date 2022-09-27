import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Box } from '@mui/material'
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
import { updateAssessmentsMutation } from '@mth/graphql/mutation/assessment'
import AssessmentItem from './AssessmentItem'
import { AssessmentTableProps, AssessmentType } from './types'

const AssessmentTable: React.FC<AssessmentTableProps> = ({ assessmentItems, setSelectedAssessment, refetch }) => {
  const [isDragDisable, setIsDragDisable] = useState<boolean>(true)
  const [submitUpdates, {}] = useMutation(updateAssessmentsMutation)
  const getListStyle = (isDraggingOver: boolean) => ({
    width: '100%',
    background: isDraggingOver ? 'lightgrey' : 'lightgrey',
  })

  const reorder = (list: AssessmentType[], startIndex: number, endIndex: number) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  const getItemStyle = (isDragging: boolean, draggableStyle: DraggingStyle | NotDraggingStyle | undefined) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    background: isDragging ? 'white' : 'white',
    // styles we need to apply on draggables
    ...draggableStyle,
  })

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const items = reorder(
      assessmentItems.filter((assessment) => !assessment.is_archived),
      result.source.index,
      result.destination.index,
    )
    await submitUpdates({
      variables: {
        updateAssessmentsInputs: {
          updateAssessments: items.map((item, index) => ({
            SchoolYearId: item?.SchoolYearId,
            assessment_id: item?.assessment_id,
            grades: item?.grades,
            information: item?.information,
            priority: index,
            test_name: item?.test_name,
            is_archived: item.is_archived,
          })),
        },
      },
    })
    refetch()
  }

  return (
    <Box sx={{ padding: 5, paddingLeft: 7 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable'>
          {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
            <Box {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
              {assessmentItems.map((item, index) => (
                <Draggable
                  key={item.assessment_id.toString()}
                  draggableId={item.assessment_id.toString()}
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
                      <AssessmentItem
                        key={index}
                        index={index}
                        item={item}
                        setIsDragDisable={setIsDragDisable}
                        setSelectedAssessment={setSelectedAssessment}
                        refetch={refetch}
                      />
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
  )
}

export default AssessmentTable
