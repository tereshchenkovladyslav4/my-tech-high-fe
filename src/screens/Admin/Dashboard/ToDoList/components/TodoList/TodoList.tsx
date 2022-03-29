import { Box } from '@mui/system'
import { map } from 'lodash'
import React, { Fragment, FunctionComponent, useState } from 'react'
import { ToDoListItem } from '../ToDoListItem/ToDoListItem'

export const TodoList: FunctionComponent = () => {
  const [todoList, setTodoList] = useState<Array<any>>([
    {
      id: 1,
      title: 'Applications',
      date: new Date(),
      severity: 100,
    },
    {
      id: 2,
      title: 'Enrollment Packets',
      date: new Date(),
      severity: 30,
    },
    {
      id: 3,
      title: 'Schedules',
      date: new Date(),
      severity: 10,
    },
    {
      id: 4,
      title: 'Reimbursements and Direct Orders',
      date: new Date(),
      severity: 300,
    },
    {
      id: 5,
      title: 'Withdrawals',
      date: new Date(),
      severity: 10,
    },
  ])

  const renderTodoListItem = () =>
    map(todoList, (el, idx) => <ToDoListItem key={idx} todoItem={el} idx={idx} />)

  return (
    <Box sx={{ mt: 1.5 }}>
      {renderTodoListItem()}
    </Box >
  )
}
