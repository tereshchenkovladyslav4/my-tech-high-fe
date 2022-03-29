import { Box, Card } from '@mui/material'
import { Flexbox } from '../../../components/Flexbox/Flexbox'
import { EmptyState } from '../../../components/EmptyState/EmptyState'
import React, { FunctionComponent, useState } from 'react'
import { TodoList } from './components/TodoList/TodoList'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'

export const ToDo: FunctionComponent = () => {
  const [showEmpty] = useState(false)
  return (
    <Card style={{ borderRadius: 12 }}>
      <Box
        flexDirection='row'
        textAlign='left'
        paddingY={1.5}
        paddingX={3}
        display='flex'
        justifyContent='space-between'
      >
        <Flexbox flexDirection='column' textAlign='left'>
          <Subtitle size='large' fontWeight='bold'>
            To Do List
          </Subtitle>
          {!showEmpty ? <TodoList /> : <EmptyState title='Congrats!' subtitle='You are all caught up.' />}
        </Flexbox>
      </Box>
    </Card>
  )
}
