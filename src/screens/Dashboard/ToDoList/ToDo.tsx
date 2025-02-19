import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Box, Card, CircularProgress } from '@mui/material'
import BGSVG from '@mth/assets/ToDoListBG.svg'
import { EmptyState } from '@mth/components/EmptyState/EmptyState'
import { Flexbox } from '@mth/components/Flexbox/Flexbox'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { Title } from '@mth/components/Typography/Title/Title'
import { MthColor } from '@mth/enums'
import { SchoolYearType, Student } from '@mth/models'
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
        <Subtitle color={MthColor.SYSTEM_06} fontWeight='700'>
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
  isLoading?: boolean
  setIsLoading?: (isLoading: boolean) => void
  setMainTodoList?: (todoList: ToDoItem[]) => void
  filteredByStudent?: Student
}

export const ToDo: React.FC<TodoProps> = ({
  schoolYears,
  setIsLoading,
  setMainTodoList,
  filteredByStudent,
  isLoading,
}) => {
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

  const handleShowEmpty = useCallback((isEmpty: boolean) => {
    setShowEmpty(isEmpty)
  }, [])

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
          {isLoading && (
            <Box
              sx={{
                width: '100%',
                justifyContent: 'center',
                display: 'flex',
                paddingTop: '24px',
                paddingBottom: '24px',
              }}
            >
              <CircularProgress />
            </Box>
          )}
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
                filteredByStudent={filteredByStudent?.student_id}
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
