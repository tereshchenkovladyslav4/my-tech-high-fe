import React, {useContext, useEffect, useState} from 'react'
import { Box, Radio, TextField, Checkbox, IconButton, outlinedInputClasses } from '@mui/material'
import { OptionsType } from '../types'
import { SYSTEM_07 } from '../../../../../../utils/constants'
import CloseSharp from '@mui/icons-material/CloseSharp'
import { TabContext } from '../TabContextProvider'
import { DropDown } from '../../../../../../components/DropDown/DropDown'
const actionTypes = [
  {
    value: 1,
    label: 'Continue to next',
  },
  {
    value: 2,
    label: 'Ask an additional question',
  },
]
export default function QuestionOptions({
  options,
  setOptions,
  type,
  isAction = true,
  isDefault,
  // setAction,
}: {
  options: OptionsType[]
  setOptions: (options: OptionsType[]) => void
  isAction: boolean
  type: number
  isDefault: boolean
  // setAction: () => void
}) {
  // const tabName = useContext(TabContext)  
  const [enableAction, setEnableAction] = useState(true)
  useEffect(() => {
    if(options.filter((o) => o.action === 2).length > 0) {
      setEnableAction(false)
    }
    else {
      setEnableAction(true)
    }
  }, [options])
  return (
    <Box display='flex' flexDirection='column' width='100%'>
      {options.map((opt, i) => (
        <Box display='flex' width='100%' 
          sx={{
            alignItems: 'center', 
            justifyContent: 'space-around',
            borderBottom: `2px solid ${SYSTEM_07}`, 
            opacity: opt.label.trim() || i === 0 ? 1 : 0.3,
          }}          
          key={opt.value}
        >
          <Box
            sx={{
              display: 'flex',
              py: '10px',              
              alignItems: 'center', 
            }}
            width='50%'
          >
            {type === 3 ? <Checkbox /> : type === 5 ? <Radio /> : null}
            <TextField
              size='small'
              sx={{
                flex: 1,
                pl: '10px',
                '& .MuiInput-underline:after': {
                  borderWidth: '0px',
                  borderColor: 'transparent',
                },
                '& .MuiInput-underline:before': {
                  borderWidth: '0px',
                  borderColor: 'transparent',
                },
                '& .MuiInput-root:hover:not(.Mui-disabled):before': {
                  borderWidth: '0px',
                  borderColor: 'transparent',
                },
                '& :hover': {
                  borderWidth: '0px',
                  borderColor: 'transparent',
                },
              }}
              placeholder='Add Option'
              variant='standard'
              value={opt.label}
              focused
              disabled={isDefault}
              onChange={(e) => {
                const val = e.currentTarget.value
                const newOps = options.map((o) => (o.value === opt.value ? { ...o, label: val } : o))
                if (i === options.length - 1) {
                  setOptions([...newOps, { value: options.length + 1, label: '', action: 1 }])
                } else {
                  setOptions(newOps)
                }
              }}
            />
            {opt.label.trim() || i === 0 ? (
              <IconButton
                sx={{
                  color: '#fff',
                  bgcolor: '#000',
                  width: '30px',
                  height: '30px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginLeft: '10px',
                }}
                disabled={isDefault}
                onClick={() => {
                  setOptions(
                    options.filter((o) => o.value !== opt.value).map((v, i) => ({ value: i, label: v.label.trim() })),
                  )
                }}
              >
                <CloseSharp />
              </IconButton>
            ) : (
              <Box width='40px' />
            )}
          </Box>
          <Box width='30%'>
            {isAction && <DropDown
              sx={{
                pointerEvents: isDefault ? 'none' : 'unset',
                minWidth: '200px',
                [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                  {
                    borderColor: 'transparent',
                  },
              }}
              labelTop
              dropDownItems={(opt.action === 1 && !enableAction) ? actionTypes.filter((a) => a.value === 1) : actionTypes}
              defaultValue={opt.action}
              // @ts-ignore
              setParentValue={(v) => {
                const val = +v
                const newOps = options.map((o) => (o.value === opt.value ? { ...o, action: val } : o))
                if (i === options.length - 1) {
                  setOptions([...newOps, { value: options.length + 1, action: 1 }])
                } else {
                  setOptions(newOps)
                }
                // setAction(+v)
              }}
              size='small'
            />}
          </Box>
        </Box>        
      ))}
    </Box>
  )
}
