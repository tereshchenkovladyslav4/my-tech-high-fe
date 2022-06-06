import { Box, Card } from '@mui/material'
import { Flexbox } from '../../../components/Flexbox/Flexbox'
import { EmptyState } from '../../../components/EmptyState/EmptyState'
import React, { FunctionComponent, useState } from 'react'
import { TodoList } from './components/TodoList/TodoList'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import BGSVG from '../../../assets/ToDoListBG.svg'
import { SYSTEM_06 } from '../../../utils/constants'
import { Title } from '../../../components/Typography/Title/Title'

const EmptyStateWrapper = (props) => (
  <Box
        flexDirection='row'
        textAlign='left'
        paddingY={1.5}
        paddingX={3}
        display='flex'
        justifyContent='space-between'
        sx={{
          padding: '160px 0'
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

const emptyStateHandler = (showEmpty: boolean) => {
  if( showEmpty ) {
    return {
      backgroundImage: `url(${BGSVG})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center right',
    }
  }
  
  return {}
}

export const ToDo: FunctionComponent = () => {
  const [showEmpty, setShowEmpty] = useState(false)

  const handleShowEmpty = ( isEmpty : boolean) => {
    setShowEmpty(isEmpty)
  }

  return (
    <Card style={{ borderRadius: 12 }}>
      <Box
        flexDirection='row'
        textAlign='left'
        paddingY={1.5}
        paddingX={3}
        display='flex'
        justifyContent='space-between'
        sx={emptyStateHandler(showEmpty)}
      >
        <Flexbox flexDirection='column' textAlign='left'>
          <Subtitle size='large' fontWeight='bold'>
            To Do List
          </Subtitle>
          {!showEmpty ? <TodoList handleShowEmpty={handleShowEmpty} /> : <EmptyStateWrapper title='Congrats!' subtitle='You are all caught up.' />}
        </Flexbox>
      </Box>
    </Card>
  )
}
