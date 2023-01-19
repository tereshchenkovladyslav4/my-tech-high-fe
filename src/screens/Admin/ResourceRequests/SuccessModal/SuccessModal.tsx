import React, { useEffect, useState } from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { Box, Button, IconButton, Modal, Tooltip, Typography } from '@mui/material'
import DownloadFileIcon from '@mth/assets/icons/file-download.svg'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { MthRadioGroup } from '@mth/components/MthRadioGroup'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
import { MthColor, ResourceRequestAction } from '@mth/enums'
import { mthButtonClasses } from '@mth/styles/button.style'

type SuccessModalProps = {
  failedResourceRequestIds: number[]
  succeededResourceRequestIds: number[]
  handleDownloadErrors: () => void
  handleAction: (value: ResourceRequestAction) => void
}

export const RESOURCE_REQUEST_ACTIONS: RadioGroupOption[] = [
  {
    option_id: ResourceRequestAction.ACCEPTED_EMAIL,
    value: false,
    label: 'Mark Request as Accepted and Email the users',
  },
  { option_id: ResourceRequestAction.ACCEPTED, value: false, label: 'Mark Request as Accepted' },
  { option_id: ResourceRequestAction.NO_ACTION, value: false, label: 'No action' },
]

export const SuccessModal: React.FC<SuccessModalProps> = ({
  failedResourceRequestIds,
  succeededResourceRequestIds,
  handleDownloadErrors,
  handleAction,
}) => {
  const [selectedAction, setSelectedAction] = useState<ResourceRequestAction>()
  const [defaultOptions, setDefaultQuestionOptions] = useState<RadioGroupOption[]>(RESOURCE_REQUEST_ACTIONS)
  const [successCount, setSuccessCount] = useState<number>(0)
  const [checkBoxStatus, setCheckBoxStatus] = useState<boolean>(true)
  const [showError, setShowError] = useState<boolean>(false)

  const handleChangeOption = (values: RadioGroupOption[]) => {
    if (values) {
      const value = values?.find((x) => x.value)
      setSelectedAction(value?.option_id as ResourceRequestAction)
      setDefaultQuestionOptions(values)
    }
  }

  const handleClickOkAction = () => {
    if (selectedAction) handleAction(selectedAction)
    else setShowError(true)
  }

  useEffect(() => {
    setSuccessCount(succeededResourceRequestIds?.length)
  }, [succeededResourceRequestIds?.length])

  return (
    <Modal
      open={true}
      aria-labelledby='child-modal-title'
      disableAutoFocus={true}
      aria-describedby='child-modal-description'
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '550px',
          height: 'auto',
          bgcolor: MthColor.WHITE,
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h5' fontWeight='bold'>
            Success
          </Typography>
          <CheckCircleOutlineIcon
            style={{
              background: MthColor.BG_MAIN,
              borderRadius: 1,
              color: MthColor.BLACK,
              marginBottom: 12,
              marginTop: 12,
              height: 42,
              width: 42,
            }}
          />
          {!!successCount && (
            <Typography
              fontWeight={'bold'}
              sx={{ marginBottom: '20px' }}
            >{`${successCount} Usernames and Passwords were imported`}</Typography>
          )}
          {!!failedResourceRequestIds?.length && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: '30px', gap: '20px' }}>
              <Typography sx={{ color: MthColor.ERROR_RED }}>{`${failedResourceRequestIds.length} Errors`}</Typography>
              <Tooltip title='Download' placement='top'>
                <IconButton onClick={handleDownloadErrors} size='large' sx={{ marginTop: '-13px' }}>
                  <img src={DownloadFileIcon} alt='Download Icon' width={20} />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          <Typography fontWeight={'bold'} sx={{ color: showError ? MthColor.ERROR_RED : MthColor.BLACK }}>
            How would you like to proceed?
          </Typography>

          <MthRadioGroup
            ariaLabel='learning_log_default-questions'
            options={defaultOptions}
            handleChangeOption={(value: RadioGroupOption[]) => {
              handleChangeOption(value)
            }}
          />

          {showError && <Typography sx={{ color: MthColor.ERROR_RED, textAlign: 'left' }}>Required</Typography>}

          <MthCheckbox
            label='Create Direct Deduction for Resources with a cost'
            checked={checkBoxStatus}
            wrapSx={{ marginLeft: '-10px' }}
            onChange={() => {
              setCheckBoxStatus(!checkBoxStatus)
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '30px', gap: '20px' }}>
            <Button sx={{ ...mthButtonClasses.roundDark, width: '160px' }} onClick={() => handleClickOkAction()}>
              Ok
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
