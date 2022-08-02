import React, { FunctionComponent, useEffect, useContext, useState, ReactElement } from 'react'
import { gql, useQuery } from '@apollo/client'
import { Card } from '@mui/material'
import { map } from 'lodash'
import { Flexbox } from '../../../../../../components/Flexbox/Flexbox'
import { Subtitle } from '../../../../../../components/Typography/Subtitle/Subtitle'
import { UserContext } from '../../../../../../providers/UserContext/UserProvider'
import { WITHDRAWAL, ADMIN_APPLICATIONS, ENROLLMENT_PACKETS } from '../../../../../../utils/constants'
import { ToDoListItem } from '../ToDoListItem/ToDoListItem'

export const getTodoListItems = gql`
  query GetTodoListItems($regionId: ID!) {
    getTodoListItems(regionId: $regionId) {
      error
      message
      results
    }
  }
`
type ToDoListItem = {
  id: number
  title: string
  link: string
  date: Date
  severity: number
}

export const TodoList: FunctionComponent = () => {
  const { me } = useContext(UserContext)
  const [todoList, setTodoList] = useState<Array<ToDoListItem>>([])
  const { loading, data } = useQuery(getTodoListItems, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && data?.getTodoListItems) {
      const { application, packet, withdrawal } = data?.getTodoListItems?.results
      setTodoList([
        {
          id: 1,
          title: 'Applications',
          link: ADMIN_APPLICATIONS,
          date: new Date(),
          severity: application,
        },
        {
          id: 2,
          title: 'Enrollment Packets',
          link: ENROLLMENT_PACKETS,
          date: new Date(),
          severity: packet,
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
          title: 'Withdrawals',
          link: WITHDRAWAL,
          date: new Date(),
          severity: withdrawal,
        },
        {
          id: 5,
          title: 'Direct Orders',
          link: 'direct-orders',
          date: new Date(),
          severity: 50,
        },
        {
          id: 6,
          title: 'Reimbursements',
          link: 'reimbursements',
          date: new Date(),
          severity: 300,
        },
        {
          id: 7,
          title: 'Email Errors',
          link: 'email-errors',
          date: new Date(),
          severity: 5,
        },
      ])
    }
  }, [loading, data])

  const renderTodoListItem = (): (void | React.ReactElement<
    unknown,
    string | React.JSXElementConstructor<unknown>
  >)[] =>
    map(todoList, (el, idx): ReactElement | undefined => {
      if (el.severity > 0) {
        return <ToDoListItem key={idx} todoItem={el} idx={idx} />
      } else {
        return undefined
      }
    })

  return (
    <Card sx={{ mt: 1.5, backgroundColor: { xs: '#F8F8F8', sm: '#F8F8F8', md: '#FFFFFF' }, padding: 4 }}>
      <Flexbox flexDirection='column' textAlign='left'>
        <Subtitle size='large' fontWeight='bold' sx={{ marginBottom: 2 }}>
          To Do List
        </Subtitle>
        {renderTodoListItem()}
      </Flexbox>
    </Card>
  )
}
