import React from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { REIMBURSEMENT_REQUEST_STATUS_ITEMS } from '@mth/constants'
import { MthColor, ReimbursementRequestStatus } from '@mth/enums'
import { StudentInfoProps } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/ReimbursementRequestView/StudentInfo/type'
import { mthButtonClasses } from '@mth/styles/button.style'
import { gradeText } from '@mth/utils/grade-text.util'

export const StudentInfo: React.FC<StudentInfoProps> = ({ request }) => {
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
          <Button sx={{ ...mthButtonClasses.smallRed, width: '160px' }} data-testid='gradeNotification'>
            5th Grade
          </Button>
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
            defaultValue={request.status}
            borderNone={true}
            setParentValue={() => {}}
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
