import { gql, useQuery } from '@apollo/client'
import { Box } from '@mui/system'
import { map } from 'lodash'
import React, { Fragment, FunctionComponent, useEffect, useContext, useState } from 'react'
import { UserContext } from '../../../../../../providers/UserContext/UserProvider'
import { ToDoListItem } from '../ToDoListItem/ToDoListItem'
import { WITHDRAWAL, ADMIN_APPLICATIONS, ENROLLMENT_PACKETS } from '../../../../../../utils/constants'
import { Flexbox } from '../../../../../../components/Flexbox/Flexbox'
import { Subtitle } from '../../../../../../components/Typography/Subtitle/Subtitle'
import { Card } from '@mui/material'

export const getSubmittedApplicationCount = gql`
  query SubmittedApplicationCount($regionId: ID!) {
    submittedApplicationCount(regionId: $regionId) {
      error
      message
      results
    }
  }
`

export const getPacketCount = gql`
  query PacketCountByRegionId($regionId: ID!) {
    packetCountByRegionId(region_id: $regionId) {
      error
      message
      results
    }
  }
`

export const TodoList: FunctionComponent = () => {
  const { me, setMe } = useContext(UserContext)
  const { loading: applcationCountLoading, data: submiteedApplicationCountResponse } = useQuery(
    getSubmittedApplicationCount,
    {
      variables: {
        regionId: me?.selectedRegionId,
      },
      skip: me?.selectedRegionId ? false : true,
      fetchPolicy: 'network-only',
    },
  )
  const { loading: countLoading, data: countGroup } = useQuery(getPacketCount, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    fetchPolicy: 'network-only',
  })
  const [todoList, setTodoList] = useState<Array<any>>([])

  useEffect(() => {
    if (!applcationCountLoading && !countLoading && submiteedApplicationCountResponse && countGroup) {
      setTodoList([
        {
          id: 1,
          title: 'Applications',
          link: ADMIN_APPLICATIONS,
          date: new Date(),
          severity: submiteedApplicationCountResponse?.submittedApplicationCount?.results?.Submitted,
        },
        {
          id: 2,
          title: 'Enrollment Packets',
          link: ENROLLMENT_PACKETS,
          date: new Date(),
          severity:
            countGroup?.packetCountByRegionId?.results['Age Issue'] +
            countGroup?.packetCountByRegionId?.results['Resubmitted'] +
            countGroup?.packetCountByRegionId?.results['Submitted'],
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
          severity: 50,
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
  }, [submiteedApplicationCountResponse, countGroup])

  const renderTodoListItem = () =>
    map(todoList, (el, idx) => {
      if (el.severity > 0) {
        return <ToDoListItem key={idx} todoItem={el} idx={idx} />
      }
    })

  return (
    <Card sx={{ mt: 1.5, backgroundColor: { xs: '#F8F8F8', sm: '#F8F8F8', md: '#FFFFFF', }, padding: 4 }}>
      <Flexbox flexDirection='column' textAlign='left'>
        <Subtitle size='large' fontWeight='bold' sx={{ marginBottom: 2}}>
          To Do List
        </Subtitle>
        {renderTodoListItem()}
      </Flexbox>
    </Card>
  )
}
