import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Table, TableBody, TableContainer, Box } from '@mui/material'
import { forOwn, map, groupBy, values } from 'lodash'
import moment from 'moment'
import { checkEnrollPacketStatus } from '../../../../../utils/utils'
import { getTodoList } from '../../service'
import { ToDoListItem } from '../ToDoListItem/ToDoListItem'
import { ToDoCategory, ToDoItem } from '../ToDoListItem/types'
import { TodoListTemplateType } from './types'

export const TodoList: TodoListTemplateType = ({ handleShowEmpty, schoolYears }) => {
  const [todoList, setTodoList] = useState<ToDoItem[]>([])
  const [paginatinLimit] = useState<number>(25)
  const [skip] = useState<number>()

  const { loading, data } = useQuery(getTodoList, {
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
      setTodoList([])
      forOwn(parent_todos, (item: ToDoItem, key) => {
        if (key !== '__typename') {
          if (item.category == ToDoCategory.SUBMIT_ENROLLMENT_PACKET) {
            // Have to group by accepted date
            const splitedItems = values(
              groupBy(
                item.students.filter((student) => checkEnrollPacketStatus(schoolYears, student)),
                (student) => student.current_school_year_status.application_date_accepted,
              ),
            ).reduce((list: ToDoItem[], students) => list.concat([{ ...item, students: students }]), [])
            setTodoList((prev) => [...prev, ...splitedItems])
            //setTodoList((prev) => [...prev, ...splitedItems])
            // setTodoList([...splitedItems])
          } else if (item.category == ToDoCategory.SUBMIT_WITHDRAW) {
            // If there are multiple students, they should each have their own to-do item
            const splitedItems: ToDoItem[] = item.students.reduce(
              (list: ToDoItem[], student) => list.concat([{ ...item, students: [student] }]),
              [],
            )
            setTodoList((prev) => [...prev, ...splitedItems])
          } else {
            const splitedItems: ToDoItem[] = item.students.reduce(
              (list: ToDoItem[], student) => list.concat([{ ...item, students: [student] }]),
              [],
            )
            setTodoList((prev) => [...prev, ...splitedItems])
          }

          if (item.students.length) {
            todoListCount++
          }
        }
      })

      if (todoListCount == 0) {
        handleShowEmpty(true)
      }
    }
  }, [loading])

  const calcCreateDate = (todoItem: ToDoItem): string => {
    switch (todoItem.category) {
      case ToDoCategory.SUBMIT_WITHDRAW: {
        return moment(todoItem.students.at(-1)?.StudentWithdrawals.at(-1)?.date).format('MMM Do, YYYY')
      }
      case ToDoCategory.SUBMIT_SCHEDULE: {
        if (todoItem.students.at(-1)?.current_school_year_status?.midyear_application)
          return moment(todoItem.students.at(-1)?.current_school_year_status?.midyear_schedule_open).format(
            'MMM Do, YYYY',
          )
        else
          return moment(todoItem.students.at(-1)?.current_school_year_status?.schedule_builder_open).format(
            'MMM Do, YYYY',
          )
      }
      default: {
        return todoItem.students.at(-1)?.current_school_year_status?.application_date_accepted || '-'
      }
    }
  }

  const calcDueDate = (todoItem: ToDoItem): string => {
    switch (todoItem.category) {
      case ToDoCategory.SUBMIT_WITHDRAW: {
        return (
          moment(
            todoItem.students.at(-1)?.StudentWithdrawals.at(-1)?.date_emailed ||
              todoItem.students.at(-1)?.StudentWithdrawals.at(-1)?.date,
          )
            .add(todoItem.students.at(-1)?.current_school_year_status?.withdraw_deadline_num_days || 0, 'days')
            .format('MM.DD') || '-'
        )
      }
      case ToDoCategory.SUBMIT_SCHEDULE: {
        if (todoItem.students.at(-1)?.current_school_year_status?.midyear_application)
          return moment(todoItem.students.at(-1)?.current_school_year_status?.midyear_schedule_close).format('MM.DD')
        else return moment(todoItem.students.at(-1)?.current_school_year_status?.schedule_builder_close).format('MM.DD')
      }
      default: {
        return todoItem.students.at(-1)?.current_school_year_status?.enrollment_packet_date_deadline || '-'
      }
    }
  }

  const renderTodoListItem = () => {
    return map(todoList, (el, idx) => {
      return (
        el && (
          <ToDoListItem
            key={idx}
            todoItem={el}
            todoDate={calcCreateDate(el)}
            todoDeadline={calcDueDate(el)}
            idx={idx}
          />
        )
      )
    })
  }

  return (
    <>
      <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
        <TableContainer>
          <Table aria-label='simple table'>
            <TableBody>{renderTodoListItem()}</TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ display: { sm: 'block', md: 'none' } }}>{renderTodoListItem()}</Box>
    </>
  )
}
