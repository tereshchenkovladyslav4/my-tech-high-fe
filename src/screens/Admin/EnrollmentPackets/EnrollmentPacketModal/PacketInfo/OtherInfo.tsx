import React from 'react'
import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import { Controller, useFormContext } from 'react-hook-form'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import {
  DIRECTORY_PERMISSION_OPTIONS,
  MILITARY_OPTIONS,
  OTHER_PERMISSION_OPTIONS,
  PICTURE_PERMISSION_OPTIONS,
  WORKIN_AGRICULTURE_OPTIONS,
} from '@mth/constants'

export const OtherInfo: React.FC = () => {
  const { control } = useFormContext()
  return (
    <Box sx={{ paddingTop: '15px' }}>
      <Subtitle size='small' fontWeight='700'>
        Other
      </Subtitle>
      <Grid container columnSpacing={2} sx={{ paddingTop: '20px' }}>
        <Grid item xl={6} xs={12}>
          <Box display='flex' flexDirection='column' maxWidth='30rem'>
            <Subtitle size='small' fontWeight='500'>
              Has the parent or spouse worked in Agriculture?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Subtitle>
            <Controller
              name='worked_in_agriculture'
              control={control}
              render={({ field }) => (
                <DropDown
                  dropDownItems={WORKIN_AGRICULTURE_OPTIONS as DropDownItem[]}
                  placeholder='Entry'
                  defaultValue={field.value}
                  size='small'
                  setParentValue={(v) => field.onChange(v as number)}
                />
              )}
            />
          </Box>
        </Grid>
        <Grid item xl={6} xs={12}>
          <Box display='flex' flexDirection='column' maxWidth='30rem'>
            <Subtitle size='small' fontWeight='500'>
              Is a parent or legal guardian on active duty in the military
            </Subtitle>
            <Controller
              name='military'
              control={control}
              render={({ field }) => (
                <DropDown
                  dropDownItems={MILITARY_OPTIONS as DropDownItem[]}
                  placeholder='Entry'
                  defaultValue={field.value}
                  size='small'
                  setParentValue={(v) => field.onChange(v as number)}
                />
              )}
            />
          </Box>
        </Grid>
        <Grid item xl={6} xs={12}>
          <Box sx={{ marginTop: '10px' }} display='flex' flexDirection='column' maxWidth='30rem'>
            <Subtitle size='small' fontWeight='500'>
              FERPA Agreement Options
            </Subtitle>
            <Controller
              name='ferpa_agreement'
              control={control}
              render={({ field }) => (
                <DropDown
                  dropDownItems={OTHER_PERMISSION_OPTIONS as DropDownItem[]}
                  placeholder='Entry'
                  defaultValue={field.value}
                  size='small'
                  setParentValue={(v) => field.onChange(v as number)}
                />
              )}
            />
          </Box>
        </Grid>
        <Grid item xl={6} xs={12}>
          <Box sx={{ marginTop: '10px' }} display='flex' flexDirection='column' maxWidth='30rem'>
            <Subtitle size='small' fontWeight='500'>
              Student Photo Permissions
            </Subtitle>
            <Controller
              name='photo_permission'
              control={control}
              render={({ field }) => (
                <DropDown
                  dropDownItems={PICTURE_PERMISSION_OPTIONS as DropDownItem[]}
                  placeholder='Entry'
                  defaultValue={field.value}
                  size='small'
                  setParentValue={(v) => field.onChange(v as number)}
                />
              )}
            />
          </Box>
        </Grid>
        <Grid item xl={6} xs={12}>
          <Box sx={{ marginTop: '10px' }} display='flex' flexDirection='column' maxWidth='30rem'>
            <Subtitle size='small' fontWeight='500'>
              School Student Directory Permissions
            </Subtitle>
            <Controller
              name='dir_permission'
              control={control}
              render={({ field }) => (
                <DropDown
                  dropDownItems={DIRECTORY_PERMISSION_OPTIONS as DropDownItem[]}
                  placeholder='Entry'
                  defaultValue={field.value}
                  size='small'
                  setParentValue={(v) => field.onChange(v as number)}
                />
              )}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
