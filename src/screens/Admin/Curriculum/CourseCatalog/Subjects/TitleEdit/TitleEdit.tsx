import React, { useContext, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Box, Modal } from '@mui/material'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import { GRADES, RICH_TEXT_VALID_MIN_LENGTH } from '@mth/constants'
import { MthColor, ReduceFunds } from '@mth/enums'
import { useProgramYearListBySchoolYearId, useScheduleBuilder, useSubjects } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import {
  createOrUpdateTitleMutation,
  createStateCodesMutation,
} from '@mth/screens/Admin/Curriculum/CourseCatalog/services'
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
  const [submitSave, {}] = useMutation(createOrUpdateTitleMutation)
  const [createStateCodes] = useMutation(createStateCodesMutation)

  const { checkBoxItems: subjectsItems } = useSubjects(schoolYearId)
  const { numericGradeList: gradeOptions } = useProgramYearListBySchoolYearId(schoolYearId)
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
          reduce_funds == ReduceFunds.TECHNOLOGY || reduce_funds == ReduceFunds.SUPPLEMENTAL,
        then: yup.number().required('Price Required').positive('Should be greater than 0').nullable(),
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
    subject_notification: yup
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
  })
  const onSave = async (value: Title) => {
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
          price: value.price || null,
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
      .then(async (data) => {
        const stateCodes = value.stateCourseCords?.map((codes) => {
          return {
            state_codes_id: item?.StateCodes?.find((code) => Number(code.grade) === codes.gradeIndex)?.state_codes_id,
            TitleId: data?.data.createOrUpdateTitle?.title_id,
            title_name: value.name,
            state_code: codes.stateCode,
            teacher: codes.teacher,
            subject: subjectsItems.find((obj) => Number(obj.value) === Number(value.subject_id))?.label,
            grade: codes.gradeIndex === 0 ? 'K' : codes.gradeIndex.toString(),
          }
        })
        if (stateCodes && stateCodes?.length > 0) {
          await createStateCodes({
            variables: {
              createStateCodesInput: stateCodes,
            },
          })
        }
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
      const originalCords = item?.StateCodes?.map((obj) => {
        if (obj?.grade?.toLowerCase()?.includes('k')) {
          return { ...obj, grade: 0 }
        }
        return obj
      })
      const stateCourseCords: StateCourseCord[] = GRADES.map((_item, index) => {
        const stateCourseCord = originalCords?.find((x) => Number(x?.grade) === index)
        return {
          gradeIndex: index,
          stateCode: stateCourseCord?.state_code || '',
          teacher: stateCourseCord?.teacher || '',
        }
      }).filter((obj) => obj.stateCode || obj.teacher)
      setInitialValues({
        ...item,
        stateCourseCords,
        diploma_seeking: schoolYearData?.diploma_seeking,
        price: item.price || null,
      })
    } else {
      setInitialValues({
        ...defaultTitleFormData,
        subject_id: subjectId,
        show_software_reimbursement: !!schoolYearData?.require_software,
        reduce_funds: schoolYearData?.reimbursements || ReduceFunds.NONE,
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
      </Box>
    </Modal>
  )
}

export default TitleEdit
