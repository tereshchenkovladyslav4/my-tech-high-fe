import React, { useEffect, useContext, useState, ReactElement } from 'react'
import { gql, useQuery } from '@apollo/client'
import { Card } from '@mui/material'
import { map } from 'lodash'
import { Flexbox } from '@mth/components/Flexbox/Flexbox'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthRoute, MthTitle } from '@mth/enums'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getEmailRecordsQuery } from '../../service'
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
  buttonTitle?: string
}

export const TodoList: React.FC = () => {
  const { me } = useContext(UserContext)
  const [todoList, setTodoList] = useState<Array<ToDoListItem>>([])
  const { loading, data } = useQuery(getTodoListItems, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const { data: emailErrorCount } = useQuery(getEmailRecordsQuery, {
    variables: {
      filters: ['Error'],
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && data?.getTodoListItems) {
      const { application, packet, withdrawal } = data?.getTodoListItems?.results
      const currTodoList: ToDoListItem[] = [
        {
          id: 1,
          title: MthTitle.APPLICATIONS,
          link: MthRoute.ADMIN_APPLICATIONS.toString(),
          date: new Date(),
          severity: application,
        },
        {
          id: 2,
          title: 'Enrollment Packets',
          link: MthRoute.ENROLLMENT_PACKETS.toString(),
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
          link: MthRoute.WITHDRAWAL.toString(),
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
      ]
      if (emailErrorCount?.emailRecords.total > 0) {
        currTodoList.push({
          id: 7,
          title: 'Email Errors',
          link: 'communication/email-records',
          date: new Date(),
          severity: emailErrorCount?.emailRecords.total,
          buttonTitle: 'View Now',
        })
      }
      setTodoList(currTodoList)
    }
  }, [loading, data, emailErrorCount])

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
          To-do List
        </Subtitle>
        {renderTodoListItem()}
      </Flexbox>
    </Card>
  )
}
