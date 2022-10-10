import React, { useContext, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Box, Modal } from '@mui/material'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { GRADES } from '@mth/constants'
import { MthColor, ReduceFunds } from '@mth/enums'
import { useProgramYearListBySchoolYearId, useScheduleBuilder, useSubjects } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { createOrUpdateTitleMutation } from '@mth/screens/Admin/Curriculum/CourseCatalog/services'
import { defaultTitleFormData } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/defaultValues'
import TitleForm from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/TitleEdit/TitleForm'
import SaveCancelComponent from '../../Components/SaveCancelComponent/SaveCancelComponent'
import { StateCourseCord, Title, TitleEditProps } from '../types'

const TitleEdit: React.FC<TitleEditProps> = ({
  subjectId,
  schoolYearId,
  schoolYearData,
  item,
  refetch,
  setShowEditModal,
}) => {
  const { me } = useContext(UserContext)

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState<Title>({ ...defaultTitleFormData, subject_id: subjectId })
  const [showGradeError, setShowGradeError] = useState<boolean>(false)
  const [showAltGradeError, setShowAltGradeError] = useState<boolean>(false)
  const [submitSave, {}] = useMutation(createOrUpdateTitleMutation)

  const { checkBoxItems: subjectsItems } = useSubjects(schoolYearId)
  const { gradeList: gradeOptions } = useProgramYearListBySchoolYearId(schoolYearId)
  const { scheduleBuilder } = useScheduleBuilder(me?.selectedRegionId)

  const handleCancel = () => {
    setShowEditModal(false)
  }

  const validationSchema = yup.object({
    subject_id: yup.number().required('Required').moreThan(0, 'Required').nullable(),
    name: yup.string().required('Required').nullable(),
    min_grade: yup.string().required('Required').nullable(),
    max_grade: yup.string().required('Required').nullable(),
    diploma_seeking_path: schoolYearData?.diploma_seeking
      ? yup.string().required('Required').nullable()
      : yup.string().nullable(),
    reduce_funds: yup.string().required('Required').nullable(),
    price: yup
      .number()
      .when('reduce_funds', {
        is: (reduce_funds: ReduceFunds) =>
          reduce_funds == ReduceFunds.TECHNOLOGY_ALLOWANCE || reduce_funds == ReduceFunds.SUPPLEMENTAL_LEARNING_FUNDS,
        then: yup.number().required('Price Required').moreThan(0, 'Should be greater than 0').positive('Price Invaild'),
      })
      .nullable(),
    reduce_funds_notification: yup
      .string()
      .when('reduce_funds', {
        is: (reduce_funds: ReduceFunds) =>
          reduce_funds == ReduceFunds.TECHNOLOGY_ALLOWANCE || reduce_funds == ReduceFunds.SUPPLEMENTAL_LEARNING_FUNDS,
        then: yup.string().required('Required').min(9, 'Invalid').nullable(),
      })
      .nullable(),
    custom_built_description: yup
      .string()
      .when('custom_built', {
        is: true,
        then: yup.string().required('Required').min(9, 'Invalid').nullable(),
      })
      .nullable(),
    subject_notification: yup
      .string()
      .when('display_notification', {
        is: true,
        then: yup.string().required('Required').min(9, 'Invalid').nullable(),
      })
      .nullable(),
    course_id: yup
      .string()
      .when('launchpad_course', {
        is: true,
        then: yup.string().required('Required').nullable(),
      })
      .nullable(),
  })

  const onSave = async (value: Title) => {
    const grades = [
      value?.min_grade,
      value?.max_grade,
      value?.min_alt_grade || Number.NEGATIVE_INFINITY.toString(),
      value?.max_alt_grade || Number.POSITIVE_INFINITY.toString(),
    ].map((item) => (item?.startsWith('K') ? 0 : +item))

    // Check grades
    if (grades[0] >= grades[1]) {
      setShowGradeError(true)
      return
    }
    // Check alternative grades
    if (grades[2] >= grades[3]) {
      setShowAltGradeError(true)
      return
    }
    setIsSubmitted(true)

    await submitSave({
      variables: {
        createTitleInput: {
          title_id: Number(value.title_id),
          subject_id: Number(value.subject_id),
          name: value.name,
          min_grade: value.min_grade,
          max_grade: value.max_grade,
          min_alt_grade: value.min_alt_grade,
          max_alt_grade: value.max_alt_grade,
          diploma_seeking_path: value.diploma_seeking_path,
          reduce_funds: value.reduce_funds,
          price: value.price,
          always_unlock: value.always_unlock,
          custom_built: value.custom_built,
          third_party_provider: value.third_party_provider,
          split_enrollment: value.split_enrollment,
          software_reimbursement: value.software_reimbursement,
          display_notification: value.display_notification,
          launchpad_course: value.launchpad_course,
          course_id: value.course_id,
          reduce_funds_notification: value.reduce_funds_notification,
          custom_built_description: value.custom_built_description,
          subject_notification: value.subject_notification,
          state_course_codes: JSON.stringify(value.stateCourseCords),
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
    if (item?.title_id) {
      const originalCords: StateCourseCord[] = item.state_course_codes ? JSON.parse(item.state_course_codes) : []
      const stateCourseCords: StateCourseCord[] = GRADES.map((_item, index) => {
        const stateCourseCord = originalCords.find((x) => x?.gradeIndex == index)
        return {
          gradeIndex: index,
          stateCode: stateCourseCord?.stateCode || '',
          teacher: stateCourseCord?.teacher || '',
        }
      })
      setInitialValues({ ...item, stateCourseCords, diploma_seeking: schoolYearData?.diploma_seeking })
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
          width: '1180px',
          height: 'auto',
          bgcolor: MthColor.WHITE,
          borderRadius: 2,
          p: 6,
        }}
      >
        <Box
          sx={{
            maxHeight: '90vh',
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
              <TitleForm
                schoolYearData={schoolYearData}
                subjectsItems={subjectsItems}
                gradeOptions={gradeOptions}
                scheduleBuilder={scheduleBuilder}
              />
              <Box sx={{ mt: 6 }} />
              <SaveCancelComponent isSubmitted={isSubmitted} handleCancel={handleCancel} />
            </Form>
          </Formik>
        </Box>
        {showGradeError && (
          <WarningModal
            title='Error'
            subtitle='The Minimum Grade Level must be less than the Maximum Grade Level.'
            btntitle='Ok'
            handleModem={() => setShowGradeError(false)}
            handleSubmit={() => setShowGradeError(false)}
            textCenter={true}
          />
        )}
        {showAltGradeError && (
          <WarningModal
            title='Error'
            subtitle='The Minimum Alternative Grade Level must be less than the Maximum Alternative Grade Level.'
            btntitle='Ok'
            handleModem={() => setShowAltGradeError(false)}
            handleSubmit={() => setShowAltGradeError(false)}
            textCenter={true}
          />
        )}
      </Box>
    </Modal>
  )
}

export default TitleEdit
