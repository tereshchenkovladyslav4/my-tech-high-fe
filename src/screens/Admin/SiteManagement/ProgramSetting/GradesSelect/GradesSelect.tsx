import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Button, 
  FormControlLabel, 
  FormGroup,
  Checkbox, 
  Typography, 
  Stack, 
  Dialog, 
  DialogTitle, 
  DialogActions 
} from '@mui/material'
import { map } from 'lodash'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { GRADES, MTHBLUE } from '../../../../../utils/constants'
import { toOrdinalSuffix } from '../../../../../utils/stringHelpers'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { useStyles } from '../../styles'

export type GradesSelectProps = {
  grades: string
  setGrades: (value: string) => void
  setIsChanged: (value: boolean) => void
}

export default function GradesSelect({ grades, setGrades, setIsChanged }: GradesSelectProps) {
  const classes = useStyles
  const [open, setOpen] = useState<boolean>(false)
  const [gradesArr, setGradesArr] = useState<[]>([])

  useEffect(() => {
    if (grades != undefined && grades != '') {
      setGradesArr(grades.split(','))
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
    setIsChanged(true)
  }

  const handleChangeGrades = (e) => {
    if (gradesArr.includes(e.target.value)) {
      setGradesArr(gradesArr.filter((item) => item !== e.target.value).filter((item) => item !== 'all'))
    } else {
      setGradesArr([...gradesArr, e.target.value])
    }
  }

  const renderGrades = () =>
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
                {`${toOrdinalSuffix( grade, )} Grade`}
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
    <Stack direction='row' spacing={1} alignItems='center' sx={{ my: 2 }}>
      <Subtitle size={16} fontWeight='600' textAlign='left' sx={{ minWidth: 150 }}>
        Grades
      </Subtitle>
      <Typography>|</Typography>
      <Box>
        <Stack direction='row' sx={{ ml: 1.5, cursor: 'pointer' }} alignItems='center' onClick={handleClickOpen}>
          <Subtitle size={12} color={MTHBLUE} fontWeight='500'>
            {grades ? grades : 'Select'}
          </Subtitle>
        </Stack>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          marginX: 'auto',
          paddingY: '10px',
          borderRadius: 10,
          textAlign: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 'bold',
            marginTop: '10px',
            textAlign: 'left'
          }}
        >
          {'Grades'}
        </DialogTitle>
        <Box>
          <FormGroup sx={{ marginLeft: '24px', marginRight: '150px', marginBottom: '40px'}}>
            {renderGrades()}
          </FormGroup>
        </Box>
        <DialogActions
          sx={{
            justifyContent: 'center',
            marginBottom: 2,
          }}
        >
          <Button variant='contained' sx={classes.cancelButton} onClick={handleClose} >
            Cancel
          </Button>
          <Button variant='contained' sx={classes.submitButton} onClick={handleSave} >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
