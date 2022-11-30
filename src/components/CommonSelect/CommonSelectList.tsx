import React from 'react'
import { Box } from '@mui/material'
import { CommonSelect } from '@mth/components/CommonSelect/CommonSelect'
import { CommonSelectType } from './types'

type CommonSelectListProps = {
  settingList: CommonSelectType[]
}

export const CommonSelectList: React.FC<CommonSelectListProps> = ({ settingList }) => {
  return (
    <>
      {settingList.map(
        (setting, pIdx) =>
          setting !== null && (
            <Box key={pIdx}>
              <CommonSelect
                key={pIdx}
                index={pIdx}
                selectItem={setting}
                dividerStyle={
                  setting.mergedItems?.length ? { top: '24px', height: '100%' } : { top: '24px', bottom: '24px' }
                }
              />

              {setting.mergedItems?.map((child, cIdx) => (
                <CommonSelect
                  key={`${pIdx}-${cIdx}`}
                  index={pIdx}
                  selectItem={child}
                  dividerStyle={
                    setting.mergedItems?.length && cIdx + 1 === setting.mergedItems.length
                      ? { bottom: '24px', height: '100%' }
                      : { top: '-24px', bottom: '24px' }
                  }
                />
              ))}
            </Box>
          ),
      )}
    </>
  )
}
