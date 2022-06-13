import { Box, Card, Checkbox, FormControlLabel, Grid } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { GRADES } from '../../../../../utils/constants'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { map } from 'lodash'
import { toOrdinalSuffix } from '../../../../../utils/stringHelpers'
import { useQuery } from '@apollo/client'
import { GetCurrentSchoolYearByRegionId } from '../../../Announcements/services'
import { UserContext } from '../../../../../providers/UserContext/UserProvider'

type GradeLevelCheckBoxProps = {
  grades: string[]
  setGrades: (value: string[]) => void
}
const GradeLevelCheckBox = ({ grades, setGrades }: GradeLevelCheckBoxProps) => {
  const { me } = useContext(UserContext)
  const [availableGrades, setAvailableGrades] = useState<(string | number)[]>([])
  const schoolYearData = useQuery(GetCurrentSchoolYearByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const handleChangeGrades = (e) => {
    if (grades.includes(e.target.value)) {
      setGrades(grades.filter((item) => item !== e.target.value).filter((item) => item !== 'all'))
    } else {
      let temp = [...grades, e.target.value].filter((item) => !!item)
      if (temp.length == availableGrades.length) {
        setGrades(['all', ...grades, e.target.value].filter((item) => !!item))
      } else {
        setGrades(temp)
      }
    }
  }

  const handleChangeAll = (e) => {
    if (e.target.checked) {
      setGrades([...['all'], ...availableGrades.map((item) => item.toString())])
    } else {
      setGrades([])
    }
  }

  const renderGrades = () =>
    map(availableGrades, (grade, index) => {
      if (typeof grade !== 'string') {
        return (
          <FormControlLabel
            key={index}
            sx={{ height: 30 }}
            control={
              <Checkbox checked={grades.includes(grade.toString())} value={grade} onChange={handleChangeGrades} />
            }
            label={
              <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>{`${toOrdinalSuffix(
                grade,
              )} Grade`}</Paragraph>
            }
          />
        )
      } else {
        return (
          <FormControlLabel
            key={index}
            sx={{ height: 30 }}
            control={<Checkbox checked={grades.includes(grade)} value={grade} onChange={handleChangeGrades} />}
            label={
              <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                {grade}
              </Paragraph>
            }
          />
        )
      }
    })

  useEffect(() => {
    if (schoolYearData?.data?.schoolyear_getcurrent) {
      const availGrades = schoolYearData?.data?.schoolyear_getcurrent?.grades?.split(',').map((item) => {
        if (item == 'Kindergarten') return 'Kindergarten'
        else return Number(item)
      })
      setAvailableGrades(availGrades)
      setGrades([
        ...['all'],
        ...GRADES.map((item) => {
          if (availGrades.includes(item)) {
            return item.toString()
          }
        }),
      ])
    } else {
      setAvailableGrades([])
      setGrades([])
    }
  }, [me?.selectedRegionId, schoolYearData])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Paragraph size='large' fontWeight='700'>
        Grad Level
      </Paragraph>
      <FormControlLabel
        sx={{ height: 30 }}
        control={<Checkbox value='all' checked={grades.includes('all')} onChange={handleChangeAll} />}
        label={
          <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
            Select All
          </Paragraph>
        }
      />
      {renderGrades()}
    </Box>
  )
}

export default GradeLevelCheckBox
