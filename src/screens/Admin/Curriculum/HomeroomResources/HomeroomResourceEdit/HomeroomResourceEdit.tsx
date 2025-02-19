import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Card } from '@mui/material'
import { Form, Formik } from 'formik'
import { Prompt } from 'react-router-dom'
import * as yup from 'yup'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { RICH_TEXT_VALID_MIN_LENGTH } from '@mth/constants'
import { FileCategory, MthColor, MthTitle, ResourceSubtitle } from '@mth/enums'
import { HomeroomResource } from '@mth/models'
import { uploadFile } from '@mth/services'
import { getRegionCode } from '@mth/utils'
import { defaultHomeroomFormData } from '../../defaultValues'
import { createOrUpdateResourceMutation } from '../../services'
import { HeaderComponent } from '../HeaderComponent'
import { HomeroomResourceEditProps, HomeroomResourcePage } from '../types'
import HomeroomResourceForm from './HomeroomResourceForm'
import { editHomeroomResourceClasses } from './styles'

const HomeroomResourceEdit: React.FC<HomeroomResourceEditProps> = ({
  schoolYearId,
  item,
  stateName,
  setPage,
  refetch,
}) => {
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false)
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState<HomeroomResource>(defaultHomeroomFormData)
  const [submitSave, {}] = useMutation(createOrUpdateResourceMutation)

  const handleBack = () => {
    if (isChanged) {
      setShowLeaveModal(true)
    } else {
      setPage(HomeroomResourcePage.ROOT)
    }
  }

  const handleCancel = () => {
    if (isChanged) {
      setShowCancelModal(true)
    } else {
      setPage(HomeroomResourcePage.ROOT)
    }
  }

  const validationSchema = yup.object({
    title: yup.string().required('Title Required').max(100, 'Invalid Title').nullable(),
    image: yup.string().nullable(),
    subtitle: yup.string().required('SubTitle Required').nullable(),
    price: yup
      .number()
      .when('subtitle', {
        is: ResourceSubtitle.PRICE,
        then: yup.number().required('Price Required').moreThan(0, 'Should be greater than 0').positive('Price Invalid'),
      })
      .nullable(),
    grades: yup.string().required('At least one Grade Level must be selected'),
    detail: yup
      .string()
      .required('Description Required')
      .min(RICH_TEXT_VALID_MIN_LENGTH, 'Invalid Description')
      .nullable(),
    resource_limit: yup.number().min(1, 'Limit Invalid').positive('Limit Invalid').integer('Limit Invalid').nullable(),
    ResourceLevels: yup
      .array()
      .when('add_resource_level', {
        is: true,
        then: yup.array().of(
          yup.object().shape({
            limit: yup.number().min(1, 'Limit Invalid').integer('Limit Invalid').nullable(),
            name: yup.string().required('Level Name Required').nullable(),
          }),
        ),
      })
      .nullable(),
    family_resource: yup.boolean().nullable(),
    is_active: yup.boolean().nullable(),
  })

  const onSave = async (value: HomeroomResource) => {
    setIsSubmitted(true)
    const result = await uploadFile(value.file, FileCategory.RESOURCES, getRegionCode(stateName))
    const imageUrl = result?.data?.key || ''

    const resourceLevels = value.ResourceLevels
    resourceLevels.map((item) => (item.resource_level_id = +item.resource_level_id))

    await submitSave({
      variables: {
        createResourceInput: {
          resource_id: Number(value.resource_id),
          SchoolYearId: schoolYearId,
          title: value.title,
          image: imageUrl || value.image,
          subtitle: value.subtitle,
          price: value.subtitle == ResourceSubtitle.PRICE ? value.price : 0,
          website: value.website,
          grades: value.grades,
          std_username_format: value.std_username_format || null,
          std_user_name: value.std_user_name,
          std_password: value.std_password,
          detail: value.detail,
          resource_limit: value.resource_limit || null,
          add_resource_level: value.add_resource_level,
          resourceLevelsStr: JSON.stringify(value.add_resource_level ? resourceLevels : []),
          family_resource: value.family_resource,
          software_reimbursement: value.software_reimbursement,
        },
      },
    })
      .then(() => {
        setIsSubmitted(false)
        setIsChanged(false)
        refetch()
        setPage(HomeroomResourcePage.ROOT)
      })
      .catch(() => {
        setIsSubmitted(false)
      })
  }

  useEffect(() => {
    if (item?.resource_id) setInitialValues(item)
  }, [item])

  return (
    <Card sx={editHomeroomResourceClasses.cardBody}>
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
          <HeaderComponent
            title={'Resources'}
            isSubmitted={isSubmitted}
            handleBack={handleBack}
            handleCancel={handleCancel}
          />
          <HomeroomResourceForm setIsChanged={setIsChanged} schoolYearId={schoolYearId} />
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
            setPage(HomeroomResourcePage.ROOT)
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
            setPage(HomeroomResourcePage.ROOT)
          }}
        />
      )}
    </Card>
  )
}

export default HomeroomResourceEdit
