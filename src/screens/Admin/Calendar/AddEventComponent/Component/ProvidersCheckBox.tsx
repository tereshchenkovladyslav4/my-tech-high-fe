import { Box, Checkbox, FormControlLabel } from '@mui/material'
import React, { useState } from 'react'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { map } from 'lodash'
import { DropDownItem } from '../../../SiteManagement/components/DropDown/types'

type ProvidersCheckBoxProps = {
  providers: string[]
  setProviders: (value: string[]) => void
}
const ProvidersCheckBox = ({ providers, setProviders }: ProvidersCheckBoxProps) => {
  const [providerList, setProviderList] = useState<DropDownItem[]>([
    {
      label: 'CfA',
      value: 'cfa',
    },
    {
      label: 'Snow College',
      value: 'snow-college',
    },
    {
      label: 'Alex Math',
      value: 'alex-math',
    },
    {
      label: 'MTH Direct',
      value: 'mth-direct',
    },
  ])

  const handleChangeProviders = (e) => {
    if (providers.includes(e.target.value)) {
      setProviders(providers.filter((item) => item !== e.target.value && !!item))
    } else {
      setProviders([...providers, e.target.value].filter((item) => !!item))
    }
  }
  const renderProviders = () =>
    map(providerList, (provider, index) => (
      <FormControlLabel
        key={index}
        sx={{ height: 30 }}
        control={
          <Checkbox
            checked={providers.includes(provider.value.toString())}
            value={provider.value}
            onChange={handleChangeProviders}
          />
        }
        label={
          <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
            {provider.label}
          </Paragraph>
        }
      />
    ))

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Paragraph size='large' fontWeight='700'>
        Providers
      </Paragraph>
      {renderProviders()}
    </Box>
  )
}

export default ProvidersCheckBox
