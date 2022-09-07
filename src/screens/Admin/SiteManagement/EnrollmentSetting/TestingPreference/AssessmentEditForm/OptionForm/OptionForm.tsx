import React from 'react'
import { Box, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { IF_SELECT_MARK_TESTING_PREFERENCE, REQUIRE_REASON_ON_OPT_OUT } from '@mth/constants'
import { OPT_TYPE } from '@mth/enums'
import { BulletEditor } from '@mth/screens/Admin/Calendar/components/BulletEditor'
import { DropDown } from '../../../../components/DropDown/DropDown'
import { testingPreferenceClassess } from '../../styles'
import { OptionFormProps } from '../types'

const OptionForm: React.FC<OptionFormProps> = ({ option, setOption, invalidation, setIsChanged }) => {
  const defaultReason =
    'Because the assessment does not allow for students to opt-out, please indicate your reason for refusing to test'
  const items = [
    {
      label: OPT_TYPE.NONE,
      value: '',
    },
    {
      label: OPT_TYPE.OPT_OUT,
      value: OPT_TYPE.OPT_OUT,
    },
    {
      label: OPT_TYPE.OPT_IN,
      value: OPT_TYPE.OPT_IN,
    },
  ]

  return (
    <Box sx={{ borderLeft: '1px solid #000', paddingX: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <TextField
            name='title'
            placeholder='Entry'
            value={option?.description}
            size='small'
            onChange={(e) => {
              setOption({ ...option, description: e.target.value })
              setIsChanged(true)
            }}
            sx={{ my: 1 }}
            error={invalidation && option?.description == ''}
          />
          <Subtitle sx={testingPreferenceClassess.formError}>
            {invalidation && option?.description == '' && 'Required'}
          </Subtitle>
        </Box>
        <Typography sx={{ paddingX: 2, marginY: 'auto' }}>{IF_SELECT_MARK_TESTING_PREFERENCE}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <DropDown
            dropDownItems={items}
            placeholder={'Select'}
            defaultValue={option?.optType ? option?.optType : ''}
            sx={{ width: '160px' }}
            borderNone={false}
            setParentValue={(value) => {
              setOption({ ...option, optType: value })
              setIsChanged(true)
            }}
            error={{ error: invalidation && option?.optType == '', errorMsg: '' }}
          />
          <Subtitle sx={testingPreferenceClassess.formError}>
            {invalidation && option?.optType == '' && 'Required'}
          </Subtitle>
        </Box>
      </Box>
      {option?.optType == OPT_TYPE.OPT_OUT && (
        <>
          <Box>
            <FormControlLabel
              sx={{ height: 30 }}
              control={
                <Checkbox
                  checked={option?.requireReason}
                  value={option?.requireReason}
                  onChange={() => {
                    setOption({ ...option, requireReason: !option?.requireReason })
                    setIsChanged(true)
                  }}
                />
              }
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  {REQUIRE_REASON_ON_OPT_OUT}
                </Paragraph>
              }
            />
          </Box>
          {option?.requireReason && (
            <Box sx={{ width: '90%' }}>
              <BulletEditor
                height='100px'
                value={option?.reason || defaultReason}
                setValue={(value) => {
                  setOption({ ...option, reason: value })
                  setIsChanged(true)
                }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default OptionForm
