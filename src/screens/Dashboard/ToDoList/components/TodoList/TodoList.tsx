import { Avatar, AvatarGroup, Button, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { Metadata } from '../../../../../components/Metadata/Metadata'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { UserContext } from '../../../../../providers/UserContext/UserProvider'
import { useHistory } from 'react-router-dom'
import { ENROLLMENT, HOMEROOM } from '../../../../../utils/constants'
import { useQuery } from '@apollo/client'
import { getTodoList } from '../../service'
import { forOwn, map } from 'lodash'
import { ToDoListItem } from '../ToDoListItem/ToDoListItem'

const imageA =
  'https://api.time.com/wp-content/uploads/2017/12/terry-crews-person-of-year-2017-time-magazine-facebook-1.jpg?quality=85'
const imageB =
  'https://cdn.psychologytoday.com/sites/default/files/styles/article-inline-half-caption/public/field_blog_entry_images/2018-09/shutterstock_648907024.jpg?itok=0hb44OrI'
const imageC = 'https://www.bentbusinessmarketing.com/wp-content/uploads/2013/02/35844588650_3ebd4096b1_b-1024x683.jpg'
const images = [imageA, imageB, imageC]
const image = images[Math.floor(Math.random() * images.length)]

export const TodoList: FunctionComponent = () => {
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
    if (data !== undefined) {
      const { parent_todos } = data
      forOwn(parent_todos, (item, key) => {
        if (key !== '__typename') {
          if( key === 'submit_enrollment_packet' ) {
            const _students = item.students.reduce(function (r, a) {
              r[a.current_school_year_status.application_date_accepted] = r[a.current_school_year_status.application_date_accepted] || []
              r[a.current_school_year_status.application_date_accepted].push(a)
              return r
          }, Object.create(null))

            const _item = { ...item, ...{parsed: _students} }
            setTodoList((prev) => [...prev, _item])
          } else {
            setTodoList((prev) => [...prev, item])
          }
        }
      })
    }
  }, [loading])

  const renderTodoListByAcceptedApplication = (el) => Object.entries(el.parsed).map(([key, value], i) => {
        const item = {
          "button": "Submit Now",
          "dashboard": 1,
          "homeroom": 1,
          "icon": "",
          "phrase": "Submit Enrollment Packet",
          "students": value,
          "date_accepted": key
      }
        return <ToDoListItem key={`sep-${key}`} todoItem={item} idx={i} todoDate={key} todoDeadline="08.12" />
    }
  )

  const renderTodoListItem = () => {
    return map(todoList, (el, idx) => {
        if( el.parsed && Object.keys(el.parsed).length > 1 ) {
          return renderTodoListByAcceptedApplication(el)
        } else {
          return el && el.students.length !== 0 && 
            <ToDoListItem 
              key={idx} 
              todoItem={el} 
              todoDate={el.students.at(-1)?.current_school_year_status.application_date_accepted || null} 
              todoDeadline="08.12"
              idx={idx} 
            />
        }
      } 
    )
  }
    

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableBody>{renderTodoListItem()}</TableBody>
      </Table>
    </TableContainer>
  )
}
