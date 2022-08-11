import React, { useState } from 'react'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import { Avatar, Box, Checkbox, FormControlLabel, Grid, TextField } from '@mui/material'
import { useFormikContext } from 'formik'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { MultiSelect } from '@mth/components/MultiSelect/MultiSelect'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { GRADES, s3URL } from '@mth/constants'
import { MthColor, ResourceSubtitle } from '@mth/enums'
import { BulletEditor } from '@mth/screens/Admin/Calendar/components/BulletEditor'
import { DocumentUploadModal } from '@mth/screens/Admin/SiteManagement/EnrollmentSetting/EnrollmentQuestions/Documents/components/DocumentUploadModal/DocumentUploadModal'
import { renderGrades, toOrdinalSuffix } from '@mth/utils'
import { HomeroomResource, HomeroomResourceFormProps } from '../types'
import { editHomeroomResourceClassess } from './styles'

const HomeroomResourceForm: React.FC<HomeroomResourceFormProps> = ({ setIsChanged }) => {
  const { errors, handleChange, setFieldValue, touched, values } = useFormikContext<HomeroomResource>()
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  const subtitleOptions: DropDownItem[] = [
    {
      label: 'None',
      value: ResourceSubtitle.NONE,
    },
    {
      label: 'Included',
      value: ResourceSubtitle.INCLUDED,
    },
    {
      label: 'Price',
      value: ResourceSubtitle.PRICE,
    },
  ]

  const gradeOptions: DropDownItem[] = GRADES.map((grade) => {
    if (typeof grade !== 'string') {
      return {
        label: toOrdinalSuffix(grade) + ' Grade',
        value: grade.toString(),
      }
    } else {
      return {
        label: grade,
        value: grade,
      }
    }
  })

  const onRemovePhoto = () => {
    setFieldValue('image', null)
    setImageUrl(undefined)
    setFieldValue('file', null)
  }

  const handleImageChange = (files: File[]) => {
    if (!files?.length) return
    const file = files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setImageUrl(reader.result?.toString())
      setFieldValue('file', file)
    }
  }
  const Image = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Subtitle sx={editHomeroomResourceClassess.formError}>{touched.image && errors.image}</Subtitle>
      {values.image || imageUrl ? (
        <>
          <Avatar
            src={imageUrl || `${s3URL}${values.image}`}
            variant='square'
            sx={{ height: 189, width: 225, borderRadius: 1 }}
          />
          <Box onClick={onRemovePhoto} sx={{ cursor: 'pointer', marginTop: 1 }}>
            <Paragraph size='medium' fontWeight='500' textAlign='center' color='#4145FF'>
              Remove Image
            </Paragraph>
          </Box>
        </>
      ) : (
        <Box
          display='flex'
          flexDirection='column'
          justifyContent={'center'}
          sx={{ backgroundColor: '#FAFAFA', alignItems: 'center', cursor: 'pointer', height: 189, width: 225 }}
          onClick={() => setImageModalOpen(true)}
        >
          <SystemUpdateAltIcon />
          <Paragraph size='medium' fontWeight='500'>
            Upload Photo
          </Paragraph>
        </Box>
      )}
    </Box>
  )

  return (
    <Box sx={{ width: '100%', px: 8, py: 8, textAlign: 'left' }}>
      <Grid container sx={{ gap: 6 }}>
        <Grid
          item
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'start',
          }}
        >
          {Image()}
          <Box sx={{ width: '100%', mt: 4, mb: 3 }}>
            <Subtitle sx={editHomeroomResourceClassess.formError}>{touched.subtitle && errors.subtitle}</Subtitle>
            <DropDown
              dropDownItems={subtitleOptions}
              placeholder='Subtitle'
              labelTop
              setParentValue={(value) => {
                setFieldValue('price', '')
                setFieldValue('subtitle', value)
                setIsChanged(true)
              }}
              size='medium'
              sx={{ m: 0 }}
              defaultValue={values?.subtitle}
              error={{ error: touched.subtitle && !!errors.subtitle, errorMsg: '' }}
            />
          </Box>
          {values?.subtitle === ResourceSubtitle.PRICE && (
            <Box sx={{ width: '100%' }}>
              <Subtitle sx={editHomeroomResourceClassess.formError}>{touched.price && errors.price}</Subtitle>
              <TextField
                name='price'
                label='Price'
                placeholder='Entry'
                type='number'
                fullWidth
                value={values?.price || ''}
                onChange={(e) => {
                  setFieldValue('price', Number(e.target.value) || '')
                  setIsChanged(true)
                }}
                error={touched.price && !!errors.price}
              />
            </Box>
          )}
        </Grid>
        <Grid item flex='1'>
          <Grid container>
            <Grid item xs={8}>
              <Box sx={{ width: '85%' }}>
                <Box sx={{ mb: 3 }}>
                  <Subtitle sx={editHomeroomResourceClassess.formError}>{touched.title && errors.title}</Subtitle>
                  <TextField
                    name='title'
                    label='Name'
                    placeholder='Entry'
                    fullWidth
                    value={values?.title}
                    onChange={(e) => {
                      handleChange(e)
                      setIsChanged(true)
                    }}
                    error={touched.title && !!errors.title}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Subtitle sx={editHomeroomResourceClassess.formError}>{touched.website && errors.website}</Subtitle>
                  <TextField
                    name='website'
                    label='Website'
                    placeholder='Entry'
                    fullWidth
                    value={values?.website}
                    onChange={(e) => {
                      handleChange(e)
                      setIsChanged(true)
                    }}
                    error={touched.website && !!errors.website}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'start', marginLeft: 6 }}>
                <FormControlLabel
                  sx={{ height: 30, marginTop: 2 }}
                  control={
                    <Checkbox
                      checked={values?.add_resource_level}
                      value={values?.add_resource_level}
                      onChange={() => {
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
                {values?.add_resource_level && (
                  <Subtitle
                    size={16}
                    color={MthColor.MTHBLUE}
                    fontWeight='700'
                    sx={{ cursor: 'pointer', marginTop: 1, marginLeft: '44px' }}
                    onClick={() => {}}
                  >
                    Edit Levels
                  </Subtitle>
                )}
              </Box>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={8}>
              <Box
                sx={{
                  display: 'flex',
                  gap: '24px',
                  justifyContent: 'space-between',
                  alignItems: 'end',
                }}
              >
                <Box sx={{ mb: 3, flex: 1 }}>
                  <Subtitle sx={editHomeroomResourceClassess.formError}>{touched.grades && errors.grades}</Subtitle>
                  <MultiSelect
                    options={gradeOptions}
                    label='Grades'
                    onChange={(value) => {
                      setFieldValue('grades', value.join(','))
                      setIsChanged(true)
                    }}
                    renderValue={renderGrades(values.grades)}
                    defaultValue={values?.grades?.length ? values.grades.split(',') : []}
                    error={{ error: touched.grades && !!errors.grades, errorMsg: '' }}
                  />
                </Box>
                <Box sx={{ mb: 3, flex: 1 }}>
                  <Subtitle sx={editHomeroomResourceClassess.formError}>
                    {touched.resource_limit && errors.resource_limit}
                  </Subtitle>
                  <TextField
                    name='resource_limit'
                    label='Limit'
                    placeholder='None'
                    type='number'
                    fullWidth
                    value={values?.resource_limit || ''}
                    onChange={(e) => {
                      setFieldValue('resource_limit', Number(e.target.value) || '')
                      setIsChanged(true)
                    }}
                    error={touched.resource_limit && !!errors.resource_limit}
                    disabled={!!values?.family_resource}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '24px',
                  justifyContent: 'space-between',
                  alignItems: 'end',
                }}
              >
                <Box sx={{ mb: 3, flex: 1 }}>
                  <Subtitle sx={editHomeroomResourceClassess.formError}>
                    {touched.std_user_name && errors.std_user_name}
                  </Subtitle>
                  <TextField
                    name='std_user_name'
                    label='Username'
                    placeholder='Entry'
                    fullWidth
                    value={values?.std_user_name}
                    onChange={(e) => {
                      handleChange(e)
                      setIsChanged(true)
                    }}
                    error={touched.std_user_name && !!errors.std_user_name}
                  />
                </Box>
                <Box sx={{ mb: 3, flex: 1 }}>
                  <Subtitle sx={editHomeroomResourceClassess.formError}>
                    {touched.std_password && errors.std_password}
                  </Subtitle>
                  <TextField
                    name='std_password'
                    label='Password'
                    placeholder='Entry'
                    fullWidth
                    value={values?.std_password}
                    onChange={(e) => {
                      handleChange(e)
                      setIsChanged(true)
                    }}
                    error={touched.std_password && !!errors.std_password}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ marginLeft: 6 }}>
                <FormControlLabel
                  sx={{ height: 30, marginTop: 2 }}
                  control={
                    <Checkbox
                      checked={values?.family_resource}
                      value={values?.family_resource}
                      onChange={() => {
                        setFieldValue('family_resource', !values?.family_resource)
                        setIsChanged(true)
                      }}
                    />
                  }
                  label={
                    <Paragraph size='large' fontWeight='700' sx={{ marginLeft: '12px' }}>
                      Family Resource
                    </Paragraph>
                  }
                  disabled={!!values.resource_limit || values.add_resource_level}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={10}>
          <Subtitle size='medium' sx={{ fontSize: '27px' }} fontWeight='700'>
            Details
          </Subtitle>
          <Subtitle sx={editHomeroomResourceClassess.formError}>{touched.detail && errors.detail}</Subtitle>
          <BulletEditor
            value={values?.detail}
            setValue={(value) => {
              setFieldValue('detail', value)
              setIsChanged(true)
            }}
            error={touched.detail && Boolean(errors.detail)}
          />
        </Grid>
      </Grid>
      {imageModalOpen && (
        <DocumentUploadModal
          handleModem={() => setImageModalOpen(!imageModalOpen)}
          handleFile={(files: File[]) => handleImageChange(files)}
          limit={1}
        />
      )}
    </Box>
  )
}

export default HomeroomResourceForm
