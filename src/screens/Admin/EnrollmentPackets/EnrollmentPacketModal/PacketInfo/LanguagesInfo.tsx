import React, { FunctionComponent } from 'react'
import { Grid } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { DropDown } from '../../../../../components/DropDown/DropDown'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { languages } from '../../../../../utils/languages'

export const LanguagesInfo: FunctionComponent = () => {
  const { control } = useFormContext()

  return (
    <Grid container spacing={2} sx={{ paddingTop: '20px' }}>
      <Grid item xl={6} xs={12} sx={{ maxWidth: '25rem' }}>
        <Subtitle fontWeight='500'>First Language learned by child</Subtitle>
        <Controller
          name='language'
          control={control}
          render={({ field }) => (
            <DropDown
              dropDownItems={languages}
              placeholder='Entry'
              defaultValue={field.value}
              setParentValue={(v) => field.onChange(v as string)}
              size='small'
            />
          )}
        />
      </Grid>
      <Grid item xl={6} xs={12} sx={{ maxWidth: '25rem' }}>
        <Subtitle fontWeight='500'>Language used most often by child in home</Subtitle>
        <Controller
          name='language_home_child'
          control={control}
          render={({ field }) => (
            <DropDown
              dropDownItems={languages}
              placeholder='Entry'
              defaultValue={field.value}
              setParentValue={(v) => field.onChange(v as string)}
              size='small'
            />
          )}
        />
      </Grid>
      <Grid item xl={6} xs={12} sx={{ maxWidth: '25rem' }}>
        <Subtitle fontWeight='500'>Preferred correspondence language for adults in the home</Subtitle>
        <Controller
          name='language_home_preferred'
          control={control}
          render={({ field }) => (
            <DropDown
              dropDownItems={languages}
              placeholder='Entry'
              defaultValue={field.value}
              setParentValue={(v) => field.onChange(v as string)}
              size='small'
            />
          )}
        />
      </Grid>
      <Grid item xl={6} xs={12} sx={{ maxWidth: '25rem' }}>
        <Subtitle fontWeight='500'>Language used most often by adults in the home</Subtitle>
        <Controller
          name='language_home'
          control={control}
          render={({ field }) => (
            <DropDown
              dropDownItems={languages}
              placeholder='Entry'
              defaultValue={field.value}
              setParentValue={(v) => field.onChange(v as string)}
              size='small'
            />
          )}
        />
      </Grid>
      <Grid item xl={6} xs={12} sx={{ maxWidth: '25rem' }}>
        <Subtitle fontWeight='500'>Language used most often by child with friends outside </Subtitle>
        <Controller
          name='language_friends'
          control={control}
          render={({ field }) => (
            <DropDown
              dropDownItems={languages}
              placeholder='Entry'
              defaultValue={field.value}
              setParentValue={(v) => field.onChange(v as string)}
              size='small'
            />
          )}
        />
      </Grid>
    </Grid>
  )
}
