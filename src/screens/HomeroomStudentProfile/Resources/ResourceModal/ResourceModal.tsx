import React from 'react'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { EventType, ResourceModalProps } from '../types'

const ResourceModal: React.FC<ResourceModalProps> = ({
  showHideModal,
  setShowHideModal,
  handleChangeResourceStatus,
}) => {
  return (
    <>
      {showHideModal && (
        <CustomModal
          title='Hide Resource'
          description={"Hiding this resource will not remove the Direct Deduction from the student's account"}
          cancelStr='Cancel'
          confirmStr='Hide'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowHideModal(false)
          }}
          onConfirm={() => {
            handleChangeResourceStatus(EventType.HIDE)
            setShowHideModal(false)
          }}
        />
      )}
    </>
  )
}

export default ResourceModal
