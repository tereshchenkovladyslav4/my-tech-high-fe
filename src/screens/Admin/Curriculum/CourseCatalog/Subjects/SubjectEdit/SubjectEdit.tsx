import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Box, Modal } from '@mui/material'
import { Form, Formik } from 'formik'
import { Prompt } from 'react-router-dom'
import * as yup from 'yup'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { MthColor, MthTitle } from '@mth/enums'
import { usePeriods } from '@mth/hooks'
import { Period } from '@mth/models'
import { createOrUpdateSubjectMutation } from '@mth/screens/Admin/Curriculum/CourseCatalog/services'
import { defaultSubjectFormData } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/defaultValues'
import SubjectForm from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/SubjectEdit/SubjectForm'
import SaveCancelComponent from '../../Components/SaveCancelComponent/SaveCancelComponent'
import { Subject, SubjectEditProps } from '../types'

const SubjectEdit: React.FC<SubjectEditProps> = ({ schoolYearId, item, subjects, refetch, setShowEditModal }) => {
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false)
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState<Subject>(defaultSubjectFormData)
  const [submitSave, {}] = useMutation(createOrUpdateSubjectMutation)

  const { checkBoxItems: periodsItems } = usePeriods(
    +schoolYearId,
    undefined,
    undefined,
    (item?.Periods || []).reduce((acc: number[], cur: Period) => acc.concat([cur.id]), []),
  )

  const handleCancel = () => {
    if (isChanged) {
      setShowCancelModal(true)
    } else {
      setShowEditModal(false)
    }
  }

  const validationSchema = yup.object({
    name: yup.string().required('Required').nullable(),
  })

  const sortData = (array: Subject[], obj: Subject) => {
    const sortedByName = array.sort((a, b) => a.name.localeCompare(b.name))
    const index = sortedByName.findIndex((item) => item.subject_id === obj.subject_id)
    let pastPriority = 0
    if (index > 0) {
      pastPriority = sortedByName[index - 1].priority ?? 1
    }
    if (!obj?.subject_id) {
      return array.map((item) => {
        if (!item.subject_id) {
          return { ...item, priority: pastPriority + 1 }
        }
        if (item.priority > pastPriority) {
          return { ...item, priority: item.priority + 1 }
        }
        return item
      })
    }

    const objPriority = Number(obj.priority)

    return array.map((item) => {
      if (item.subject_id === obj.subject_id) {
        return { ...item, priority: pastPriority }
      }
      if (item.priority <= pastPriority && item.priority > objPriority) {
        return { ...item, priority: item.priority - 1 }
      }
      return item
    })
  }

  const onSave = async (value: Subject) => {
    setIsSubmitted(true)
    const dataToSave = {
      subject_id: Number(value.subject_id),
      SchoolYearId: +schoolYearId,
      name: value.name,
      periods: value.PeriodIds?.join(','),
      priority: subjects?.find((s) => s.subject_id === Number(value.subject_id))?.priority,
    }

    const sortedData = sortData(
      dataToSave?.subject_id
        ? (subjects ?? []).map((s) => {
            if (s.subject_id === dataToSave?.subject_id) {
              return dataToSave
            }
            return s
          })
        : [...(subjects ?? []), dataToSave],
      dataToSave,
    )
    await submitSave({
      variables: {
        createSubjectInput: sortedData.find((obj) => obj.name.includes(value.name)),
      },
    })
      .then(() => {
        sortedData
          .filter((obj) => !obj.name.includes(value.name))
          .map(async (obj) => {
            await submitSave({
              variables: {
                createSubjectInput: {
                  subject_id: Number(obj.subject_id),
                  priority: obj.priority,
                },
              },
            })
          })
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
    if (item?.subject_id) setInitialValues({ ...item, PeriodIds: item.Periods.map((x) => x.id.toString()) })
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
          width: '530px',
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
              <SubjectForm setIsChanged={setIsChanged} periodsItems={periodsItems} />
              <SaveCancelComponent isSubmitted={isSubmitted} handleCancel={handleCancel} />
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

export default SubjectEdit
