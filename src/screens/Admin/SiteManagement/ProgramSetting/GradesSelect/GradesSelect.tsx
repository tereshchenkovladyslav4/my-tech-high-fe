import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Stack,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material'
import { map } from 'lodash'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { renderGrades } from '@mth/utils'
import { GRADES, MTHBLUE } from '../../../../../utils/constants'
import { toOrdinalSuffix } from '../../../../../utils/stringHelpers'
import { siteManagementClassess } from '../../styles'
import { ProgramSettingChanged } from '../types'

export type GradesSelectProps = {
  grades: string
  setGrades: (value: string) => void
  setIsChanged?: (value: ProgramSettingChanged) => void
  isChanged?: ProgramSettingChanged
}

export const GradesSelect: React.FC<GradesSelectProps> = ({ grades, setGrades, setIsChanged, isChanged }) => {
  const [open, setOpen] = useState<boolean>(false)
  const [gradesArr, setGradesArr] = useState<string[]>([])

  useEffect(() => {
    if (grades != undefined && grades != '') {
      setGradesArr(grades.split(','))
    } else {
      setGradesArr([])
    }
  }, [grades])
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = () => {
    setOpen(false)
    let gradesStr = ''
    gradesArr.forEach((element) => {
      if (gradesStr == '') {
        gradesStr = element
      } else {
        gradesStr += ',' + element
      }
    })
    setGrades(gradesStr)
    if (setIsChanged && isChanged)
      setIsChanged({
        ...isChanged,
        grades: true,
      })
  }

  const handleChangeGrades = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gradesArr.includes(e.target.value)) {
      setGradesArr(gradesArr.filter((item) => item !== e.target.value).filter((item) => item !== 'all'))
    } else {
      setGradesArr([...gradesArr, e.target.value])
    }
  }

  const renderGradeList = () =>
    map(GRADES, (grade, index) => {
      if (typeof grade !== 'string') {
        return (
          <FormControlLabel
            key={index}
            sx={{ height: 40 }}
            control={
              <Checkbox checked={gradesArr.includes(grade.toString())} value={grade} onChange={handleChangeGrades} />
            }
            label={
              <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px', fontSize: '19.8627px' }}>
                {`${toOrdinalSuffix(grade)} Grade`}
              </Paragraph>
            }
          />
        )
      } else {
        return (
          <FormControlLabel
            key={index}
            sx={{ height: 40 }}
            control={<Checkbox checked={gradesArr.includes(grade)} value={grade} onChange={handleChangeGrades} />}
            label={
              <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px', fontSize: '19.8627px' }}>
                {grade}
              </Paragraph>
            }
          />
        )
      }
    })

  return (
    <>
      <Box sx={siteManagementClassess.gradeBox}>
        <Stack direction='row' sx={{ ml: 1.5, cursor: 'pointer' }} alignItems='center' onClick={handleClickOpen}>
          <Subtitle size={12} color={MTHBLUE} fontWeight='500'>
            {grades ? renderGrades(grades) : 'Select'}
          </Subtitle>
        </Stack>
      </Box>
      <Dialog open={open} onClose={handleClose} sx={siteManagementClassess.gradesDialog}>
        <DialogTitle sx={siteManagementClassess.dialogTitle}>{'Grades'}</DialogTitle>
        <Box>
          <FormGroup sx={siteManagementClassess.formGroup}>{renderGradeList()}</FormGroup>
        </Box>
        <DialogActions sx={siteManagementClassess.dialogAction}>
          <Button variant='contained' sx={siteManagementClassess.cancelButton} onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='contained' sx={siteManagementClassess.submitButton} onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
