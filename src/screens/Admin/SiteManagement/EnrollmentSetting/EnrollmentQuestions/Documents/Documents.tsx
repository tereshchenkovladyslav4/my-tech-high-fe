import { Box, Grid } from '@mui/material'
import React, { FunctionComponent, useContext } from 'react'
import { Paragraph } from '../../../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../../../components/Typography/Subtitle/Subtitle'
import { DocumentUpload } from './components/DocumentUpload/DocumentUpload'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import { EnrollmentQuestionTab, EnrollmentQuestion } from '../types'
import {  useFormikContext } from 'formik'
import { List } from '@mui/material'
import { TabContext } from '../TabContextProvider'

const DocumentItem = ({item}) => {
  return (
    <Grid item xs={12} marginTop={4}>
      <DocumentUpload
        item={item}
      />
    </Grid>
  )
}

const SortableItem = SortableElement(DocumentItem)

const SortableListContainer = SortableContainer(({ items }: { items: EnrollmentQuestion[] }) => (
  <List>
    {items.map((item, index) => (
      <SortableItem index={index} key={index} item={item} />
    ))}
  </List>
))

export const Documents: FunctionComponent = () => {
  const tabName = useContext(TabContext)
  const { values, setValues } = useFormikContext<EnrollmentQuestionTab[]>()
  const uploadData = values.filter((v) => v.tab_name === tabName)[0].groups[0]?.questions || []

  return (
    <form>
    <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={12}>
        {/* <Box width='50%'>
          <Subtitle fontWeight='700'>Required Documents to scan (or photograph) and upload</Subtitle>
          <Paragraph size='medium'>
            All documents are kept private and secure. Please upload files specific to this student (ie don&apos;t include
            another student&apos;s documents).
          </Paragraph>
        </Box> */}
        <SortableListContainer
          items={uploadData}
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