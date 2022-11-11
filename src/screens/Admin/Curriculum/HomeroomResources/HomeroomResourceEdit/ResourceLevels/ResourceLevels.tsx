import React, { useState } from 'react'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { Box, Button, OutlinedInput, Tooltip, FormControlLabel, Checkbox, Modal, Typography } from '@mui/material'
import { FormikErrors, useFormikContext } from 'formik'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { REMOVE_FAMILY_RESOURCE } from '@mth/constants'
import { MthColor } from '@mth/enums'
import { mthButtonClasses } from '@mth/styles/button.style'
import { commonClasses } from '@mth/styles/common.style'
import { defaultResourceLevelFormData } from '../../../defaultValues'
import { homeroomResourcesClasses } from '../../styles'
import { HomeroomResource, ResourceLevel } from '../../types'

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
    setFieldTouched('ResourceLevels', false)
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
    const inputtedCnt = values?.filter((item) => !!item.limit)?.length
    if (inputtedCnt && values?.length !== inputtedCnt) {
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

  const resourceLevelErrors = (index: number): FormikErrors<ResourceLevel> | undefined => {
    return errors.ResourceLevels?.[index] as FormikErrors<ResourceLevel>
  }

  return (
    <>
      <Tooltip title={values?.family_resource ? REMOVE_FAMILY_RESOURCE : ''} placement='top'>
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
          Edit Levels
        </Subtitle>
      )}

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            ...commonClasses.modalWrap,
            maxWidth: '615px',
            p: 3,
          }}
        >
          <Typography variant='h5' sx={{ fontSize: '20px', fontWeight: '700', textAlign: 'center', mb: 6 }}>
            Resource Levels
          </Typography>
          <Box sx={{ pl: '48px', textAlign: 'left' }}>
            <Box sx={{ display: 'flex', marginBottom: '12px', gap: '20px' }}>
              <Typography sx={{ flex: 1, fontSize: '20px', fontWeight: '700' }}>Limit</Typography>
              <Typography sx={{ flex: 2, fontSize: '20px', fontWeight: '700' }}>Level Name</Typography>
              <Box sx={{ width: '24px' }}></Box>
            </Box>
            {(values.ResourceLevels || []).map((item, index) => (
              <Box key={index}>
                <Box sx={{ display: 'flex', alignItems: 'end', marginBottom: '12px', gap: '20px' }}>
                  <Box sx={{ flex: 1 }}>
                    <Subtitle sx={homeroomResourcesClasses.formError}>
                      {touched.ResourceLevels &&
                        (resourceLevelErrors(index)?.limit || (limitError && !item.limit && 'Required'))}
                    </Subtitle>
                    <Tooltip
                      title={!!values.resource_limit ? 'Remove general limit to enable feature' : ''}
                      placement='top'
                    >
                      <OutlinedInput
                        size='small'
                        fullWidth
                        placeholder='Limit'
                        type='number'
                        value={item.limit || ''}
                        onChange={(e) => handleChangeOption(index, 'limit', Number(e.target.value) || null)}
                        disabled={!!values.resource_limit}
                        error={
                          touched.ResourceLevels && (!!resourceLevelErrors(index)?.limit || (limitError && !item.limit))
                        }
                      />
                    </Tooltip>
                  </Box>
                  <Box sx={{ flex: 2 }}>
                    <Subtitle sx={homeroomResourcesClasses.formError}>
                      {touched.ResourceLevels && resourceLevelErrors(index)?.name}
                    </Subtitle>
                    <OutlinedInput
                      size='small'
                      fullWidth
                      placeholder='Level Name'
                      value={item.name}
                      onChange={(e) => handleChangeOption(index, 'name', e.target.value)}
                      error={touched.ResourceLevels && !!resourceLevelErrors(index)?.name}
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
                  + Add Option
                </Paragraph>
              </Box>
              <Box sx={{ width: '24px' }}></Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: '70px' }}>
            <Button sx={mthButtonClasses.roundXsRed} onClick={handleClose}>
              Cancel
            </Button>
            <Button sx={{ ...mthButtonClasses.roundXsPrimary }} onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default ResourceLevels
