import React from 'react'

import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MarkunreadMailboxOutlinedIcon from '@mui/icons-material/MarkunreadMailboxOutlined'
import SubjectOutlinedIcon from '@mui/icons-material/SubjectOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { Box, Button } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { Subtitle } from '../../../../../../components/Typography/Subtitle/Subtitle'
import { MTHORANGE, PRIMARY_MEDIUM_MOUSEOVER } from '../../../../../../utils/constants'
import { TodoListTemplateType } from './types'

const Row = (props) => (
  <Box display='flex' flexDirection='row' alignItems='center' justifyContent={props.content || 'flex-start'}>
    {props.children}
  </Box>
)
export const ToDoListItem: TodoListTemplateType = ({ todoItem, idx }) => {
  const history = useHistory()
  const renderIcon = (idx) => {
    if (idx == 1 || idx == 2) {
      return <FeedOutlinedIcon fontSize='medium' />
    } else if (idx == 3) {
      return <SubjectOutlinedIcon fontSize='medium' />
    } else if (idx == 4) {
      return <InfoOutlinedIcon fontSize='medium' />
    } else if (idx == 5 || idx == 6) {
      return <CreditCardOutlinedIcon fontSize='medium' />
    } else if (idx == 7) {
      return <MarkunreadMailboxOutlinedIcon fontSize='medium' />
    } else {
      return <InfoOutlinedIcon fontSize='medium' />
    }
  }
  return (
    <Box style={{ padding: '5px 5px 5px 15px', marginBottom: '20px' }}>
      <Box key={idx}>
        <Row content='space-between'>
          <Box>
            <Row>
              {renderIcon(todoItem.id)}
              <Box sx={{ ml: 4 }}>
                <Subtitle fontWeight='bold'>{todoItem.title}</Subtitle>
              </Box>
            </Row>
          </Box>
          <Box>
            <Row>
              <Box
                sx={{
                  borderRadius: 1,
                  background: 'rgba(236, 89, 37, 0.1)',
                  width: 72,
                  height: 28,
                  display: 'flex',
                  justifyContent: 'center',
                  mr: 4,
                  padding: 0.4,
                }}
              >
                <Row>
                  <WarningAmberOutlinedIcon fontSize='small' htmlColor={MTHORANGE} />
                  <Subtitle size={12} color={MTHORANGE} sx={{ ml: 1 }}>
                    {todoItem.severity}
                  </Subtitle>
                </Row>
              </Box>
              <Button
                variant='contained'
                sx={{
                  borderRadius: 2,
                  fontSize: 12,
                  background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
                  width: 140,
                  height: 48,
                  fontWeight: 700,
                  textTransform: 'none',
                  '&:hover': {
                    background: PRIMARY_MEDIUM_MOUSEOVER,
                    color: 'white',
                  },
                }}
                onClick={() => history.push(todoItem.link)}
              >
                <Subtitle size={12}>Process Now</Subtitle>
              </Button>
            </Row>
          </Box>
        </Row>
      </Box>
    </Box>
  )
}
