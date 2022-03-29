import React, { useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { EmailModal } from './EmailModal'
import { Box, Button, Card, Typography } from '@mui/material'

export default {
  title: 'Components/EmailModal',
  component: EmailModal,
} as ComponentMeta<typeof EmailModal>

export const Default: ComponentStory<typeof EmailModal> = () => {
  const [openModal, setOpenModal] = useState(false)
  const t = () => window.alert('hi')
  return (
    <Card>
      <Button onClick={() => setOpenModal(true)}>Hello</Button>
      <Box sx={{width: '250px', height: '250px'}}>
        <EmailModal 
          modalOpen={openModal}
          handleModal={setOpenModal}
          >
          This is a EmailModal
        </EmailModal>  
      </Box>
    </Card>
  )  
}
