import { Box } from '@mui/material'
import { Flexbox } from '../../../../components/Flexbox/Flexbox'
import { EmptyState } from '../../../../components/EmptyState/EmptyState'
import React, { FunctionComponent, useState } from 'react'
import { TodoList } from './components/TodoList/TodoList'

export const ToDo: FunctionComponent = () => {
  const [showEmpty] = useState(false)
  return (
    <Box flexDirection='row' textAlign='left' paddingY={1.5} display='flex' justifyContent='space-between'>
      <Flexbox flexDirection='column' textAlign='left'>
        {!showEmpty ? <TodoList /> : <EmptyState title='Congrats!' subtitle='You are all caught up.' />}
      </Flexbox>
    </Box>
  )
}
