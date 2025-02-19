import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import { Box, Tooltip, Typography } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { MthRoute } from '@mth/enums'
import { deleteAssessmentMutation, saveAssessmentMutation } from '@mth/graphql/mutation/assessment'
import { renderGrades } from '@mth/utils'
import { CustomModal } from '../components/CustomModal/CustomModals'
import { testingPreferenceClasses } from './styles'
import { AssessmentItemProps } from './types'

const AssessmentItem: React.FC<AssessmentItemProps> = ({
  index,
  item,
  setIsDragDisable,
  setSelectedAssessment,
  refetch,
}) => {
  const history = useHistory()
  const [showArchiveOrUnArchiveModal, setShowArchiveOrUnArchiveModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [submitSave, {}] = useMutation(saveAssessmentMutation)
  const [deleteAssessment, {}] = useMutation(deleteAssessmentMutation)

  const handleArchiveOrUnArchiveAssessment = async () => {
    await submitSave({
      variables: {
        assessmentInput: {
          assessment: {
            SchoolYearId: item?.SchoolYearId,
            assessment_id: item?.assessment_id,
            grades: item?.grades,
            information: item?.information,
            priority: item?.priority,
            test_name: item?.test_name,
            is_archived: !item.is_archived,
          },
        },
      },
    })
    refetch()
  }

  const handleDeleteAssessment = async () => {
    await deleteAssessment({
      variables: {
        assessmentId: item.assessment_id,
      },
    })
    refetch()
  }

  return (
    <Box
      sx={{
        ...testingPreferenceClasses.tableCotainer,
        color: item.is_archived ? '#A3A3A4' : '#000',
        background: index % 2 == 0 ? '#FAFAFA' : '',
        textAlign: 'left',
        borderRadius: '8px',
      }}
      draggable='false'
    >
      <Typography
        sx={{ minWidth: '150px' }}
        onMouseOver={() => {
          setIsDragDisable(true)
        }}
      >
        {item.test_name}
      </Typography>
      <Box sx={testingPreferenceClasses.verticalLine}></Box>
      <Typography
        sx={{ minWidth: '300px', paddingLeft: 4 }}
        onMouseOver={() => {
          setIsDragDisable(true)
        }}
      >
        {renderGrades(item.grades)}
      </Typography>
      <Box sx={testingPreferenceClasses.action}>
        {item.is_archived ? (
          <>
            <Tooltip title='Edit' placement='top'>
              <ModeEditIcon
                sx={testingPreferenceClasses.iconCursor}
                fontSize='medium'
                onClick={() => {
                  setSelectedAssessment(item)
                  history.push(`${MthRoute.TESTING_PREFERENCE_PATH}/edit`)
                }}
                onMouseOver={() => {
                  setIsDragDisable(true)
                }}
              />
            </Tooltip>
            <Tooltip title='Unarchive' placement='top'>
              <CallMissedOutgoingIcon
                onClick={() => setShowArchiveOrUnArchiveModal(true)}
                sx={testingPreferenceClasses.iconCursor}
                fontSize='medium'
              />
            </Tooltip>
            <Tooltip title='Delete' placement='top'>
              <DeleteForeverOutlinedIcon
                onClick={() => setShowDeleteModal(true)}
                sx={testingPreferenceClasses.iconCursor}
                fontSize='medium'
              />
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip title='Edit' placement='top'>
              <ModeEditIcon
                sx={testingPreferenceClasses.iconCursor}
                fontSize='medium'
                onClick={() => {
                  setSelectedAssessment(item)
                  history.push(`${MthRoute.TESTING_PREFERENCE_PATH}/edit`)
                }}
                onMouseOver={() => {
                  setIsDragDisable(true)
                }}
              />
            </Tooltip>
            <Tooltip title='Archive' placement='top'>
              <SystemUpdateAltIcon
                sx={testingPreferenceClasses.iconCursor}
                fontSize='medium'
                onClick={() => setShowArchiveOrUnArchiveModal(true)}
                onMouseOver={() => {
                  setIsDragDisable(true)
                }}
              />
            </Tooltip>
            <Tooltip title='Move' placement='top'>
              <MenuIcon
                sx={testingPreferenceClasses.iconCursor}
                onMouseOver={() => {
                  setIsDragDisable(false)
                }}
                fontSize='medium'
              />
            </Tooltip>
          </>
        )}
      </Box>
      {showArchiveOrUnArchiveModal && (
        <CustomModal
          title={item?.is_archived ? 'Unarchive' : 'Archive'}
          description={
            item?.is_archived
              ? 'Are you sure you want to unarchive this assessment? '
              : 'Are you sure you want to archive this assessment?'
          }
          cancelStr='Cancel'
          confirmStr={item?.is_archived ? 'Unarchive' : 'Archive'}
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowArchiveOrUnArchiveModal(false)
          }}
          onConfirm={() => {
            handleArchiveOrUnArchiveAssessment()
            setShowArchiveOrUnArchiveModal(false)
          }}
        />
      )}
      {showDeleteModal && (
        <CustomModal
          title={'Delete'}
          description={'Are you sure you want to delete this assessment?'}
          cancelStr='Cancel'
          confirmStr={'Delete'}
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowDeleteModal(false)
          }}
          onConfirm={() => {
            handleDeleteAssessment()
            setShowDeleteModal(false)
          }}
        />
      )}
    </Box>
  )
}

export default AssessmentItem
