import React, { useState } from 'react'
import { ProfileContext } from './ProfileContext'
import { Modal, Box, Button } from '@mui/material'
import { UserProfile } from '../../screens/Admin/UserProfile/UserProfile'
import CustomModal from '../../screens/Admin/SiteManagement/EnrollmentSetting/components/CustomModal/CustomModals'
export const ProfileProvider = ({ children }) => {
  const [store, setStore] = useState(false)
  const [open, setOpen] = useState(false)
  const [isChanged, setIsChanged] = useState(false)
  const [data, setData] = useState()
  const [showConfirmModal, setShowConfirmModal] = useState(false)
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
  const handelClose = (value) => {
    if (value) {
      setOpen(false)
      setStore(false)
      setIsChanged(false)
    } else if (isChanged) {
      setShowConfirmModal(true)
    } else {
      setOpen(false)
      setStore(false)
      setIsChanged(false)
    }
  }
  return (
    <ProfileContext.Provider value={profileContext}>
      {open && (
        <Modal
          open={true}
          onClose={() => handelClose(false)}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box>
            <UserProfile handleClose={handelClose} data={data} setIsChanged={setIsChanged} />
          </Box>
        </Modal>
      )}
      {showConfirmModal && (
        <CustomModal
          title='Unsaved Changes'
          description='Are you sure you want to leave without saving changes?'
          onClose={() => {
            setShowConfirmModal(false)
          }}
          onConfirm={() => {
            setShowConfirmModal(false)
            setIsChanged(false)
            setOpen(false)
            setStore(false)
          }}
        />
      )}
      {children}
    </ProfileContext.Provider>
  )
}
