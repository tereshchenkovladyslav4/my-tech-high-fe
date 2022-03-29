import React, { useState } from 'react'
import { Box, Button, List } from '@mui/material'
// @ts-ignore
import { useStyles } from './styles'
import { StudentQuestion, initStudentQuestion } from './types'
import ApplicationQuestionItem from './Question'
import { Form, Formik } from 'formik'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'

const SortableItem = SortableElement(ApplicationQuestionItem)

const SortableStudentAddQuestionContainer = SortableContainer(({ items }: { items: StudentQuestion[] }) => (
  <List>
    {items.map((item, index) => (
      <SortableItem index={index} key={index} item={item} />
    ))}
  </List>
))
export default function AddStudentButton() {
  const [studentQuestion, setStudentQuestion] = useState(initStudentQuestion)
  return (
    <Box sx={{ marginBottom: '20px' }}>
      <Button sx={{ ...useStyles.addStudentButton }}>Add Student</Button>
      <p>
        Student(s) agrees to adhere to all program policies and requirements, including participation in state testing.
        Review details at
      </p>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box width='600px'>
          <Box width='600px'>
            <SortableStudentAddQuestionContainer
              items={studentQuestion}
              useDragHandle={true}
              onSortEnd={({ oldIndex, newIndex }) => {
                const newData = arrayMove(studentQuestion, oldIndex, newIndex)
                setStudentQuestion(newData)
              }}
            />
          </Box>
        </Box>

        <Button sx={{ ...useStyles.submitButton, color: 'white' }}>Submit to Utah Program</Button>
      </Box>
    </Box>
  )
}
