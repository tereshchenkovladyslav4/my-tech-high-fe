import { gql, useQuery } from '@apollo/client'
import { Box } from '@mui/system'
import { map } from 'lodash'
import React, { Fragment, FunctionComponent, useEffect, useContext, useState } from 'react'
import { UserContext } from '../../../../../../providers/UserContext/UserProvider'
import { ToDoListItem } from '../ToDoListItem/ToDoListItem'
import { packetCountQuery } from '../../../../EnrollmentPackets/services'

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
          link: '/applications',
          date: new Date(),
          severity: submiteedApplicationCountResponse?.submittedApplicationCount?.results?.Submitted,
        },
        {
          id: 2,
          title: 'Enrollment Packets',
          link: '/enrollment-packets',
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
    }
  }, [submiteedApplicationCountResponse, countGroup])

  const renderTodoListItem = () =>
    map(todoList, (el, idx) => {
      if (el.severity > 0) {
        return <ToDoListItem key={idx} todoItem={el} idx={idx} />
      }
    })

  return <Box sx={{ mt: 1.5 }}>{renderTodoListItem()}</Box>
}
