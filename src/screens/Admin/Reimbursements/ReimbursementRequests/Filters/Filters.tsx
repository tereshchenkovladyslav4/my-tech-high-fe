import React, { useEffect, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Button, Grid } from '@mui/material'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
import { PageBlock } from '@mth/components/PageBlock'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { REIMBURSEMENT_FORM_TYPE_ITEMS, REIMBURSEMENT_REQUEST_STATUS_ITEMS } from '@mth/constants'
import { MthColor, ReimbursementRequestType } from '@mth/enums'
import { useProgramYearListBySchoolYearId } from '@mth/hooks'
import { defaultStatusFilter } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/defaultValues'
import { FiltersProps } from '@mth/screens/Admin/Reimbursements/ReimbursementRequests/Filters/type'
import { mthButtonClasses } from '@mth/styles/button.style'

export const Filters: React.FC<FiltersProps> = ({ schoolYearId, setFilter }) => {
  const [expanded, setExpanded] = useState<boolean>(true)
  const [requests, setRequests] = useState<string[]>([])
  const [types, setTypes] = useState<string[]>([])
  const [others, setOthers] = useState<string[]>([])
  const [statuses, setStatuses] = useState<string[]>(defaultStatusFilter)
  const [grades, setGrades] = useState<string[]>([])

  const { gradeList: gradeItems } = useProgramYearListBySchoolYearId(schoolYearId)

  const requestItems: CheckBoxListVM[] = [
    { label: 'Direct Order', value: ReimbursementRequestType.DIRECT_ORDER.toString() },
    { label: 'Reimbursement', value: ReimbursementRequestType.REIMBURSEMENT.toString() },
  ]

  const typeItems: CheckBoxListVM[] = REIMBURSEMENT_FORM_TYPE_ITEMS as CheckBoxListVM[]

  const otherItems: CheckBoxListVM[] = [
    { label: 'Family', value: 'Family' },
    { label: 'Grade Requirement', value: 'Grade_Requirement' },
  ]

  const statusItems: CheckBoxListVM[] = REIMBURSEMENT_REQUEST_STATUS_ITEMS as CheckBoxListVM[]

  const handleFilter = () => {
    setFilter({ requests, types, others, statuses, grades })
  }

  const handleClear = () => {
    setRequests([])
    setTypes([])
    setOthers([])
    setStatuses([])
    setGrades([])
    setFilter({})
  }

  useEffect(() => {
    setGrades((gradeItems || []).map((item) => item.value).concat(['all']))
  }, [gradeItems])

  return (
    <PageBlock>
      <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={() => setExpanded(!expanded)}>
        <Subtitle fontWeight='700' color={MthColor.MTHBLUE} sx={{ cursor: 'pointer', mr: 1, fontSize: '20px' }}>
          Filter
        </Subtitle>
        <ExpandMoreIcon
          sx={{
            color: MthColor.MTHBLUE,
            verticalAlign: 'bottom',
            cursor: 'pointer',
            transform: expanded ? '' : 'rotate(180deg)',
            transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          }}
        />
      </Box>
      {expanded && (
        <Grid container sx={{ textAlign: 'left', marginY: '12px' }}>
          <Grid item container columnSpacing={4} xs={10}>
            <Grid item>
              <MthCheckboxList
                title='Request'
                checkboxLists={requestItems}
                values={requests}
                setValues={setRequests}
                labelSx={{ fontSize: '14px' }}
                haveSelectAll={false}
              />
              <MthCheckboxList
                title='Type'
                checkboxLists={typeItems}
                values={types}
                setValues={setTypes}
                labelSx={{ fontSize: '14px' }}
                haveSelectAll={false}
              />
              <MthCheckboxList
                title='Other'
                checkboxLists={otherItems}
                values={others}
                setValues={setOthers}
                labelSx={{ fontSize: '14px' }}
                haveSelectAll={false}
              />
            </Grid>
            <Grid item>
              <MthCheckboxList
                title='Status'
                checkboxLists={statusItems}
                values={statuses}
                setValues={setStatuses}
                labelSx={{ fontSize: '14px' }}
                haveSelectAll={false}
              />
            </Grid>
            <Grid item>
              <MthCheckboxList
                title='Grade Level'
                checkboxLists={gradeItems}
                values={grades}
                setValues={setGrades}
                labelSx={{ fontSize: '14px' }}
                haveSelectAll={true}
              />
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <Box
              sx={{
                display: 'flex',
                height: '100%',
                justifyContent: 'end',
                alignItems: 'end',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ flexDirection: 'column', display: 'flex' }}>
                <Button sx={{ ...mthButtonClasses.xsPrimary, width: '140px' }} onClick={handleFilter}>
                  Filter
                </Button>
                <Button sx={{ ...mthButtonClasses.xsRed, width: '140px', mt: 3 }} onClick={handleClear}>
                  Clear All
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
    </PageBlock>
  )
}
