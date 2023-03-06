import React, { useState } from 'react'
import { Box, Button, Modal, TextField } from '@mui/material'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { extractContent } from '@mth/utils'
import { useStyles } from './standardStyles'
import { EditStandardResProp } from './types'

const classes = useStyles

export const EditStandardResponse: React.FC<EditStandardResProp> = ({ response, onClose, onSave, selResponseIdx }) => {
  const [title, setTitle] = useState<string>(response.title)
  const [text, setText] = useState<string>(response.text)

  const [error, setError] = useState<{
    title: boolean
    text: boolean
  }>({
    title: false,
    text: false,
  })

  const handleSave = () => {
    if (!title && extractContent(text).length <= 1) {
      setError({
        text: true,
        title: true,
      })
    } else if (!title) {
      setError({
        ...error,
        title: true,
      })
    } else if (extractContent(text).length <= 1) {
      setError({
        ...error,
        text: true,
      })
    } else {
      onSave(selResponseIdx, title, text)
    }
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
            onChange={(e) => {
              setError({
                ...error,
                title: false,
              })
              setTitle(e.target.value)
            }}
            error={error.title}
            helperText={error.title && 'Required'}
          />
          <MthBulletEditor
            value={text}
            setValue={(value) => {
              setError({
                ...error,
                text: false,
              })
              setText(value)
            }}
            maxHeight='350px'
            error={error.text}
          />
          {error.text && (
            <Subtitle
              size='small'
              sx={{ marginLeft: '16px', fontSize: '0.75rem', textAlign: 'start', color: MthColor.RED }}
            >
              Required
            </Subtitle>
          )}
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
