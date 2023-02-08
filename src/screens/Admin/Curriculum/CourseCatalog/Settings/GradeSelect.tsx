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
  SxProps,
} from '@mui/material'
import { map } from 'lodash'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { GRADES } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { siteManagementClassess } from '@mth/screens/Admin/SiteManagement/styles'
import { renderGrades, toOrdinalSuffix } from '@mth/utils'

export type GradesSelectProps = {
  grades: string
  setGrades: (value: string) => void
  setIsChanged?: (value: boolean) => void
  isChanged?: boolean
  disabled?: boolean
  sx?: SxProps
}

export const GradesSelect: React.FC<GradesSelectProps> = ({
  grades,
  setGrades,
  setIsChanged,
  isChanged,
  disabled,
  sx,
}) => {
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
    if (setIsChanged && isChanged) setIsChanged(true)
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
              <Checkbox
                checked={gradesArr.includes(grade.toString())}
                value={grade}
                onChange={handleChangeGrades}
                sx={{
                  '& svg': {
                    width: 28,
                    height: 28,
                    color: MthColor.SYSTEM_01,
                  },
                }}
              />
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
            control={
              <Checkbox
                checked={gradesArr.includes(grade)}
                value={grade}
                onChange={handleChangeGrades}
                sx={{
                  '& svg': {
                    width: 28,
                    height: 28,
                    color: MthColor.SYSTEM_01,
                  },
                }}
              />
            }
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
      <Box sx={{ m: 1, ...sx }}>
        <Stack
          direction='row'
          sx={{ cursor: disabled ? '' : 'pointer', p: 1 }}
          alignItems='center'
          onClick={disabled ? undefined : handleClickOpen}
        >
          <Subtitle size={12} color={disabled ? MthColor.MTHBLUE_DISABLED : MthColor.MTHBLUE} fontWeight='500'>
            {grades ? `Grades ${renderGrades(grades)}` : 'Select'}
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
