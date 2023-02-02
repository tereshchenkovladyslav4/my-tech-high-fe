import React, { useContext, useState } from 'react'
import DehazeIcon from '@mui/icons-material/Dehaze'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EditIcon from '@mui/icons-material/Edit'
import { Box, Grid, IconButton, Tooltip } from '@mui/material'
import { useFormikContext } from 'formik'
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { CustomModal } from '../components/CustomModal/CustomModals'
import { EditGroup } from './components/EditGroup/EditGroup'
import { EnrollmentQuestionItem } from './Question'
import { TabContext } from './TabContextProvider'
import { EnrollmentQuestionTab, EnrollmentQuestionGroup } from './types'

const DragHandle = SortableHandle(() => (
  <Tooltip title='Move'>
    <IconButton>
      <DehazeIcon />
    </IconButton>
  </Tooltip>
))
type GroupItemProps = {
  item: EnrollmentQuestionGroup
  mainQuestion?: boolean
}

const SortableItem = SortableElement(EnrollmentQuestionItem)

const SortableListContainer = SortableContainer(({ group }: { group: EnrollmentQuestionGroup }) => {
  const questionsArr = group.questions.map((q) => {
    const arr = [q]
    let current = q,
      child
    while ((child = group.questions.find((x) => x.additional_question == current.slug))) {
      arr.push(child)
      current = child
    }
    return arr
  })
  const questionsLists = questionsArr.filter((item) => !item[0].additional_question)
  return (
    <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      {questionsLists.map((item, index) => (
        <SortableItem index={index} key={index} item={item} group={group.group_name} />
      ))}
    </Grid>
  )
})

export const GroupItem: React.FC<GroupItemProps> = ({ item, mainQuestion = false }) => {
  const tabName = useContext(TabContext)
  const { values, setValues } = useFormikContext<EnrollmentQuestionTab[]>()
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  //   const [deleteQuestion] = useMutation(deleteQuestionGql)
  return (
    <>
      <Box display='flex' mt='20px' alignItems='center' justifyContent='start'>
        <Subtitle fontWeight='700'>{item.group_name}</Subtitle>
        {!mainQuestion && (
          <Box display='inline-flex' height='40px'>
            <Tooltip title='Edit'>
              <IconButton onClick={() => setShowEditDialog(true)}>
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title='Delete'>
              <IconButton onClick={() => setShowDeleteDialog(true)}>
                <DeleteForeverOutlinedIcon />
              </IconButton>
            </Tooltip>

            <DragHandle />
          </Box>
        )}
      </Box>
      <SortableListContainer
        group={item}
        useDragHandle={true}
        axis='xy'
        onSortEnd={({ oldIndex, newIndex }) => {
          const newData = arrayMove(item.questions, oldIndex, newIndex).map((v, i) => ({
            ...v,
            order: i + 1,
          }))
          const newValues = values.map((v) => {
            if (v.tab_name === tabName) {
              const newGroups = v.groups.map((g) =>
                g.group_name === item.group_name ? { ...g, questions: newData } : g,
              )
              return { ...v, groups: newGroups }
            }
            return v
          })
          setValues(newValues)
        }}
      />
      {showEditDialog && <EditGroup onClose={() => setShowEditDialog(false)} group={item.group_name} />}
      {showDeleteDialog && (
        <CustomModal
          title='Delete Group'
          description='Are you sure you want to delete this group?'
          confirmStr='Delete'
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={() => {
            setShowDeleteDialog(false)
            const newValues = values.map((v) => {
              if (v.tab_name === tabName) {
                const newGroups = v.groups.filter((g) => g.group_name !== item.group_name)
                const updatedGroups = newGroups
                  .sort((a, b) => a.order - b.order)
                  .map((item, index) => {
                    return { ...item, order: index + 1 }
                  })
                // v.groups = newGroups
                return { ...v, groups: updatedGroups }
              }
              return v
            })
            setValues(newValues)
            // deleteQuestion({ variables: { id: item.id } })
          }}
        />
      )}
    </>
  )
}
