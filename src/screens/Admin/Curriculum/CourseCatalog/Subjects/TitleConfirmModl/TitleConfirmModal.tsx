import React from 'react'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { CartEventType } from '@mth/enums'
import { TitleConfirmModalProps } from '../types'

const TitleConfirmModal: React.FC<TitleConfirmModalProps> = ({
  showArchivedModal,
  setShowArchivedModal,
  showUnarchivedModal,
  setShowUnarchivedModal,
  showCloneModal,
  setShowCloneModal,
  showDeleteModal,
  setShowDeleteModal,
  handleChangeTitleStatus,
}) => {
  return (
    <>
      {showArchivedModal && (
        <CustomModal
          title='Archive'
          description='Are you sure you want to archive this Title?'
          cancelStr='Cancel'
          confirmStr='Archive'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowArchivedModal(false)
          }}
          onConfirm={() => {
            handleChangeTitleStatus(CartEventType.ARCHIVE)
            setShowArchivedModal(false)
          }}
        />
      )}
      {showUnarchivedModal && (
        <CustomModal
          title='Unarchive'
          description='Are you sure you want to unarchive this Title?'
          cancelStr='Cancel'
          confirmStr='Unarchive'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowUnarchivedModal(false)
          }}
          onConfirm={() => {
            handleChangeTitleStatus(CartEventType.UNARCHIVE)
            setShowUnarchivedModal(false)
          }}
        />
      )}
      {showDeleteModal && (
        <CustomModal
          title='Delete'
          description='Are you sure you want to delete this Title?'
          subDescription='Doing so will remove it from any student’s schedule for this year.'
          cancelStr='Cancel'
          confirmStr='Delete'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowDeleteModal(false)
          }}
          onConfirm={() => {
            handleChangeTitleStatus(CartEventType.DELETE)
            setShowDeleteModal(false)
          }}
        />
      )}
      {showCloneModal && (
        <CustomModal
          title='Clone Title'
          description='Are you sure you want to clone this Title?'
          cancelStr='Cancel'
          confirmStr='Clone'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowCloneModal(false)
          }}
          onConfirm={() => {
            handleChangeTitleStatus(CartEventType.DUPLICATE)
            setShowCloneModal(false)
          }}
        />
      )}
    </>
  )
}

export default TitleConfirmModal
