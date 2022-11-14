import React, { useState } from 'react'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Button } from '@mui/material'
import { Box } from '@mui/system'
import moment from 'moment'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, ScheduleStatus } from '@mth/enums'
import { useStudentSchedulePeriodHistories } from '@mth/hooks'
import { ScheduleEditor } from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/ScheduleEditor'
import { ScheduleHistoryData, ScheduleHistoryProps } from './types'

const ScheduleHistory: React.FC<ScheduleHistoryProps> = ({ studentId, schoolYearId }) => {
  const { scheduleDataHistory, setScheduleDataHistory } = useStudentSchedulePeriodHistories(studentId, schoolYearId)
  const [showMore, setShowMore] = useState<boolean>(false)
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false)
  const [selectedScheduleHistoryId, setSelectedScheduleHistoryId] = useState<number>()
  const chevron = (scheduleHistory: ScheduleHistoryData) =>
    !scheduleHistory.isExpand ? (
      <ExpandMoreIcon
        sx={{
          verticalAlign: 'bottom',
          cursor: 'pointer',
          marginLeft: 3,
        }}
        onClick={() => setExpand(scheduleHistory)}
      />
    ) : (
      <ExpandLessIcon
        sx={{
          verticalAlign: 'bottom',
          cursor: 'pointer',
          marginLeft: 3,
        }}
        onClick={() => setExpand(scheduleHistory)}
      />
    )
  const setExpand = (scheduleHistory: ScheduleHistoryData) => {
    setScheduleDataHistory(
      scheduleDataHistory?.map((history) => ({
        ...history,
        isExpand:
          scheduleHistory.scheduleHistoryId == history.scheduleHistoryId ? !scheduleHistory.isExpand : history.isExpand,
      })),
    )
  }

  const handleRestoreVersion = () => {
    if (selectedScheduleHistoryId) {
    }
  }

  return (
    <Box sx={{ paddingX: 2, marginTop: 3, borderTop: '1px solid #eee' }}>
      {scheduleDataHistory?.map((history, index) => {
        if (showMore || (!showMore && index < 5)) {
          return (
            <Box key={index} sx={{ padding: 2, borderBottom: '1px solid #eee' }}>
              <Box display='flex' flexDirection='row'>
                <Subtitle fontWeight='700' sx={{ cursor: 'pointer' }} onClick={() => setExpand(history)}>
                  {`Accepted ${moment(new Date(history.acceptedDate)).format('MM/DD/YY')}`}
                </Subtitle>
                {chevron(history)}
                {history.isExpand && (
                  <Button
                    sx={{ backgroundColor: MthColor.LIGHTGRAY, marginLeft: 'auto', fontWeight: 700 }}
                    onClick={() => {
                      setShowWarningModal(true)
                      setSelectedScheduleHistoryId(history.scheduleHistoryId)
                    }}
                  >
                    Restore Version
                  </Button>
                )}
              </Box>
              {history.isExpand && (
                <ScheduleEditor
                  scheduleData={history.scheduleData}
                  scheduleStatus={ScheduleStatus.ACCEPTED}
                  isAdmin={true}
                  isEditMode={false}
                  setIsChanged={() => {}}
                  setScheduleData={() => {}}
                />
              )}
            </Box>
          )
        } else {
          return <></>
        }
      })}
      {!showMore && (
        <Box sx={{ padding: 2, borderBottom: '1px solid #eee' }}>
          <Subtitle
            fontWeight='700'
            sx={{ cursor: 'pointer', color: MthColor.MTHBLUE, textAlign: 'left' }}
            onClick={() => setShowMore(true)}
          >
            Show More
          </Subtitle>
        </Box>
      )}
      {showWarningModal && (
        <CustomModal
          title={'Warning'}
          description={'Are you sure you want to restore this version?'}
          confirmStr='Yes'
          cancelStr='No'
          onClose={() => {
            setShowWarningModal(false)
          }}
          onConfirm={() => {
            setShowWarningModal(false)
            handleRestoreVersion()
          }}
          backgroundColor='white'
        />
      )}
    </Box>
  )
}

export default ScheduleHistory
