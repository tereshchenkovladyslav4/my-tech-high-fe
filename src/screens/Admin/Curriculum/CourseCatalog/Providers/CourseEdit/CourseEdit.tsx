import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Box, Modal } from '@mui/material'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import { RICH_TEXT_VALID_MIN_LENGTH } from '@mth/constants'
import { MthColor, ReduceFunds } from '@mth/enums'
import { useProgramYearListBySchoolYearId, useProviders, useResources } from '@mth/hooks'
import CourseForm from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/CourseEdit/CourseForm'
import { defaultCourseFormData } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/defaultValues'
import { createOrUpdateCourseMutation } from '@mth/screens/Admin/Curriculum/CourseCatalog/services'
import { Title } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/types'
import { defaultReduceFunds } from '@mth/utils/default-reduce-funds.util'
import SaveCancelComponent from '../../Components/SaveCancelComponent/SaveCancelComponent'
import { Course, CourseEditProps } from '../types'

const CourseEdit: React.FC<CourseEditProps> = ({
  providerId,
  schoolYearId,
  schoolYearData,
  item,
  refetch,
  setShowEditModal,
}) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState<Course>({ ...defaultCourseFormData, provider_id: providerId })
  const [submitSave, {}] = useMutation(createOrUpdateCourseMutation)

  const { checkBoxItems: providerItems, providers } = useProviders(schoolYearId)
  const { dropdownItems: resourceItems } = useResources(schoolYearId)
  const { numericGradeList: gradeOptions } = useProgramYearListBySchoolYearId(schoolYearId)

  const handleCancel = () => {
    setShowEditModal(false)
  }

  const validationSchema = yup.object({
    provider_id: yup.number().required('Required').moreThan(0, 'Required').nullable(),
    name: yup.string().required('Required').nullable(),
    min_grade: yup.string().required('Required').nullable(),
    max_grade: yup.string().required('Required').nullable(),
    diploma_seeking_path: schoolYearData?.diploma_seeking
      ? yup.string().required('Required').nullable()
      : yup.string().nullable(),
    limit: yup.number().min(1, 'Limit Invalid').positive('Limit Invalid').integer('Limit Invalid').nullable(),
    price: yup
      .number()
      .when('reduce_funds', {
        is: (reduce_funds: ReduceFunds) =>
          reduce_funds == ReduceFunds.TECHNOLOGY || reduce_funds == ReduceFunds.SUPPLEMENTAL,
        then: yup.number().required('Required').positive('Should be greater than 0').nullable(),
      })
      .nullable(),
    reduce_funds_notification: yup
      .string()
      .when('reduce_funds', {
        is: (reduce_funds: ReduceFunds) =>
          reduce_funds == ReduceFunds.TECHNOLOGY || reduce_funds == ReduceFunds.SUPPLEMENTAL,
        then: yup.string().required('Required').min(RICH_TEXT_VALID_MIN_LENGTH, 'Required').nullable(),
      })
      .nullable(),
    course_notification: yup
      .string()
      .when('display_notification', {
        is: true,
        then: yup.string().required('Required').min(RICH_TEXT_VALID_MIN_LENGTH, 'Required').nullable(),
      })
      .nullable(),
    course_id: yup
      .string()
      .when('launchpad_course', {
        is: true,
        then: yup.string().required('Required').nullable(),
      })
      .nullable(),
    TitleIds: yup.array().min(1, 'Required').required('Required'),
  })

  const onSave = async (value: Course) => {
    setIsSubmitted(true)

    await submitSave({
      variables: {
        createCourseInput: {
          id: Number(value.id),
          provider_id: Number(value.provider_id),
          name: value.name,
          min_grade: value.min_grade,
          max_grade: value.max_grade,
          min_alt_grade: value.min_alt_grade,
          max_alt_grade: value.max_alt_grade,
          always_unlock: value.always_unlock,
          software_reimbursement: value.software_reimbursement,
          display_notification: value.display_notification,
          launchpad_course: value.launchpad_course,
          course_id: value.course_id,
          course_notification: value.course_notification,
          reduce_funds_notification: value.reduce_funds_notification,
          website: value.website,
          diploma_seeking_path: value.diploma_seeking_path,
          limit: value.limit,
          reduce_funds: value.reduce_funds,
          price: value.price || null,
          resource_id: value.resource_id || null,
          titles: value.TitleIds?.join(','),
        },
      },
    })
      .then(() => {
        setIsSubmitted(false)
        refetch()
        setShowEditModal(false)
      })
      .catch(() => {
        setIsSubmitted(false)
      })
  }

  useEffect(() => {
    if (item?.id) {
      setInitialValues({
        ...item,
        TitleIds: (item.Titles || []).map((x: Title) => x.title_id.toString()),
        price: item.price || null,
      })
    } else {
      setInitialValues({
        ...defaultCourseFormData,
        reduce_funds: defaultReduceFunds(schoolYearData),
        provider_id: providerId,
      })
    }
  }, [item, schoolYearData])

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
          width: '1180px',
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
          <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={onSave}
          >
            <Form>
              <CourseForm
                schoolYearId={schoolYearId}
                schoolYearData={schoolYearData}
                providerItems={providerItems}
                resourceItems={resourceItems}
                providers={providers}
                gradeOptions={gradeOptions}
              />
              <Box sx={{ mt: 6 }} />
              <SaveCancelComponent isSubmitted={isSubmitted} handleCancel={handleCancel} />
            </Form>
          </Formik>
        </Box>
      </Box>
    </Modal>
  )
}

export default CourseEdit
