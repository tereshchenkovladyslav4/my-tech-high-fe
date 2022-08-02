import React, { ReactElement, useContext } from 'react'
import { List } from '@mui/material'
import { useFormikContext } from 'formik'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import { GroupItem } from '../Goup'
import { TabContext } from '../TabContextProvider'
import { EnrollmentQuestionTab, EnrollmentQuestionGroup } from '../types'

const SortableItem = SortableElement(GroupItem)

const SortableListContainer = SortableContainer(({ items }: { items: EnrollmentQuestionGroup[] }) => (
  <List>
    {items.map((item, index) => (
      <SortableItem index={index} key={index} item={item} />
    ))}
  </List>
))
export default function Education(): ReactElement {
  const tabName = useContext(TabContext)
  const { values, setValues } = useFormikContext<EnrollmentQuestionTab[]>()
  const educationData = values.filter((v) => v.tab_name === tabName)[0].groups || []
  return (
    <SortableListContainer
      items={educationData}
      useDragHandle={true}
      onSortEnd={({ oldIndex, newIndex }) => {
        const newData = arrayMove(educationData, oldIndex, newIndex).map((v, i) => ({
          ...v,
          order: i + 1,
        }))
        const newValues = values.map((v) => (v.tab_name === tabName ? { ...v, groups: newData } : v))
        setValues(newValues)
      }}
    />
  )
}
