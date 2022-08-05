import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Card } from '@mui/material'
import { Form, Formik } from 'formik'
import { Prompt } from 'react-router-dom'
import * as yup from 'yup'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { SNOWPACK_PUBLIC_S3_URL, urlRex } from '@mth/constants'
import { ResourceSubtitle } from '@mth/enums'
import { defaultHomeroomFormData } from '../../defaultValues'
import { createOrUpdateResourceMutation } from '../../services'
import { HomeroomResource, HomeroomResourceEditProps } from '../types'
import HeaderComponent from './HeaderComponent'
import HomeroomResourceForm from './HomeroomResourceForm'
import { editHomeroomResourceClassess } from './styles'

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
  const [initialValues, setInitialValues] = useState<HomeroomResource>(defaultHomeroomFormData)
  const [submitSave, {}] = useMutation(createOrUpdateResourceMutation)

  const handleBack = () => {
    if (isChanged) {
      setShowCancelModal(true)
    } else {
      setPage('root')
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
        then: yup.number().required('Price Required').moreThan(0, 'Should be greater than 0').positive('Price Invaild'),
      })
      .nullable(),
    website: yup.string().required('Website Required').matches(urlRex, 'Invalid URL').nullable(),
    grades: yup.string().required('At least one Grade Level must be selected'),
    std_user_name: yup.string().required('Username Required').nullable(),
    std_password: yup.string().required('Password Required').nullable(),
    detail: yup.string().required('Description Required').min(9, 'Invalid Description').nullable(),
    resource_level: yup.string().nullable(),
    resource_limit: yup.number().min(1, 'Limit Required').positive('Limit Invaild').integer('Limit Invaild').nullable(),
    family_resource: yup.boolean().nullable(),
    is_active: yup.boolean().nullable(),
  })

  const uploadPhoto = async (file: File | undefined, stateName: string): Promise<string> => {
    if (file) {
      const bodyFormData = new FormData()
      bodyFormData.append('file', file)
      bodyFormData.append('region', stateName)
      bodyFormData.append('directory', 'resources')

      const response = await fetch(SNOWPACK_PUBLIC_S3_URL, {
        method: 'POST',
        body: bodyFormData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JWT')}`,
        },
      })
      const imageUrl = await response.json()
      return imageUrl.data.file.item1
    } else {
      return ''
    }
  }

  const onSave = async (value: HomeroomResource) => {
    setIsSubmitted(true)
    const imageUrl = await uploadPhoto(value.file, stateName)

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
          std_user_name: value.std_user_name,
          std_password: value.std_password,
          detail: value.detail,
          resource_limit: value.resource_limit || null,
          add_resource_level: value.add_resource_level,
          resource_level: value.resource_level,
          family_resource: value.family_resource,
        },
      },
    })
      .then(() => {
        setIsSubmitted(false)
        setIsChanged(false)
        refetch()
        setPage('root')
      })
      .catch(() => {
        setIsSubmitted(false)
      })
  }

  useEffect(() => {
    if (item?.resource_id) setInitialValues(item)
  }, [item])

  return (
    <Card sx={editHomeroomResourceClassess.cardBody}>
      <Prompt
        when={isChanged ? true : false}
        message={JSON.stringify({
          header: 'Unsaved Changes',
          content: 'Are you sure you want to leave without saving changes?',
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
            setShowCancelModal={setShowCancelModal}
          />
          <HomeroomResourceForm setIsChanged={setIsChanged} />
        </Form>
      </Formik>
      {showCancelModal && (
        <CustomModal
          title='Cancel Changes'
          description='Are you sure you want to cancel changes?'
          cancelStr='No'
          confirmStr='Yes'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowCancelModal(false)
          }}
          onConfirm={() => {
            setShowCancelModal(false)
            setIsChanged(false)
            setPage('root')
          }}
        />
      )}
    </Card>
  )
}

export default HomeroomResourceEdit
