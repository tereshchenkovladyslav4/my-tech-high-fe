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
          setTodoList((prev) => [...prev, item])
        }
      })
    }
  }, [loading])

  const renderTodoListItem = () =>
    map(todoList, (el, idx) => el && el.students.length !== 0 && <ToDoListItem key={idx} todoItem={el} idx={idx} />)

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableBody>{renderTodoListItem()}</TableBody>
      </Table>
    </TableContainer>
  )
}
