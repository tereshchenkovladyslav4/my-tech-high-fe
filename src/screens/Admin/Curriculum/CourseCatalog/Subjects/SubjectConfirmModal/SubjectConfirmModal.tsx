import React from 'react'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { EventType, SubjectConfirmModalProps } from '../types'

const SubjectConfirmModal: React.FC<SubjectConfirmModalProps> = ({
  showArchivedModal,
  setShowArchivedModal,
  showUnarchivedModal,
  setShowUnarchivedModal,
  showDeleteModal,
  setShowDeleteModal,
  handleChangeSubjectStatus,
}) => {
  return (
    <>
      {showArchivedModal && (
        <CustomModal
          title='Archive'
          description='Are you sure you want to archive this Subject?'
          subDescription='All titles under this Subject will also be archived.'
          cancelStr='Cancel'
          confirmStr='Archive'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowArchivedModal(false)
          }}
          onConfirm={() => {
            handleChangeSubjectStatus(EventType.ARCHIVE)
            setShowArchivedModal(false)
          }}
        />
      )}
      {showUnarchivedModal && (
        <CustomModal
          title='Unarchive'
          description='Are you sure you want to unarchive this Subject?'
          subDescription='All titles under this Subject will also be unarchived.'
          cancelStr='Cancel'
          confirmStr='Unarchive'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowUnarchivedModal(false)
          }}
          onConfirm={() => {
            handleChangeSubjectStatus(EventType.UNARCHIVE)
            setShowUnarchivedModal(false)
          }}
        />
      )}
      {showDeleteModal && (
        <CustomModal
          title='Delete'
          description='Are you sure you want to delete this Subject?'
          subDescription='Doing so will remove it from any student’s schedule for this year.'
          cancelStr='Cancel'
          confirmStr='Delete'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowDeleteModal(false)
          }}
          onConfirm={() => {
            handleChangeSubjectStatus(EventType.DELETE)
            setShowDeleteModal(false)
          }}
        />
      )}
    </>
  )
}

export default SubjectConfirmModal
