import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import CloseIcon from '@mui/icons-material/Close'
import { Button, Checkbox, FormControlLabel, Grid, Modal } from '@mui/material'
import { Box } from '@mui/system'
import { map } from 'lodash'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { WarningModal } from '../../../../../components/WarningModal/Warning'
import { BUTTON_LINEAR_GRADIENT, RED_GRADIENT } from '../../../../../utils/constants'
import { CreateObserMutation } from '../../services'
import { useStyles } from './styles'
import { NewModalTemplateType, ApolloError } from './types'
export const StudentsModal: NewModalTemplateType = ({ handleModem, students = [], data }) => {
  const classes = useStyles
  const [apolloError, setApolloError] = useState<ApolloError>({
    title: '',
    severity: '',
    flag: false,
  })
  const [selected, setSelected] = useState([])
  const handleChange = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id))
    } else {
      setSelected([...selected, id])
    }
  }

  const [createObser] = useMutation(CreateObserMutation)

  const handleSubmit = async () => {
    if (selected.length === 0) {
      setApolloError({ title: 'Please select students', severity: 'Warning', flag: true })
      return
    }
    await createObser({
      variables: {
        observerInput: {
          parent_id: +data.parent_id,
          student_ids: selected.map((item) => +item),
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          regions: data.regions,
        },
      },
    })
    handleModem(true)
  }

  return (
    <Modal open={true} onClose={() => handleModem()}>
      <Box sx={classes.modalStudentCard}>
        {apolloError.flag && (
          <WarningModal
            handleModem={() => setApolloError({ title: '', severity: '', flag: false })}
            title={apolloError.severity}
            subtitle={apolloError.title}
            btntitle='Close'
            handleSubmit={() => setApolloError({ title: '', severity: '', flag: false })}
          />
        )}
        <Box sx={classes.header}>
          <Subtitle>Select students the Observer has access to</Subtitle>
          <CloseIcon style={classes.close} onClick={() => handleModem()} />
        </Box>
        <Grid container rowSpacing={2}>
          <Grid item xs={12}>
            <Subtitle fontWeight='700' size='large' sx={{ marginBottom: '20px' }}>
              Students
            </Subtitle>
            {map(students, (student, index) => (
              <Grid item xs={12}>
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={selected.includes(student.student_id)}
                      onChange={() => handleChange(student.student_id)}
                    />
                  }
                  label={student.person.first_name + ' ' + student.person.last_name}
                />
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'end',
                height: '100%',
                width: '100%',
              }}
            >
              <Button
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  height: 29,
                  color: 'white',
                  width: '92px',
                  background: RED_GRADIENT,
                  marginRight: 3,
                  '&:hover': {
                    background: '#D23C33',
                    color: '#fff',
                  },
                }}
                onClick={() => handleModem()}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                sx={{
                  background: BUTTON_LINEAR_GRADIENT,
                  color: 'white',
                  width: '92px',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  height: 29,
                }}
              >
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}
