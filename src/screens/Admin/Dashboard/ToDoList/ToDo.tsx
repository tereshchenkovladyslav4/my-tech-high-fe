import React, { useState } from 'react'
import { Box } from '@mui/material'
import { EmptyState } from '@mth/components/EmptyState/EmptyState'
import { Flexbox } from '@mth/components/Flexbox/Flexbox'
import { TodoList } from './components/TodoList/TodoList'

export const ToDo: React.FC = () => {
  const [showEmpty] = useState(false)
  return (
    <Box flexDirection='row' textAlign='left' paddingY={1.5} display='flex' justifyContent='space-between'>
      <Flexbox flexDirection='column' textAlign='left'>
        {!showEmpty ? <TodoList /> : <EmptyState title='Congrats!' subtitle='You are all caught up.' />}
      </Flexbox>
    </Box>
  )
}
