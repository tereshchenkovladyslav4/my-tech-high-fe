import React from 'react'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { EventType, ProviderConfirmModalProps } from '../types'

const ProviderConfirmModal: React.FC<ProviderConfirmModalProps> = ({
  showArchivedModal,
  setShowArchivedModal,
  showUnarchivedModal,
  setShowUnarchivedModal,
  showDeleteModal,
  setShowDeleteModal,
  onConfirm,
}) => {
  return (
    <>
      {showArchivedModal && (
        <CustomModal
          title='Archive'
          description='Are you sure you want to archive this Provider?'
          cancelStr='Cancel'
          confirmStr='Archive'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowArchivedModal(false)
          }}
          onConfirm={() => {
            onConfirm(EventType.ARCHIVE)
            setShowArchivedModal(false)
          }}
        />
      )}
      {showUnarchivedModal && (
        <CustomModal
          title='Unarchive'
          description='Are you sure you want to unarchive this Provider?'
          cancelStr='Cancel'
          confirmStr='Unarchive'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowUnarchivedModal(false)
          }}
          onConfirm={() => {
            onConfirm(EventType.UNARCHIVE)
            setShowUnarchivedModal(false)
          }}
        />
      )}
      {showDeleteModal && (
        <CustomModal
          title='Delete'
          description='Are you sure you want to delete this Provider?'
          subDescription='Doing so will remove it from any student’s schedule for this year.'
          cancelStr='Cancel'
          confirmStr='Delete'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowDeleteModal(false)
          }}
          onConfirm={() => {
            onConfirm(EventType.DELETE)
            setShowDeleteModal(false)
          }}
        />
      )}
    </>
  )
}

export default ProviderConfirmModal
