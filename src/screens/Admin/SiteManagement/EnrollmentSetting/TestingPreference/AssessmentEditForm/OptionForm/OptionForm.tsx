import React from 'react'
import { Box, TextField, Typography } from '@mui/material'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { DEFAULT_REASON, IF_SELECT_MARK_TESTING_PREFERENCE, REQUIRE_REASON_ON_OPT_OUT } from '@mth/constants'
import { OPT_TYPE } from '@mth/enums'
import { DropDown } from '../../../../components/DropDown/DropDown'
import { testingPreferenceClassess } from '../../styles'
import { OptionFormProps } from '../types'

const OptionForm: React.FC<OptionFormProps> = ({ option, setOption, invalidation, setIsChanged }) => {
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
            value={option?.label}
            size='small'
            onChange={(e) => {
              if (option) setOption({ ...option, label: e.target.value })
              setIsChanged(true)
            }}
            sx={{ my: 1 }}
            error={invalidation && option?.label == ''}
          />
          <Subtitle sx={testingPreferenceClassess.formError}>
            {invalidation && option?.label == '' && 'Required'}
          </Subtitle>
        </Box>
        <Typography sx={{ paddingX: 2, marginY: 'auto' }}>{IF_SELECT_MARK_TESTING_PREFERENCE}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <DropDown
            dropDownItems={items}
            placeholder={'Select'}
            defaultValue={option?.method ? option?.method : ''}
            sx={{ width: '160px' }}
            borderNone={false}
            setParentValue={(value) => {
              if (option) setOption({ ...option, method: value })
              setIsChanged(true)
            }}
            error={{ error: invalidation && option?.method == '', errorMsg: '' }}
          />
          <Subtitle sx={testingPreferenceClassess.formError}>
            {invalidation && option?.method == '' && 'Required'}
          </Subtitle>
        </Box>
      </Box>
      {option?.method == OPT_TYPE.OPT_OUT && (
        <>
          <Box>
            <MthCheckbox
              title={REQUIRE_REASON_ON_OPT_OUT}
              defaultValue={option?.require_reason}
              handleChangeValue={() => {
                setOption({ ...option, require_reason: !option?.require_reason })
                setIsChanged(true)
              }}
            />
          </Box>
          {option?.require_reason && (
            <Box sx={{ width: '90%' }}>
              <MthBulletEditor
                height='100px'
                value={option?.reason || DEFAULT_REASON}
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
