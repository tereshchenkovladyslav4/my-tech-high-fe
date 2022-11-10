import React from 'react'
import { Add } from '@mui/icons-material'
import DehazeIcon from '@mui/icons-material/Dehaze'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EditIcon from '@mui/icons-material/Edit'
import { Modal, List, ListItem, IconButton, Button, Grid, Tooltip } from '@mui/material'
import { Box } from '@mui/system'

import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { SaveCancelComponent } from '@mth/screens/Admin/Curriculum/CourseCatalog/Components/SaveCancelComponent'

import { extractContent } from '@mth/utils'
import { useStyles } from './standardStyles'
import { EmailStandardResponseProp, StandardRes } from './types'

const classes = useStyles

const DragHandle = SortableHandle(() => (
  <IconButton sx={{ color: '#0E0E0E' }}>
    <Tooltip title='Move' color='primary' placement='bottom'>
      <DehazeIcon />
    </Tooltip>
  </IconButton>
))

const StandardResponseInfo = ({ item }: { item: StandardRes }) => {
  return (
    <Box sx={{ ...classes.formRow }}>
      <Subtitle sx={{ ...(classes.formEllipLabel as Record<string, unknown>), width: '150px' }} fontWeight='600'>
        {item.title}
        <Box sx={classes.labelAfter as Record<string, unknown>}></Box>
      </Subtitle>
      <Subtitle sx={{ ...(classes.formText as Record<string, unknown>), paddingLeft: 3 }} fontWeight='600'>
        {extractContent(item.text)}
      </Subtitle>
    </Box>
  )
}

const StandardResponse: React.FC<{
  itemData: StandardRes
  index: number
  editResponse: (id: number) => void
  deleteResItem: (id: number) => void
}> = ({ itemData, index, editResponse, deleteResItem }) => {
  return (
    <>
      <ListItem
        key={index}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '5px',
          marginY: '10px',
          bgcolor: index % 2 ? 'white' : '#FAFAFA',
          height: '35px',
          borderRadius: '10px',
          textAlign: 'left',
          width: 'auto',
          zIndex: '1500',
        }}
      >
        <StandardResponseInfo item={itemData} />
        <Box display='inline-flex'>
          <IconButton sx={{ color: '#0E0E0E' }} onClick={() => editResponse(index)}>
            <Tooltip title='Edit' color='primary' placement='bottom'>
              <EditIcon />
            </Tooltip>
          </IconButton>
          <IconButton sx={{ color: '#0E0E0E' }} onClick={() => deleteResItem(index)}>
            <Tooltip title='Delete' color='primary' placement='bottom'>
              <DeleteForeverOutlinedIcon />
            </Tooltip>
          </IconButton>
          <DragHandle />
        </Box>
      </ListItem>
    </>
  )
}

const SortableItem = SortableElement(StandardResponse)

const SortableListContainer = SortableContainer(
  ({
    items,
    editResponse,
    deleteResItem,
  }: {
    items: StandardRes[]
    editResponse: (id: number) => void
    deleteResItem: (id: number) => void
  }) => (
    <List>
      {items.map((item, index) => {
        return (
          <SortableItem
            index={index}
            itemData={item}
            key={index}
            editResponse={editResponse}
            deleteResItem={deleteResItem}
          />
        )
      })}
    </List>
  ),
)

export const EmailStandardResponse: React.FC<EmailStandardResponseProp> = ({
  standardRes,
  modalClose,
  setStandardRes,
  openEditRes,
  deleteResItem,
  onSaveRes,
}) => {
  return (
    <Modal
      open={true}
      onClose={modalClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <form onSubmit={onSaveRes}>
        <Box sx={classes.modalCard}>
          <Box sx={classes.header as Record<string, unknown>}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Subtitle fontWeight='700' sx={{ fontSize: '20px' }}>
                Standard Responses
              </Subtitle>
            </Box>
          </Box>
          <Box sx={classes.content}>
            <SortableListContainer
              items={standardRes}
              editResponse={openEditRes}
              deleteResItem={deleteResItem}
              onSortEnd={({ oldIndex, newIndex }) => {
                const newData = arrayMove(standardRes, oldIndex, newIndex)
                setStandardRes(newData)
              }}
              useDragHandle={true}
              lockAxis='y'
            />
            <Box sx={{ width: '100%', marginTop: '40px' }}>
              <Grid item xs={12}>
                <Button sx={classes.add} style={{ color: 'white' }} onClick={() => openEditRes(-1)}>
                  <Add />
                  Add Response
                </Button>
              </Grid>
            </Box>
            <Box sx={{ width: '100%', marginTop: '50px' }}>
              <SaveCancelComponent isSubmitted={false} handleCancel={modalClose} />
            </Box>
          </Box>
        </Box>
      </form>
    </Modal>
  )
}
