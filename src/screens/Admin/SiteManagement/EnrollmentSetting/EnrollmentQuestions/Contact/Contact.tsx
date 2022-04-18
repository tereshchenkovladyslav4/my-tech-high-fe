import React, { useContext } from 'react'
import { Form, Formik, useFormikContext } from 'formik'
import { EnrollmentQuestionTab, EnrollmentQuestionGroup } from '../types'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import { List } from '@mui/material'
import GroupItem from '../Goup'
import { TabContext } from '../TabContextProvider'

const SortableItem = SortableElement(GroupItem)

const SortableListContainer = SortableContainer(({ items }: { items: EnrollmentQuestionGroup[] }) => (
  <List>
    {items.map((item, index) => (
      <SortableItem index={index} key={index} item={item} />
    ))}
  </List>
))
export default function Contact() {
    const tabName = useContext(TabContext)
    const { values, setValues } = useFormikContext<EnrollmentQuestionTab[]>()
    const contactData = values.filter((v) => v.tab_name === tabName)[0].groups || []
    
    return (
        <SortableListContainer
            items={contactData}
            useDragHandle={true}
            onSortEnd={({ oldIndex, newIndex }) => {
                const newData = arrayMove(contactData, oldIndex, newIndex).map((v, i) => ({
                ...v,
                order: i + 1,
                }))
                const newValues = values.map((v) => v.tab_name === tabName ? {...v, groups: newData} : v)                    
                setValues(newValues)
            }}
        />
    )
}