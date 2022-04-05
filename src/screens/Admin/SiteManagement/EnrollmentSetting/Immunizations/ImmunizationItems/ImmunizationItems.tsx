import {
  Typography,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ImmunizationsData } from '../Immunizations'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import DehazeIcon from '@mui/icons-material/Dehaze'
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import { useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { deleteImmunizationSetting, updateImmunizationOrderMutation } from '../services'
import { arrayMove } from 'react-sortable-hoc'
import { ErrorOutline, WarningOutlined, WarningRounded } from '@mui/icons-material'

const ImminizationItemInformation: React.FC<{ itemData: ImmunizationsData, settingsEnabled: boolean }> = ({ itemData, settingsEnabled }) => {
  const history = useHistory()

  const enable = itemData.is_enabled && settingsEnabled
  return (
    <Box height='100%' display='inline-flex'>
      <Box sx={{ opacity: !enable ? 0.38 : 1 }} height='100%' display='inline-flex'>
        <Typography display='inline-block' minWidth='155px' component='span'>
          {itemData.title}
        </Typography>
        <Divider sx={{ borderColor: 'black' }} orientation='vertical' flexItem />
        <Typography
          display='inline-block'
          minWidth='95px'
          component='span'
        >
          {itemData.min_grade_level && itemData.max_grade_level && itemData.is_enabled ? `${itemData.min_grade_level || 'N/A'}-${itemData.max_grade_level || 'N/A'}` : 'N/A'}
        </Typography>
        <Divider sx={{ borderColor: 'black' }} orientation='vertical' flexItem />
        <Typography display='inline-block' minWidth='110px' component='span'>
          {itemData.is_enabled ? 'Enabled' : 'Disabled'}
        </Typography>
        <Divider sx={{ borderColor: 'black' }} orientation='vertical' flexItem />
      </Box>
      <IconButton
        onClick={() => history.push(`/site-management/enrollment/immunizations/${itemData.id}`)}
        disabled={!settingsEnabled}
        sx={{
          opacity: !settingsEnabled ? 0.38 : 1
        }}
      >
        <SettingsOutlinedIcon htmlColor={settingsEnabled ? '#4145FF' : 'black'} />
      </IconButton>
    </Box>
  )
}

const DragHandle = SortableHandle(({ disabled }: { disabled: boolean }) => (
  <IconButton disabled={disabled}>
    <DehazeIcon />
  </IconButton>
))

const ImmunizationItem: React.FC<{
  itemData: ImmunizationsData
  index: number
  settingsEnabled: boolean
  refetch: () => void
}> = ({ itemData, index, refetch, settingsEnabled }) => {
  const [deleteImmunizationSettingMutation] = useMutation(deleteImmunizationSetting)
  const [open, setOpen] = React.useState(false)
  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const enabled = itemData.is_enabled && settingsEnabled
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          marginX: 'auto',
          paddingY: '10px',
          borderRadius: 10,
          textAlign: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 'bold',
            marginTop: '10px'
          }}
        >{'Delete Immunization'}</DialogTitle>
        <ErrorOutline sx={{
          fontSize: 50,
          marginBottom: 5,
          marginX: 'auto'
        }} />
        <Typography
          fontWeight="bold"
          sx={{
            marginBottom: 5,
            paddingX: 10
          }}

        >
          {`Are you sure you want to delete ${itemData.title}?`}
        </Typography>
        <DialogActions
          sx={{
            justifyContent: 'space-evenly',
            marginBottom: 2,
          }}
        >
          <Button
            sx={{
              borderRadius: 5,
              bgcolor: '#E7E7E7',
              paddingX: 5,
              '&:hover': { color: 'black' }
            }}
            onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            sx={{
              borderRadius: 5,
              paddingX: 5,
              '&:hover': { color: 'black' }
            }}
            onClick={async () => {
              await deleteImmunizationSettingMutation({ variables: { id: Number(itemData.id) } })
              refetch()
              handleClose()
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ListItem
        key={index}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '5px',
          marginY: '10px',
          marginX: '33px',
          bgcolor: index % 2 ? '#FAFAFA' : 'white',
          height: '35px',
          borderRadius: '10px',
          textAlign: 'center',
          width: 'auto',
        }}
      >
        <ImminizationItemInformation itemData={itemData} settingsEnabled={settingsEnabled} />
        <Box sx={{ opacity: enabled ? 1 : 0.38 }} display='inline-flex'>
          <IconButton disabled={!enabled} onClick={handleClickOpen}>
            <DeleteForeverOutlinedIcon />
          </IconButton>
          <DragHandle disabled={!enabled} />
        </Box>
      </ListItem>
    </>
  )
}

const SortableItem = SortableElement(ImmunizationItem)

const SortableListContainer = SortableContainer(
  ({ items, enabled, refetch }: { items: ImmunizationsData[]; enabled: boolean; refetch: () => void }) => (
    <List>
      {items.map((item, index) => {
        return <SortableItem settingsEnabled={enabled} index={index} itemData={item} refetch={refetch} key={index} />
      })}
    </List>
  ),
)

const ImmunizationItems: React.FC<{ data: ImmunizationsData[]; enabled: boolean; refetch: () => void }> = ({
  data,
  enabled,
  refetch,
}) => {


  const [localData, setLocalData] = useState(
    [...data].sort((first, second) => {
      return first.order - second.order
    }),
  )

  const [updateImmunizationOrder] = useMutation(updateImmunizationOrderMutation)
  useEffect(() => {
    setLocalData(
      [...data].sort((first, second) => {
        return first.order - second.order
      }),
    )
  }, [data])
  return (
    <SortableListContainer
      enabled={enabled}
      items={localData}
      refetch={refetch}
      onSortEnd={({ oldIndex, newIndex }) => {
        const newData = arrayMove(localData, oldIndex, newIndex)
        setLocalData(newData)
        const ids = newData.map((item) => item.id)
        updateImmunizationOrder({ variables: { input: { ids } } })
      }}
      useDragHandle={true}
      lockAxis='y'
    />
  )
}

export { ImmunizationItems as default }
