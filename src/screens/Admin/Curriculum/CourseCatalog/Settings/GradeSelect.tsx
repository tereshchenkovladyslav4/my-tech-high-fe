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
              <Paragraph size='large' fontWeight='500' sx={{ marginLeft: 5, fontSize: '19.8627px' }}>
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
              <Paragraph size='large' fontWeight='500' sx={{ marginLeft: 5, fontSize: '19.8627px' }}>
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
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          marginX: 'auto',
          paddingY: '10px',
          textAlign: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          '& .MuiPaper-rounded': {
            borderRadius: '20px',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 'bold',
            mt: 4,
            px: 6,
            textAlign: 'left',
          }}
        >
          {'Grades'}
        </DialogTitle>
        <Box>
          <FormGroup
            sx={{
              marginLeft: 6,
              marginRight: '150px',
              marginBottom: '40px',
            }}
          >
            {renderGradeList()}
          </FormGroup>
        </Box>
        <DialogActions
          sx={{
            justifyContent: 'center',
            marginBottom: 2,
          }}
        >
          <Button
            variant='contained'
            sx={{
              borderRadius: 15,
              textTransform: 'none',
              height: 29,
              color: 'white',
              width: '92px',
              background: MthColor.BUTTON_RED_GRADIENT,
              marginRight: 3,
              '&:hover': {
                background: '#D23C33',
              },
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            sx={{
              background: MthColor.BUTTON_LINEAR_GRADIENT,
              color: 'white',
              width: '92px',
              borderRadius: 15,
              textTransform: 'none',
              fontWeight: 700,
              height: 29,
              '&:hover': {
                background: '#4145FF',
              },
            }}
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
