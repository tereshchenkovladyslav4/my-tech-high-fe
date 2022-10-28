import React, { useState } from 'react'
import { Box, Button, Modal, TextField } from '@mui/material'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { useStyles } from './standardStyles'
import { EditStandardResProp } from './types'

const classes = useStyles

export const EditStandardResponse: React.FC<EditStandardResProp> = ({ response, onClose, onSave, selResponseIdx }) => {
  const [title, setTitle] = useState<string>(response.title)
  const [text, setText] = useState<string>(response.text)

  const handleSave = () => {
    onSave(selResponseIdx, title, text)
  }
  return (
    <Modal open={true} onClose={onClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Box sx={classes.customizeModalContainer}>
        <Box sx={classes.editContent}>
          <TextField
            name='title'
            label='Title'
            placeholder='Entry'
            fullWidth
            value={title}
            sx={{ my: 1, maxWidth: '50%' }}
            onChange={(e) => setTitle(e.target.value)}
          />
          <MthBulletEditor value={text} setValue={(value) => setText(value)} />
        </Box>
        <Box sx={classes.btnGroup}>
          <Button sx={classes.cancelBtn} onClick={onClose}>
            Cancel
          </Button>
          <Button sx={classes.modalSaveBtn} onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
