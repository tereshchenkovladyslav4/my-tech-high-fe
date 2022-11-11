import React, { FunctionComponent, useState, useEffect, useRef } from 'react'
import { Box, Card } from '@mui/material'
import BGSVG from '../../../assets/ToDoListBG.svg'
import { EmptyState } from '../../../components/EmptyState/EmptyState'
import { Flexbox } from '../../../components/Flexbox/Flexbox'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { Title } from '../../../components/Typography/Title/Title'
import { SYSTEM_06 } from '../../../utils/constants'
import { SchoolYearType } from '../HomeroomGrade/components/StudentGrade/types'
import { TodoList } from './components/TodoList/TodoList'
import { ToDoItem } from './components/ToDoListItem/types'

const EmptyStateWrapper = (props) => (
  <Box
    flexDirection='row'
    textAlign='left'
    paddingY={1.5}
    paddingX={3}
    display='flex'
    justifyContent='space-between'
    sx={{
      minHeight: '40vh',
    }}
  >
    <EmptyState
      title={<Title>{props.title}</Title>}
      subtitle={
        <Subtitle color={SYSTEM_06} fontWeight='700'>
          {props.subtitle}
        </Subtitle>
      }
    />
  </Box>
)

const emptyStateHandler = (showEmpty: boolean, windowDimensions: number) => {
  const widthPer = windowDimensions < 550 ? '100%' : ''
  if (showEmpty) {
    return {
      backgroundImage: `url(${BGSVG})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'bottom right',
      backgroundSize: widthPer,
    }
  }

  return {}
}

type TodoProps = {
  schoolYears: SchoolYearType[]
  setIsLoading?: (isLoading: boolean) => void
  setMainTodoList?: (todoList: ToDoItem[]) => void
}

export const ToDo: FunctionComponent<TodoProps> = ({ schoolYears, setIsLoading, setMainTodoList }) => {
  const cardRef = useRef(null)

  const [showEmpty, setShowEmpty] = useState(false)
  const [windowDimensions, setWindowDimensions] = useState(0)

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(cardRef.current.offsetWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleShowEmpty = (isEmpty: boolean) => {
    setShowEmpty(isEmpty)
  }

  return (
    <Card sx={{ paddingY: { xs: 0, sm: 4 }, paddingX: { xs: 0, sm: 8 } }} ref={cardRef}>
      <Box
        flexDirection='row'
        textAlign='left'
        display='block'
        justifyContent='space-between'
        sx={emptyStateHandler(showEmpty, windowDimensions)}
      >
        <Flexbox flexDirection='column' textAlign='left'>
          <Title textAlign='left' sx={{ marginLeft: { xs: 2, sm: 0 }, marginTop: { xs: 2, sm: 0 } }}>
            To-do List
          </Title>
          {!showEmpty ? (
            <Box
              flexDirection='column'
              textAlign='left'
              sx={{
                paddingX: { xs: 2, md: 0 },
              }}
            >
              <TodoList
                schoolYears={schoolYears}
                handleShowEmpty={handleShowEmpty}
                setIsLoading={setIsLoading}
                setMainTodoList={setMainTodoList}
              />
            </Box>
          ) : (
            <EmptyStateWrapper title='Congratulations!' subtitle='You are all caught up.' />
          )}
        </Flexbox>
      </Box>
    </Card>
  )
}
