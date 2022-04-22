import { gql, useQuery } from '@apollo/client'
import { Box } from '@mui/system'
import { map } from 'lodash'
import React, { Fragment, FunctionComponent, useEffect, useState } from 'react'
import { ToDoListItem } from '../ToDoListItem/ToDoListItem'

export const getSubmittedApplicationCount = gql`
  query SubmittedApplicationCount {
    submittedApplicationCount {
      error
      message
      results
    }
  }
`

export const TodoList: FunctionComponent = () => {
  const { loading: applcationCountLoading, data: submiteedApplicationCountResponse } =
    useQuery(getSubmittedApplicationCount)
  const [todoList, setTodoList] = useState<Array<any>>([])

  useEffect(() => {
    if (submiteedApplicationCountResponse?.submittedApplicationCount?.results?.Submitted) {
    }
    setTodoList([
      {
        id: 1,
        title: 'Applications',
        link: '/applications',
        date: new Date(),
        severity: submiteedApplicationCountResponse?.submittedApplicationCount?.results?.Submitted,
      },
      {
        id: 2,
        title: 'Enrollment Packets',
        link: '/enrollment-packets',
        date: new Date(),
        severity: 30,
      },
      {
        id: 3,
        title: 'Schedules',
        link: 'schedules',
        date: new Date(),
        severity: 10,
      },
      {
        id: 4,
        title: 'Reimbursements and Direct Orders',
        link: 'reimbursements-and-direct-orders',
        date: new Date(),
        severity: 300,
      },
      {
        id: 5,
        title: 'Withdrawals',
        link: 'withdrawals',
        date: new Date(),
        severity: 10,
      },
    ])
  }, [submiteedApplicationCountResponse?.submittedApplicationCount?.results?.Submitted])

  const renderTodoListItem = () =>
    map(todoList, (el, idx) => {
      if (el.severity > 0) {
        return <ToDoListItem key={idx} todoItem={el} idx={idx} />
      }
    })

  return <Box sx={{ mt: 1.5 }}>{renderTodoListItem()}</Box>
}
