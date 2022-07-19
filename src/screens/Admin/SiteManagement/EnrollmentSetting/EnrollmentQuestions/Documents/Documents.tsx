import { Box, Grid } from '@mui/material'
import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { DocumentUpload } from './components/DocumentUpload/DocumentUpload'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import { EnrollmentQuestionTab, EnrollmentQuestion } from '../types'
import {  useFormikContext } from 'formik'
import { List } from '@mui/material'
import { TabContext } from '../TabContextProvider'


const DocumentItem = ({item, specialEd}) => {
  return (
    <Grid item xs={12} marginTop={4}>
      <DocumentUpload
        item={item}
        specialEd={specialEd}
      />
    </Grid>
  )
}

const SortableItem = SortableElement(DocumentItem)

const SortableListContainer = SortableContainer(({ items, specialEd }: { items: EnrollmentQuestion[], specialEd: any }) => {
  const questionsArr = items.map((q) => {
    let arr = [q], current = q, child;
      while(child = items.find(x => x.additional_question == current.slug)) {
        arr.push(child);
        current = child;
      }
      return arr;
  })
  const questionsLists = questionsArr.filter((item) => !item[0].additional_question)
  return (
    <List>
      {questionsLists.map((item, index) => (
        <SortableItem index={index} key={index} item={item} specialEd={specialEd} />
      ))}
    </List>
  )
})

export const Documents: FunctionComponent = ({specialEd}) => {
  const tabName = useContext(TabContext)
  const { values, setValues } = useFormikContext<EnrollmentQuestionTab[]>()
  const uploadData = values.filter((v) => v.tab_name === tabName)[0].groups[0]?.questions || []

  return (
    <form>
    <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={12}>
        <SortableListContainer
          items={uploadData}
          specialEd = {specialEd}
          useDragHandle={true}
          axis="xy"
          onSortEnd={({ oldIndex, newIndex }) => {
              const newData = arrayMove(uploadData, oldIndex, newIndex).map((v, i) => ({
              ...v,
              order: i + 1,
              }))
              const newValues = values.map((v) => v.tab_name === tabName ? {...v, groups: [{...v.groups[0], questions: newData}]} : v)
              setValues(newValues)
          }}
        />
      </Grid>
    </Grid>
    </form>
  )
}