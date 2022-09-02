import React, { useState } from 'react'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import {
  Box,
  Button,
  OutlinedInput,
  Dialog,
  DialogTitle,
  DialogActions,
  Tooltip,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { useFormikContext } from 'formik'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { defaultResourceLevelFormData } from '../../../defaultValues'
import { homeroomResourcesClassess } from '../../styles'
import { HomeroomResource, ResourceLevel } from '../../types'
import { resourceLevelsClassess } from './styles'

type ResourceLevelsProps = {
  setIsChanged: (value: boolean) => void
}

export const ResourceLevels: React.FC<ResourceLevelsProps> = ({ setIsChanged }) => {
  const { errors, setFieldValue, touched, values, setFieldTouched, validateField } =
    useFormikContext<HomeroomResource>()
  const [open, setOpen] = useState<boolean>(false)
  const [limitError, setLimitError] = useState<boolean>(false)
  const [initialResourceLevels, setInitialResourceLevels] = useState<ResourceLevel[]>([])

  const handleClickOpen = () => {
    setInitialResourceLevels(values.ResourceLevels)
    if (!values.ResourceLevels.length) setFieldValue('ResourceLevels', [defaultResourceLevelFormData])
    else setFieldValue('ResourceLevels', values.ResourceLevels)
    setOpen(true)
    setTimeout(() => {
      validateField('ResourceLevels')
    })
  }

  const handleClose = () => {
    setFieldValue('ResourceLevels', initialResourceLevels)
    if (!initialResourceLevels?.length) {
      setFieldValue('add_resource_level', false)
    }
    setOpen(false)
  }

  const validateLimits = (values: ResourceLevel[]): boolean => {
    const inputedCnt = values?.filter((item) => !!item.limit)?.length
    if (inputedCnt && values?.length !== inputedCnt) {
      setLimitError(true)
      return false
    } else {
      setLimitError(false)
    }
    return true
  }

  const handleSave = async () => {
    setFieldTouched('ResourceLevels')
    if (!validateLimits(values.ResourceLevels)) return

    if (!values.ResourceLevels?.length) {
      setFieldValue('add_resource_level', false)
    }
    if (!errors.ResourceLevels) {
      setOpen(false)
    }
  }

  const handleChangeOption = (i: number, field: string, value: string | number | null) => {
    const temp: ResourceLevel[] = [...values.ResourceLevels]
    temp[i] = {
      ...temp[i],
      [field]: value,
    }
    setFieldValue('ResourceLevels', temp)
    validateLimits(temp)
  }

  const handleDeleteOption = (i: number) => {
    const temp = [...values.ResourceLevels]
    temp.splice(i, 1)
    setFieldValue('ResourceLevels', temp)
  }

  const handleAddOption = () => {
    setFieldValue('ResourceLevels', [...values.ResourceLevels, ...[defaultResourceLevelFormData]])
  }

  return (
    <>
      <Tooltip title={values?.family_resource ? 'Remove family resource to enable feature' : ''}>
        <FormControlLabel
          sx={{ height: 30, marginTop: 2 }}
          control={
            <Checkbox
              checked={values?.add_resource_level}
              value={values?.add_resource_level}
              onChange={() => {
                if (!values?.add_resource_level) handleClickOpen()
                setFieldValue('add_resource_level', !values?.add_resource_level)
                setIsChanged(true)
              }}
            />
          }
          label={
            <Paragraph size='large' fontWeight='700' sx={{ marginLeft: '12px' }}>
              Add Resource Levels
            </Paragraph>
          }
          disabled={values?.family_resource}
        />
      </Tooltip>
      {values?.add_resource_level && (
        <Subtitle
          size={16}
          color={MthColor.MTHBLUE}
          fontWeight='700'
          sx={{ cursor: 'pointer', marginTop: 1, marginLeft: '44px' }}
          onClick={() => {
            handleClickOpen()
          }}
        >
          Edit Resource Levels
        </Subtitle>
      )}

      <Dialog open={open} onClose={handleClose} sx={resourceLevelsClassess.gradesDialog}>
        <DialogTitle sx={resourceLevelsClassess.dialogTitle}>Resource Levels</DialogTitle>
        <Box sx={{ padding: '26px', textAlign: 'left' }}>
          <Box sx={{ display: 'flex', marginBottom: '12px', gap: '20px' }}>
            <Paragraph sx={{ flex: 1, fontSize: '20px', fontWeight: '700', minWidth: '120px' }}>Limit</Paragraph>
            <Paragraph sx={{ flex: 2, fontSize: '20px', fontWeight: '700', minWidth: '240px' }}>Level Name</Paragraph>
            <Box sx={{ width: '24px' }}></Box>
          </Box>
          {(values.ResourceLevels || []).map((item, index) => (
            <Box key={index}>
              <Box sx={{ display: 'flex', alignItems: 'end', marginBottom: '12px', gap: '20px' }}>
                <Box sx={{ flex: 1 }}>
                  <Subtitle sx={homeroomResourcesClassess.formError}>
                    {touched.ResourceLevels &&
                      (errors.ResourceLevels?.[index]?.limit || (limitError && !item.limit && 'Required'))}
                  </Subtitle>
                  <Tooltip title={!!values.resource_limit ? 'Remove general limit to enable feature' : ''}>
                    <OutlinedInput
                      size='small'
                      fullWidth
                      placeholder='Limit'
                      type='number'
                      value={item.limit || ''}
                      onChange={(e) => handleChangeOption(index, 'limit', Number(e.target.value) || null)}
                      disabled={!!values.resource_limit}
                      error={
                        touched.ResourceLevels &&
                        (!!errors.ResourceLevels?.[index]?.limit || (limitError && !item.limit))
                      }
                    />
                  </Tooltip>
                </Box>
                <Box sx={{ flex: 2 }}>
                  <Subtitle sx={homeroomResourcesClassess.formError}>
                    {touched.ResourceLevels && errors.ResourceLevels?.[index]?.name}
                  </Subtitle>
                  <OutlinedInput
                    size='small'
                    fullWidth
                    placeholder='Level Name'
                    value={item.name}
                    onChange={(e) => handleChangeOption(index, 'name', e.target.value)}
                    error={touched.ResourceLevels && !!errors.ResourceLevels?.[index]?.name}
                  />
                </Box>
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  className='delete-row'
                  sx={{ cursor: 'pointer', width: '24px', mb: '8px' }}
                >
                  <Tooltip title='Delete' arrow>
                    <DeleteForeverOutlinedIcon onClick={() => handleDeleteOption(index)} />
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          ))}
          <Box sx={{ display: 'flex', gap: '20px' }}>
            <Box sx={{ flex: 1 }}></Box>
            <Box sx={{ flex: 2, display: 'flex' }}>
              <Paragraph
                sx={{ fontSize: '18px', color: MthColor.MTHBLUE, fontWeight: 500, cursor: 'pointer' }}
                onClick={handleAddOption}
              >
                + Add Resource
              </Paragraph>
            </Box>
            <Box sx={{ width: '24px' }}></Box>
          </Box>
        </Box>
        <DialogActions sx={resourceLevelsClassess.dialogAction}>
          <Button variant='contained' sx={resourceLevelsClassess.cancelButton} onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='contained' sx={resourceLevelsClassess.submitButton} onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ResourceLevels
