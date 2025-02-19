import React, { useState } from 'react'
import { Modal, Box } from '@mui/material'
import { MthColor, MthTitle } from '@mth/enums'
import { CustomModal } from '../../screens/Admin/SiteManagement/EnrollmentSetting/components/CustomModal/CustomModals'
import { UserProfile } from '../../screens/Admin/UserProfile/UserProfile'
import { ProfileContext } from './ProfileContext'

type RefetchType = () => void

export const ProfileProvider: React.FC = ({ children }) => {
  const [store, setStore] = useState(false)
  const [open, setOpen] = useState(false)
  const [isChanged, setIsChanged] = useState(false)
  const [data, setData] = useState()
  const [refetch, setRefetch] = useState<RefetchType>(() => () => {})
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const profileContext = React.useMemo(
    () => ({
      store,
      setStore,
      hideModal: () => {},
      showModal: (data, refetch: RefetchType = () => () => {}) => {
        setData(data)
        setRefetch(() => () => refetch())
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
      refetch()
    } else if (isChanged) {
      setShowConfirmModal(true)
    } else {
      setOpen(false)
      setStore(false)
      setIsChanged(false)
      refetch()
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
          title={MthTitle.UNSAVED_TITLE}
          description={MthTitle.UNSAVED_DESCRIPTION}
          cancelStr='Cancel'
          confirmStr='Yes'
          backgroundColor={MthColor.WHITE}
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
