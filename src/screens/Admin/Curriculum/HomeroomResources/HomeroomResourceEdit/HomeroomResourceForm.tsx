import React, { useState } from 'react'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import { Avatar, Box, Grid, TextField, Tooltip, Typography } from '@mui/material'
import { useFormikContext } from 'formik'
import { DocumentUploadModal } from '@mth/components/DocumentUploadModal/DocumentUploadModal'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { MultiSelect } from '@mth/components/MultiSelect/MultiSelect'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { REMOVE_FAMILY_RESOURCE } from '@mth/constants'
import { ResourceSubtitle, UsernameFormat } from '@mth/enums'
import { s3URL } from '@mth/envs'
import { useProgramYearListBySchoolYearId } from '@mth/hooks'
import { HomeroomResource } from '@mth/models'
import { renderGrades } from '@mth/utils'
import { homeroomResourcesClasses } from '../styles'
import { HomeroomResourceFormProps } from '../types'
import { ResourceLevels } from './ResourceLevels'

const HomeroomResourceForm: React.FC<HomeroomResourceFormProps> = ({ schoolYearId, setIsChanged }) => {
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

  const usernameFormatItems: DropDownItem[] = [
    {
      label: (
        <Typography>
          [first][last]&nbsp;&nbsp;
          <Typography component='span' sx={{ fontWeight: '700' }}>
            erinsublette
          </Typography>
        </Typography>
      ),
      value: UsernameFormat.FIRST_LAST,
    },
    {
      label: (
        <Typography>
          [last][first][year]&nbsp;&nbsp;
          <Typography component='span' sx={{ fontWeight: '700' }}>
            subletteerin2022
          </Typography>
        </Typography>
      ),
      value: UsernameFormat.LAST_FIRST_YEAR,
    },
    {
      label: (
        <Typography>
          [last][first]&nbsp;&nbsp;
          <Typography component='span' sx={{ fontWeight: '700' }}>
            subletteerin
          </Typography>
        </Typography>
      ),
      value: UsernameFormat.LAST_FIRST,
    },
    {
      label: (
        <Typography>
          [last][firstinitial]&nbsp;&nbsp;
          <Typography component='span' sx={{ fontWeight: '700' }}>
            sublettee
          </Typography>
        </Typography>
      ),
      value: UsernameFormat.LAST_FIRSTINITIAL,
    },
    {
      label: (
        <Typography>
          [last][first]mth&nbsp;&nbsp;
          <Typography component='span' sx={{ fontWeight: '700' }}>
            subletteerinmth
          </Typography>
        </Typography>
      ),
      value: UsernameFormat.LAST_FIRST_MTH,
    },
    {
      label: (
        <Typography>
          [last][first][birthyear]&nbsp;&nbsp;
          <Typography component='span' sx={{ fontWeight: '700' }}>
            subletteerin1989
          </Typography>
        </Typography>
      ),
      value: UsernameFormat.LAST_FIRST_BIRTH_YEAR,
    },
    {
      label: (
        <Typography>
          [first][last][@mytechhigh.com]&nbsp;&nbsp;
          <Typography component='span' sx={{ fontWeight: '700' }}>
            erinsublette@mytechhigh.com
          </Typography>
        </Typography>
      ),
      value: UsernameFormat.FIRST_LAST_DOMAIN,
    },
    {
      label: (
        <Typography>
          [student email]&nbsp;&nbsp;
          <Typography component='span' sx={{ fontWeight: '700' }}>
            esublette@gmail.com
          </Typography>
        </Typography>
      ),
      value: UsernameFormat.STUDENT_EMAIL,
    },
    {
      label: (
        <Typography>
          [parent email]&nbsp;&nbsp;
          <Typography component='span' sx={{ fontWeight: '700' }}>
            parent@gmail.com
          </Typography>
        </Typography>
      ),
      value: UsernameFormat.PARENT_EMAIL,
    },
    {
      label: (
        <Typography component='span' sx={{ fontWeight: '700' }}>
          Generic
        </Typography>
      ),
      value: UsernameFormat.GENERIC,
    },
  ]

  const { gradeList: gradeOptions } = useProgramYearListBySchoolYearId(schoolYearId)

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
      <Subtitle sx={homeroomResourcesClasses.formError}>{touched.image && errors.image}</Subtitle>
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
            <Subtitle sx={homeroomResourcesClasses.formError}>{touched.subtitle && errors.subtitle}</Subtitle>
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
              <Subtitle sx={homeroomResourcesClasses.formError}>{touched.price && errors.price}</Subtitle>
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
                  <Subtitle sx={homeroomResourcesClasses.formError}>{touched.title && errors.title}</Subtitle>
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
                  <Subtitle sx={homeroomResourcesClasses.formError}>{touched.website && errors.website}</Subtitle>
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
                <ResourceLevels setIsChanged={setIsChanged}></ResourceLevels>
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
                  <Subtitle sx={homeroomResourcesClasses.formError}>{touched.grades && errors.grades}</Subtitle>
                  <MultiSelect
                    options={gradeOptions}
                    label='Grades'
                    onChange={(value) => {
                      const filteredGrades = value.filter(
                        (item) => gradeOptions.findIndex((option) => option.value === item) > -1 || item === 'all',
                      )
                      setFieldValue('grades', filteredGrades.join(','))
                      setIsChanged(true)
                    }}
                    renderValue={renderGrades(values.grades)}
                    defaultValue={values?.grades?.length ? values.grades.split(',') : []}
                    error={{ error: touched.grades && !!errors.grades, errorMsg: '' }}
                    allSelect
                  />
                </Box>
                <Box sx={{ mb: 3, flex: 1 }}>
                  <Subtitle sx={homeroomResourcesClasses.formError}>
                    {touched.resource_limit && errors.resource_limit}
                  </Subtitle>
                  <Tooltip
                    title={
                      values?.family_resource
                        ? REMOVE_FAMILY_RESOURCE
                        : values.add_resource_level && !!values.ResourceLevels?.filter((item) => item.limit)?.length
                        ? 'Remove resource level limit to enable feature'
                        : ''
                    }
                    placement='top'
                  >
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
                      disabled={
                        !!values?.family_resource ||
                        (values.add_resource_level && !!values.ResourceLevels?.filter((item) => item.limit)?.length)
                      }
                    />
                  </Tooltip>
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
                  <Subtitle sx={homeroomResourcesClasses.formError}>
                    {touched.std_user_name && errors.std_user_name}
                  </Subtitle>
                  <Box sx={{ position: 'relative' }}>
                    <DropDown
                      dropDownItems={usernameFormatItems}
                      placeholder='Username'
                      labelTop
                      setParentValue={(value) => {
                        setFieldValue('std_username_format', value)
                        setFieldValue('std_user_name', '')
                        setIsChanged(true)
                      }}
                      size='medium'
                      sx={{
                        m: 0,
                        '.MuiSelect-outlined': {
                          color: values?.std_username_format == UsernameFormat.GENERIC ? 'transparent' : '',
                        },
                      }}
                      defaultValue={values?.std_username_format}
                      error={{ error: touched.std_username_format && !!errors.std_username_format, errorMsg: '' }}
                    />
                    {values?.std_username_format == UsernameFormat.GENERIC && (
                      <TextField
                        name='std_user_name'
                        placeholder='Entry'
                        fullWidth
                        value={values?.std_user_name}
                        onChange={(e) => {
                          handleChange(e)
                          setIsChanged(true)
                        }}
                        error={touched.std_user_name && !!errors.std_user_name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: '36px',
                          width: 'unset',
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        }}
                      />
                    )}
                  </Box>
                </Box>
                <Box sx={{ mb: 3, flex: 1 }}>
                  <Subtitle sx={homeroomResourcesClasses.formError}>
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
              <Box>
                <MthCheckbox
                  label='This resource qualifies for a Required Software Reimbursement.'
                  checked={values?.software_reimbursement}
                  onChange={() => {
                    setFieldValue('software_reimbursement', !values?.software_reimbursement)
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ marginLeft: 6 }}>
                <Tooltip
                  title={
                    values?.resource_limit && values.add_resource_level
                      ? 'Remove general limit and resource levels to enable feature'
                      : values.resource_limit
                      ? 'Remove general limit to enable feature'
                      : values?.add_resource_level
                      ? 'Remove resource levels to enable feature'
                      : ''
                  }
                  placement='top'
                >
                  <Box>
                    <MthCheckbox
                      label='Family Resource'
                      labelSx={{ fontWeight: '600' }}
                      wrapSx={{ height: 30, marginTop: 2 }}
                      checked={values?.family_resource}
                      onChange={() => {
                        setFieldValue('family_resource', !values?.family_resource)
                        setIsChanged(true)
                      }}
                      disabled={!!values.resource_limit || values.add_resource_level}
                    ></MthCheckbox>
                  </Box>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={10}>
          <Subtitle size='medium' sx={{ fontSize: '27px' }} fontWeight='700'>
            Details
          </Subtitle>
          <Subtitle sx={homeroomResourcesClasses.formError}>{touched.detail && errors.detail}</Subtitle>
          <MthBulletEditor
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
