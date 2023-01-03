import React, { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Button, Grid } from '@mui/material'
import moment from 'moment/moment'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
import { PageBlock } from '@mth/components/PageBlock'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, ResourceFeature, ResourceRequestStatus, ResourceSubtitle, StudentStatus } from '@mth/enums'
import { useProviders, useResources } from '@mth/hooks'
import { FiltersProps } from '@mth/screens/Admin/ResourceRequests/Filters/type'
import { mthButtonClasses } from '@mth/styles/button.style'

export const Filters: React.FC<FiltersProps> = ({ schoolYearId, schoolYear, setFilter }) => {
  const [expanded, setExpanded] = useState<boolean>(true)
  const [studentStatuses, setStudentStatuses] = useState<string[]>([])
  const [statuses, setStatuses] = useState<string[]>([])
  const [relations, setRelations] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [types, setTypes] = useState<string[]>([])
  const [resources, setResources] = useState<string[]>([])
  const [courses, setCourses] = useState<string[]>([])

  // TODO relations and courses filter

  const studentStatusItems: CheckBoxListVM[] = [
    { label: 'Pending', value: StudentStatus.PENDING.toString() },
    { label: 'Active', value: StudentStatus.ACTIVE.toString() },
    { label: 'Withdrawn', value: StudentStatus.WITHDRAWN.toString() },
    { label: 'Mid-year', value: StudentStatus.MID_YEAR.toString() },
  ]

  const statusItems: CheckBoxListVM[] = [
    { label: 'Requested', value: ResourceRequestStatus.REQUESTED.toString() },
    { label: 'Accepted', value: ResourceRequestStatus.ACCEPTED.toString() },
    { label: 'Pending Removal', value: ResourceRequestStatus.PENDING_REMOVAL.toString() },
    { label: 'Removed', value: ResourceRequestStatus.REMOVED.toString() },
    { label: 'Waitlist', value: ResourceRequestStatus.WAITLIST.toString() },
  ]

  const relationItems: CheckBoxListVM[] = [
    { label: 'New', value: 'New' },
    { label: 'Returning', value: 'Returning' },
  ]

  const featureItems: CheckBoxListVM[] = [
    { label: 'Limit', value: ResourceFeature.LIMIT.toString() },
    { label: 'Family Resource', value: ResourceFeature.FAMILY_RESOURCE.toString() },
  ]

  const typeItems: CheckBoxListVM[] = [
    { label: 'Included', value: ResourceSubtitle.INCLUDED.toString() },
    { label: 'Free', value: ResourceSubtitle.NONE.toString() },
    { label: 'Cost', value: ResourceSubtitle.PRICE.toString() },
  ]

  const { checkBoxItems: resourceItems } = useResources(schoolYearId)
  const { checkBoxItems: courseItems } = useProviders(schoolYearId)

  const handleFilter = () => {
    setFilter({ studentStatuses, statuses, relations, features, types, resources, courses })
  }
  const handleClear = () => {
    setStudentStatuses([])
    setStatuses([])
    setRelations([])
    setFeatures([])
    setTypes([])
    setResources([])
    setCourses([])
    setFilter({})
  }

  return (
    <PageBlock>
      <Box display='flex' flexDirection='row' onClick={() => setExpanded(!expanded)}>
        <Subtitle fontWeight='700' color={MthColor.MTHBLUE} sx={{ cursor: 'pointer', mr: 1 }}>
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
          <Grid item container columnSpacing={4} xs={4}>
            <Grid item xs={6}>
              <MthCheckboxList
                title={`${moment(schoolYear?.date_begin).format('YYYY')}-${moment(schoolYear?.date_end).format(
                  'YY',
                )} Status`}
                checkboxLists={studentStatusItems}
                values={studentStatuses}
                setValues={setStudentStatuses}
                haveSelectAll={false}
              />
              <MthCheckboxList
                title='Resource Status'
                checkboxLists={statusItems}
                values={statuses}
                setValues={setStatuses}
                haveSelectAll={false}
              />
              <MthCheckboxList
                title='Relation'
                checkboxLists={relationItems}
                values={relations}
                setValues={setRelations}
                haveSelectAll={false}
              />
            </Grid>
            <Grid item xs={6}>
              <MthCheckboxList
                title='Feature'
                checkboxLists={featureItems}
                values={features}
                setValues={setFeatures}
                haveSelectAll={false}
              />
              <MthCheckboxList
                title='Type'
                checkboxLists={typeItems}
                values={types}
                setValues={setTypes}
                haveSelectAll={false}
              />
            </Grid>
          </Grid>
          <Grid item container columnSpacing={4} xs={6}>
            <Grid item xs={6} sx={{ overflowY: 'auto', height: '460px' }}>
              <MthCheckboxList
                title='Homeroom Resource'
                checkboxLists={resourceItems}
                values={resources}
                setValues={setResources}
                haveSelectAll={true}
              />
            </Grid>
            <Grid item xs={6} sx={{ overflowY: 'auto', height: '460px' }}>
              <MthCheckboxList
                title='Provider/Course'
                checkboxLists={courseItems}
                values={courses}
                setValues={setCourses}
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
