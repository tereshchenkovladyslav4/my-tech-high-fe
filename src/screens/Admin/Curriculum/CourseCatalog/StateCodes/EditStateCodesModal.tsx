import React, { FunctionComponent, useEffect } from 'react'
import { Button, Modal, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { mthButtonClasses, mthButtonSizeClasses } from '@mth/styles/button.style'
import { stateCodesClass } from './styles'
import { StateCodeType } from './types'

type EditStateCodesModalProps = {
  onSave: (value: StateCodeType) => void
  onClose: () => void
  selectedStateCodes?: StateCodeType
}

export const EditStateCodesModal: FunctionComponent<EditStateCodesModalProps> = ({
  onSave,
  onClose,
  selectedStateCodes,
}) => {
  const classes = stateCodesClass
  useEffect(() => {
    formik.setFieldValue('teacher', selectedStateCodes?.teacher)
    formik.setFieldValue('stateCode', selectedStateCodes?.stateCode)
  }, [])

  const validationSchema = yup.object({
    teacher: yup.string(),
    stateCode: yup.string(),
  })

  const formik = useFormik({
    initialValues: {
      teacher: '',
      stateCode: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (value) => {
      onSave(value)
    },
  })

  return (
    <Modal
      open={true}
      onClose={() => {
        onClose()
        formik.resetForm()
      }}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={classes.modalCard}>
        <Box sx={classes.flexCenterBetween}>
          <Box>
            <TextField
              name='title_id'
              label='Title ID'
              fullWidth
              defaultValue={selectedStateCodes?.titleId}
              InputLabelProps={{ shrink: true }}
              className='MthFormField'
              disabled
            />
          </Box>
          <Box>
            <TextField
              name='grade'
              label='Grade'
              fullWidth
              defaultValue={selectedStateCodes?.grade}
              InputLabelProps={{ shrink: true }}
              className='MthFormField'
              disabled
            />
          </Box>
        </Box>
        <Box sx={classes.flexCenterBetween}>
          <Box>
            <TextField
              name='stateCode'
              label='State Code'
              fullWidth
              defaultValue={formik.values.stateCode}
              InputLabelProps={{ shrink: true }}
              className='MthFormField'
              onChange={formik.handleChange}
            />
          </Box>
          <Box>
            <TextField
              name='teacher'
              label='Teacher'
              fullWidth
              defaultValue={formik.values.teacher}
              InputLabelProps={{ shrink: true }}
              className='MthFormField'
              onChange={formik.handleChange}
            />
          </Box>
        </Box>
        <Box sx={classes.flexCenterBetween}>
          <Box>
            <TextField
              name='subject'
              label='Subject'
              fullWidth
              defaultValue={selectedStateCodes?.subject}
              InputLabelProps={{ shrink: true }}
              className='MthFormField'
              disabled
            />
          </Box>

          <Box>
            <TextField
              name='titleName'
              label='Title'
              fullWidth
              defaultValue={selectedStateCodes?.titleName}
              InputLabelProps={{ shrink: true }}
              className='MthFormField'
              disabled
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 4,
            width: '100%',
            marginTop: '50px',
          }}
        >
          <Button
            variant='contained'
            color='secondary'
            disableElevation
            sx={{ ...mthButtonClasses.roundGray, ...mthButtonSizeClasses.small, width: 160 }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            disableElevation
            sx={{ ...mthButtonClasses.roundDark, ...mthButtonSizeClasses.small, width: 160 }}
            type='submit'
            onClick={() => formik.handleSubmit()}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
