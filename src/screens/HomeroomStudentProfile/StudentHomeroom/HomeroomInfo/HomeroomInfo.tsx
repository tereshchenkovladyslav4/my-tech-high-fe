import React from 'react'
import { Avatar, Box, Button, Grid } from '@mui/material'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { PageBlock } from '@mth/components/PageBlock'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { useStudentHomeroomInfo } from '@mth/hooks/useStudentHomeroomInfo'
import { mthButtonClasses } from '@mth/styles/button.style'

type HomeroomInfoProps = {
  studentId: number
  schoolYearItems: DropDownItem[]
  selectedYearId: number
  setSelectedYearId: (value: number) => void
}

const HomeroomInfo: React.FC<HomeroomInfoProps> = ({
  studentId,
  schoolYearItems,
  selectedYearId,
  setSelectedYearId,
}) => {
  const { className, teacherName } = useStudentHomeroomInfo(studentId, selectedYearId)

  return (
    <PageBlock>
      <Grid container rowSpacing={2}>
        <Grid item xs={4} sm={2}>
          <Avatar alt={'Erin'} src={''} sx={{ width: '70px', height: '70px' }} />
        </Grid>
        <Grid item xs={8} sm={7}>
          <Box sx={{ textAlign: 'left' }}>
            <Subtitle sx={{ fontSize: '22px', fontWeight: '700' }}>{className}</Subtitle>
            <Paragraph sx={{ fontSize: '13px', fontWeight: '600', padding: 1 }}>{`Teacher: ${teacherName}`}</Paragraph>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3} sx={{ paddingX: 4 }}>
          <DropDown
            dropDownItems={schoolYearItems}
            placeholder={'Select Year'}
            defaultValue={selectedYearId}
            borderNone={true}
            setParentValue={(val) => {
              setSelectedYearId(Number(val))
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingX: 2 }}>
            <Paragraph sx={{ fontSize: '17px', fontWeight: '700', color: MthColor.MTHBLUE }}>92%</Paragraph>
            <Paragraph sx={{ fontSize: '13px', fontWeight: '600', margin: 'auto' }}>{'1st Semester'}</Paragraph>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingX: 2 }}>
            <Paragraph sx={{ fontSize: '17px', fontWeight: '700', color: MthColor.RED }}>65%</Paragraph>
            <Paragraph sx={{ fontSize: '13px', fontWeight: '600', margin: 'auto' }}>{'2nd Semester'}</Paragraph>
          </Box>
        </Grid>
        <Grid item xs={6} sx={{ paddingX: 2 }}>
          <Button
            sx={{
              ...mthButtonClasses.mthGreen,
              width: '120px',
              height: '27px',
              marginLeft: 'auto',
              paddingX: '44px',
              paddingY: '8px',
            }}
          >
            Launchpad
          </Button>
        </Grid>
      </Grid>
    </PageBlock>
  )
}

export default HomeroomInfo
