import React from 'react'
import { Box, Grid, TextField } from '@mui/material'
import { useFormikContext } from 'formik'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { ResourceRequestEditVM } from '@mth/screens/Admin/ResourceRequests/ResourceRequestEdit/type'
import { commonClasses } from '@mth/styles/common.style'

export type ResourceRequestFormProps = {
  setIsChanged: (value: boolean) => void
  resourceLevels: DropDownItem[]
}

const ResourceRequestForm: React.FC<ResourceRequestFormProps> = ({ setIsChanged, resourceLevels }) => {
  const { errors, handleChange, setFieldValue, touched, values } = useFormikContext<ResourceRequestEditVM>()

  return (
    <Box sx={{ width: '100%', textAlign: 'left', mb: '70px' }}>
      <Grid container columnSpacing={4} rowSpacing={3}>
        <Grid item xs={6}>
          <TextField
            data-testid='firstName'
            name='firstName'
            label='Student First'
            placeholder='Entry'
            fullWidth
            InputLabelProps={{ shrink: true }}
            className='MthFormField'
            value={values?.firstName}
            onChange={(e) => {
              handleChange(e)
              setIsChanged(true)
            }}
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            data-testid='lastName'
            name='lastName'
            label='Student Last'
            placeholder='Entry'
            fullWidth
            InputLabelProps={{ shrink: true }}
            className='MthFormField'
            value={values?.lastName}
            onChange={(e) => {
              handleChange(e)
              setIsChanged(true)
            }}
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            data-testid='vendor'
            name='vendor'
            label='Vendor'
            placeholder='Entry'
            fullWidth
            InputLabelProps={{ shrink: true }}
            className='MthFormField'
            value={values?.vendor}
            onChange={(e) => {
              handleChange(e)
              setIsChanged(true)
            }}
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <DropDown
            testId='resourceLevel'
            dropDownItems={resourceLevels}
            placeholder='Resource Level'
            labelTop
            setParentValue={(value) => {
              setFieldValue('resourceLevel', value)
            }}
            sx={{ m: 0 }}
            defaultValue={values?.resourceLevel}
            error={{ error: touched.resourceLevel && !!errors.resourceLevel, errorMsg: '' }}
            disabled={!resourceLevels?.length}
          />
          <Subtitle sx={commonClasses.formError}>{touched.resourceLevel && errors.resourceLevel}</Subtitle>
        </Grid>
        <Grid item xs={6}>
          <TextField
            data-testid='username'
            name='username'
            label='Username'
            placeholder='Entry'
            fullWidth
            InputLabelProps={{ shrink: true }}
            className='MthFormField'
            value={values?.username}
            onChange={(e) => {
              handleChange(e)
              setIsChanged(true)
            }}
            error={touched.username && !!errors.username}
          />
          <Subtitle sx={commonClasses.formError}>{touched.username && errors.username}</Subtitle>
        </Grid>
        <Grid item xs={6}>
          <TextField
            data-testid='password'
            name='password'
            label='Password'
            placeholder='Entry'
            fullWidth
            InputLabelProps={{ shrink: true }}
            className='MthFormField'
            value={values?.password}
            onChange={(e) => {
              handleChange(e)
              setIsChanged(true)
            }}
            error={touched.password && !!errors.password}
          />
          <Subtitle sx={commonClasses.formError}>{touched.password && errors.password}</Subtitle>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ResourceRequestForm
