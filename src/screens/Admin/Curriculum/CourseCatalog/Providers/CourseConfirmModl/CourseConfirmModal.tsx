import React from 'react'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { CartEventType } from '@mth/enums'
import { CourseConfirmModalProps } from '../types'

const CourseConfirmModal: React.FC<CourseConfirmModalProps> = ({
  showArchivedModal,
  setShowArchivedModal,
  showUnarchivedModal,
  setShowUnarchivedModal,
  showCloneModal,
  setShowCloneModal,
  showDeleteModal,
  setShowDeleteModal,
  onConfirm,
}) => {
  return (
    <>
      {showArchivedModal && (
        <CustomModal
          title='Archive'
          description='Are you sure you want to archive this Course?'
          cancelStr='Cancel'
          confirmStr='Archive'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowArchivedModal(false)
          }}
          onConfirm={() => {
            onConfirm(CartEventType.ARCHIVE)
            setShowArchivedModal(false)
          }}
        />
      )}
      {showUnarchivedModal && (
        <CustomModal
          title='Unarchive'
          description='Are you sure you want to unarchive this Course?'
          cancelStr='Cancel'
          confirmStr='Unarchive'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowUnarchivedModal(false)
          }}
          onConfirm={() => {
            onConfirm(CartEventType.UNARCHIVE)
            setShowUnarchivedModal(false)
          }}
        />
      )}
      {showDeleteModal && (
        <CustomModal
          title='Delete'
          description='Are you sure you want to delete this Course?'
          subDescription='Doing so will remove it from any student’s schedule for this year.'
          cancelStr='Cancel'
          confirmStr='Delete'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowDeleteModal(false)
          }}
          onConfirm={() => {
            onConfirm(CartEventType.DELETE)
            setShowDeleteModal(false)
          }}
        />
      )}
      {showCloneModal && (
        <CustomModal
          title='Clone Course'
          description='Are you sure you want to clone this Course?'
          cancelStr='Cancel'
          confirmStr='Clone'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowCloneModal(false)
          }}
          onConfirm={() => {
            onConfirm(CartEventType.DUPLICATE)
            setShowCloneModal(false)
          }}
        />
      )}
    </>
  )
}

export default CourseConfirmModal
