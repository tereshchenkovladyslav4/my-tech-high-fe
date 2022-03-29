import React, { useState } from 'react'
import { ProfileContext } from './ProfileContext'
import { Modal, Box, Button } from '@mui/material'
import { UserProfile } from '../../screens/Admin/UserProfile/UserProfile'
export const ProfileProvider = ({ children }) => {
  const [store, setStore] = useState(false)
  const [open, setOpen] = useState(false)
  const [data, setData] = useState()
  const profileContext = React.useMemo(
    () => ({
      store,
      setStore,
      hideModal: () => {},
      showModal: (data) => {
        setData(data)
        setOpen(true)
      },
    }),
    [store],
  )
  const handelClose = () => {
    setOpen(false)
    setStore(false)
  }
  return (
    <ProfileContext.Provider value={profileContext}>
      {open && (
        <Modal
          open={true}
          onClose={() => handelClose()}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box>
            <UserProfile handleClose={handelClose} data={data} />
          </Box>
        </Modal>
      )}
      {children}
    </ProfileContext.Provider>
  )
}
