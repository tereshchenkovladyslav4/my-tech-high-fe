import React from 'react'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { CartEventType } from '@mth/enums'
import { HomeroomResourceModalProps } from '../types'

const HomeroomResourceModal: React.FC<HomeroomResourceModalProps> = ({
  showArchivedModal,
  showDeleteModal,
  showAllowModal,
  showDisallowModal,
  showUnarchivedModal,
  showCloneModal,
  setShowCloneModal,
  setShowArchivedModal,
  setShowDeleteModal,
  setShowUnarchivedModal,
  setShowAllowModal,
  setShowDisallowModal,
  handleChangeResourceStatus,
}) => {
  return (
    <>
      {showArchivedModal && (
        <CustomModal
          title='Archive'
          description='All students with an approved request will still be able to access this Resource. Any Direct Deductions for this Resource will remain on the student’s account.'
          subDescription='Are you sure you want to Archive this Resource?'
          cancelStr='Cancel'
          confirmStr='Archive'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowArchivedModal(false)
          }}
          onConfirm={() => {
            handleChangeResourceStatus(CartEventType.ARCHIVE)
            setShowArchivedModal(false)
          }}
        />
      )}
      {showUnarchivedModal && (
        <CustomModal
          title='Unarchive'
          description='Are you sure you want to unarchive this Resource?'
          subDescription='This resource will show again for users.'
          cancelStr='Cancel'
          confirmStr='Unarchive'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowUnarchivedModal(false)
          }}
          onConfirm={() => {
            handleChangeResourceStatus(CartEventType.RESTORE)
            setShowUnarchivedModal(false)
          }}
        />
      )}
      {showAllowModal && (
        <CustomModal
          title='Allow Request'
          description='Are you sure you want to Allow Request for this Resource?'
          cancelStr='Cancel'
          confirmStr='Allow Request'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowAllowModal(false)
          }}
          onConfirm={() => {
            handleChangeResourceStatus(CartEventType.ALLOW_REQUEST)
            setShowAllowModal(false)
          }}
        />
      )}
      {showDisallowModal && (
        <CustomModal
          title='View Only'
          description='Are you sure you want to enable View Only for this Resource?'
          cancelStr='Cancel'
          confirmStr='View Only'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowDisallowModal(false)
          }}
          onConfirm={() => {
            handleChangeResourceStatus(CartEventType.DISALLOW_REQUEST)
            setShowDisallowModal(false)
          }}
        />
      )}
      {showDeleteModal && (
        <CustomModal
          title='Delete'
          description='If there was a Direct Deduction associated with this Resource, &nbsp;&nbsp;&nbsp;&nbsp;it will be removed.'
          subDescription={
            <>
              Once deleted, it cannot be restored.
              <br /> Are you sure you want to delete this Resource?
            </>
          }
          cancelStr='Cancel'
          confirmStr='Delete'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowDeleteModal(false)
          }}
          onConfirm={() => {
            handleChangeResourceStatus(CartEventType.DELETE)
            setShowDeleteModal(false)
          }}
        />
      )}
      {showCloneModal && (
        <CustomModal
          title='Clone Resource'
          description='Are you sure want to clone this resource?'
          cancelStr='Cancel'
          confirmStr='Clone'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowCloneModal(false)
          }}
          onConfirm={() => {
            handleChangeResourceStatus(CartEventType.DUPLICATE)
            setShowCloneModal(false)
          }}
        />
      )}
    </>
  )
}

export default HomeroomResourceModal
