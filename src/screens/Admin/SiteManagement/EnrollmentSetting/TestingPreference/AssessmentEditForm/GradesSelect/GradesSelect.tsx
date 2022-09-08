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
import { MthColor } from '@mth/enums'
import { toOrdinalSuffix } from '@mth/utils'
import { gradeSelectClassess } from './styles'

export type GradesSelectProps = {
  grades: string
  setGrades: (value: string) => void
  availGrades: (string | number)[]
  setIsChanged: (value: boolean) => void
}

export const GradesSelect: React.FC<GradesSelectProps> = ({ grades, availGrades, setGrades, setIsChanged }) => {
  const [open, setOpen] = useState<boolean>(false)
  const [gradesArr, setGradesArr] = useState<string[]>([])
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
    setIsChanged(true)
  }

  const handleChangeGrades = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gradesArr.includes(e.target.value)) {
      setGradesArr(gradesArr.filter((item) => item !== e.target.value).filter((item) => item !== 'all'))
    } else {
      setGradesArr([...gradesArr, e.target.value])
    }
  }

  const renderGradeList = () =>
    map(availGrades, (grade, index) => {
      if (typeof grade == 'string' && !grade.includes('Kin')) {
        return (
          <FormControlLabel
            key={index}
            sx={{ height: 40 }}
            control={
              <Checkbox checked={gradesArr.includes(grade.toString())} value={grade} onChange={handleChangeGrades} />
            }
            label={
              <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px', fontSize: '19.8627px' }}>
                {`${toOrdinalSuffix(Number(grade))} Grade`}
              </Paragraph>
            }
          />
        )
      } else if (typeof grade == 'string') {
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
      } else {
        return
      }
    })

  const orderGrades = (grades: string): string => {
    let result = ''
    if (grades) {
      const tempArray = grades.split(',')
      if (tempArray.includes('Kindergarten')) {
        result = 'K,'
      }
      result += tempArray
        .filter((item) => !item.includes('Kin'))
        .sort((a: string, b: string) => {
          if (Number(a) > Number(b)) {
            return 1
          } else if (Number(a) < Number(b)) {
            return -1
          }
          return 0
        })
        .join(',')
      return result
    } else {
      result = 'Select'
    }
    return result
  }

  useEffect(() => {
    if (grades != undefined && grades != '') {
      setGradesArr(grades.split(','))
    } else {
      setGradesArr([])
    }
  }, [grades])

  return (
    <>
      <Box sx={gradeSelectClassess.gradeBox}>
        <Stack direction='row' sx={{ cursor: 'pointer' }} alignItems='center' onClick={handleClickOpen}>
          <Subtitle size={12} color={MthColor.MTHBLUE} fontWeight='500'>
            {orderGrades(grades)}
          </Subtitle>
        </Stack>
      </Box>
      <Dialog open={open} onClose={handleClose} sx={gradeSelectClassess.gradesDialog}>
        <DialogTitle sx={gradeSelectClassess.dialogTitle}>{'Grades'}</DialogTitle>
        <Box>
          <FormGroup sx={gradeSelectClassess.formGroup}>{renderGradeList()}</FormGroup>
        </Box>
        <DialogActions sx={gradeSelectClassess.dialogAction}>
          <Button variant='contained' sx={gradeSelectClassess.cancelButton} onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='contained' sx={gradeSelectClassess.submitButton} onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
