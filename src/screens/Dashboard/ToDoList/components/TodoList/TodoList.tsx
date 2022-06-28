import { Table, TableBody, TableContainer, Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { getTodoList } from '../../service'
import { forOwn, map } from 'lodash'
import { ToDoListItem } from '../ToDoListItem/ToDoListItem'
import { TodoListTemplateType } from './types'
import { checkEnrollPacketStatus } from '../../../../../utils/utils'

export const TodoList: TodoListTemplateType = ({ handleShowEmpty, schoolYears }) => {
  const [todoList, setTodoList] = useState<Array<any>>([])
  const [paginatinLimit, setPaginatinLimit] = useState(25)
  const [skip, setSkip] = useState()

  const { loading, error, data } = useQuery(getTodoList, {
    variables: {
      skip: skip,
      sort: 'status|ASC',
      take: paginatinLimit,
    },
  })

  useEffect(() => {
    if (data !== undefined && schoolYears?.length > 0) {
      const { parent_todos } = data
      let todoListCount = 0
      forOwn(parent_todos, (item, key) => {
        if (key !== '__typename') {
          if (key === 'submit_enrollment_packet') {
            const _students = item.students.reduce(function (r, a) {
              r[a.current_school_year_status.application_date_accepted] =
                r[a.current_school_year_status.application_date_accepted] || []
              if (checkEnrollPacketStatus(schoolYears, a))
                r[a.current_school_year_status.application_date_accepted].push(a)
              return r
            }, Object.create(null))
            const _item = { ...item, ...{ parsed: _students } }
            setTodoList((prev) => [...prev, _item])
          } else {
            setTodoList((prev) => [...prev, item])
          }

          if (item.students.length !== 0) {
            todoListCount++
          }
        }
      })

      if (todoListCount == 0) {
        handleShowEmpty(true)
      }
    }
  }, [loading])

  const renderTodoListByAcceptedApplication = (el: any) =>
    Object.entries(el.parsed).map(([key, value]: any, i) => {
      const deadline = value.at(-1)?.current_school_year_status.enrollment_packet_date_deadline || null
      const item = {
        button: 'Submit Now',
        dashboard: 1,
        homeroom: 1,
        icon: '',
        phrase: 'Submit Enrollment Packet',
        students: value,
        date_accepted: key,
        date_deadline: deadline,
      }

      return <ToDoListItem key={`sep-${key}`} todoItem={item} idx={i} todoDate={key} todoDeadline={deadline} />
    })

  const renderTodoListItem = () => {
    return map(todoList, (el, idx) => {
      if (el.parsed && Object.keys(el.parsed).length > 1) {
        return renderTodoListByAcceptedApplication(el)
      } else {
        return (
          el &&
          el.students.filter((student: any) => !!checkEnrollPacketStatus(schoolYears, student)).length !== 0 && (
            <ToDoListItem
              key={idx}
              todoItem={{
                ...el,
                students: el.students.filter((student: any) => checkEnrollPacketStatus(schoolYears, student)),
              }}
              todoDate={
                el.students.filter((student: any) => checkEnrollPacketStatus(schoolYears, student)).at(-1)
                  ?.current_school_year_status.application_date_accepted || null
              }
              todoDeadline={
                el.students.filter((student: any) => checkEnrollPacketStatus(schoolYears, student)).at(-1)
                  ?.current_school_year_status.enrollment_packet_date_deadline || null
              }
              idx={idx}
            />
          )
        )
      }
    })
  }

  return (
    <>
      <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
        <TableContainer >
          <Table aria-label='simple table'>
            <TableBody>{renderTodoListItem()}</TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ display: { sm: 'block', md: 'none' } }}>
        {renderTodoListItem()}
      </Box>
    </>

  )
}
