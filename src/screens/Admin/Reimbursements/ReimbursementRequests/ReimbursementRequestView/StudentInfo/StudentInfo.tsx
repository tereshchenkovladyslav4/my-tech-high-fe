import React from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useFlag } from '@unleash/proxy-client-react'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { EPIC_1396_STORY_1486, EPIC_1396_STORY_1568, REIMBURSEMENT_REQUEST_STATUS_ITEMS } from '@mth/constants'
import { MthColor, MthRoute, ReimbursementRequestStatus } from '@mth/enums'
import { StudentInfoProps } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/ReimbursementRequestView/StudentInfo/type'
import { mthButtonClasses } from '@mth/styles/button.style'
import { gradeText } from '@mth/utils/grade-text.util'

export const StudentInfo: React.FC<StudentInfoProps> = ({
  request,
  requestStatus,
  handleChangeRequestStatus,
  setIsChanged,
}) => {
  const epic1396story1486 = useFlag(EPIC_1396_STORY_1486)
  const epic1396story1568 = useFlag(EPIC_1396_STORY_1568)

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ fontSize: '18px', fontWeight: '700', color: MthColor.MTHBLUE }} data-testid='studentName'>
            {request.Student?.person?.first_name} {request.Student?.person?.last_name}
          </Typography>
          <Typography sx={{ fontSize: '14px', fontWeight: '500' }} data-testid='studentGrade'>
            {gradeText(request.Student)}
          </Typography>
          <Typography
            sx={{ fontSize: '14px', fontWeight: '700', color: MthColor.MTHBLUE, cursor: 'pointer' }}
            data-testid='studentSchedule'
            onClick={() => {
              if (epic1396story1486) {
                window.open(
                  `${MthRoute.ENROLLMENT_SCHEDULE}/${request.StudentId}?viewonly=${true}&defaultSchoolYear=${
                    request.SchoolYearId
                  }`,
                  '_blank',
                )
              }
            }}
          >
            Schedule
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '20px' }}>
          {!!request.Student?.applications?.[request.Student?.applications?.length - 1]?.midyear_application &&
            request.Student?.applications?.[request.Student?.applications?.length - 1]?.school_year_id ==
              request.SchoolYearId && (
              <Button sx={{ ...mthButtonClasses.smallRed, width: '160px' }} data-testid='midYearNotification'>
                Mid-year Program
              </Button>
            )}
          {epic1396story1568 &&
            request.SchoolYear?.ReimbursementSetting?.notification_grades
              ?.replace('-1', 'Kindergarten')
              .split(',')
              .includes(request.Student?.grade_levels[request.Student?.grade_levels?.length - 1]?.grade_level) && (
              <Button sx={{ ...mthButtonClasses.smallRed, width: '160px' }} data-testid='gradeNotification'>
                {gradeText(request.Student)}
              </Button>
            )}
          <DropDown
            testId='statusDropdown'
            sx={{
              ...mthButtonClasses.smallPrimary,
              width: '160px',
              padding: '0px 8px 0px 8px',
              '& .MuiSelect-select': {
                textAlign: 'right',
                backgroundColor: 'transparent !important',
                color: 'white',
                fontSize: '12px',
              },
              '& .MuiSvgIcon-root': {
                color: 'white !important',
              },
            }}
            dropDownItems={REIMBURSEMENT_REQUEST_STATUS_ITEMS.filter(
              (x) => x.value != ReimbursementRequestStatus.ORDERED,
            )}
            defaultValue={requestStatus}
            borderNone={true}
            setParentValue={(value) => {
              handleChangeRequestStatus(value as ReimbursementRequestStatus)
              setIsChanged(true)
            }}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 3, fontSize: '14px' }}>
        <Typography sx={{ fontSize: '14px', fontWeight: '600', mb: 1 }}>Admin Notes</Typography>
        <TextField
          size='small'
          variant='outlined'
          fullWidth
          value={request.Student?.parent?.notes || ''}
          multiline
          rows={3}
          sx={{}}
          data-testid='adminNote'
        />
      </Box>
    </Box>
  )
}
