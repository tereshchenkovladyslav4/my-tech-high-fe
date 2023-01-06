import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Box, Button, Modal } from '@mui/material'
import { Form, Formik } from 'formik'
import { Prompt } from 'react-router-dom'
import * as yup from 'yup'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { DropDownItem } from '@mth/components/DropDown/types'
import { MthColor, MthTitle } from '@mth/enums'
import { updateResourceRequestMutation } from '@mth/graphql/mutation/resource-request'
import { ResourceRequest } from '@mth/models'
import ResourceRequestForm from '@mth/screens/Admin/ResourceRequests/ResourceRequestEdit/ResourceRequestForm'
import { ResourceRequestEditVM } from '@mth/screens/Admin/ResourceRequests/ResourceRequestEdit/type'
import { mthButtonClasses } from '@mth/styles/button.style'

export type ResourceRequestEditProps = {
  item: ResourceRequest
  refetch: () => void
  setShowEditModal: (value: boolean) => void
}

const ResourceRequestEdit: React.FC<ResourceRequestEditProps> = ({ item, refetch, setShowEditModal }) => {
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false)
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false)
  const [initialValues] = useState<ResourceRequestEditVM>({
    firstName: item.Student?.person?.first_name || '',
    lastName: item.Student?.person?.last_name || '',
    vendor: 'Adobe',
    resourceLevel: item.resource_level_id,
    username: item.Resource?.std_user_name || '',
    password: item.Resource?.std_password || '',
  })
  const [resourceLevels, setResourceLevels] = useState<DropDownItem[]>([])
  const [submitSave, {}] = useMutation(updateResourceRequestMutation)

  const handleCancel = () => {
    if (isChanged) {
      setShowCancelModal(true)
    } else {
      setShowEditModal(false)
    }
  }

  const validationSchema = yup.object({})

  const onSave = async (value: ResourceRequestEditVM) => {
    setIsSubmitted(true)

    await submitSave({
      variables: {
        updateResourceRequestInput: {
          id: item.id,
          resource_id: item.resource_id,
          resource_level_id: value.resourceLevel,
          username: value.username,
          password: value.password,
        },
      },
    })
      .then(() => {
        setIsSubmitted(false)
        setIsChanged(false)
        refetch()
        setShowEditModal(false)
      })
      .catch(() => {
        setIsSubmitted(false)
      })
  }

  useEffect(() => {
    if (item?.Resource?.ResourceLevels?.length) {
      setResourceLevels(
        item?.Resource?.ResourceLevels.map((x) => {
          return { label: x.name, value: x.resource_level_id }
        }),
      )
    }
  }, [item])

  return (
    <Modal
      open={true}
      aria-labelledby='child-modal-title'
      disableAutoFocus={true}
      aria-describedby='child-modal-description'
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '580px',
          height: 'auto',
          backgroundColor: MthColor.WHITE,
          borderRadius: 2,
          p: 6,
        }}
      >
        <Box
          sx={{
            maxHeight: '80vh',
            overflow: 'auto',
            p: 1,
          }}
        >
          <Prompt
            when={isChanged}
            message={JSON.stringify({
              header: MthTitle.UNSAVED_TITLE,
              content: MthTitle.UNSAVED_DESCRIPTION,
            })}
          />
          <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={onSave}
          >
            <Form>
              <ResourceRequestForm setIsChanged={setIsChanged} resourceLevels={resourceLevels} />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Button sx={{ ...mthButtonClasses.roundSmallGray, width: '160px' }} onClick={() => handleCancel()}>
                  Cancel
                </Button>
                <Button
                  sx={{ ...mthButtonClasses.roundSmallDark, width: '160px', ml: 5 }}
                  type='submit'
                  disabled={isSubmitted}
                >
                  Save
                </Button>
              </Box>
            </Form>
          </Formik>
          {showCancelModal && (
            <CustomModal
              title='Cancel Changes'
              description='Are you sure you want to cancel changes made?'
              cancelStr='Cancel'
              confirmStr='Yes'
              backgroundColor={MthColor.WHITE}
              onClose={() => {
                setShowCancelModal(false)
              }}
              onConfirm={() => {
                setShowCancelModal(false)
                setIsChanged(false)
                setShowEditModal(false)
              }}
            />
          )}
          {showLeaveModal && (
            <CustomModal
              title={MthTitle.UNSAVED_TITLE}
              description={MthTitle.UNSAVED_DESCRIPTION}
              cancelStr='Cancel'
              confirmStr='Yes'
              backgroundColor={MthColor.WHITE}
              onClose={() => {
                setShowLeaveModal(false)
              }}
              onConfirm={() => {
                setShowLeaveModal(false)
                setIsChanged(false)
                setShowEditModal(false)
              }}
            />
          )}
        </Box>
      </Box>
    </Modal>
  )
}

export default ResourceRequestEdit
