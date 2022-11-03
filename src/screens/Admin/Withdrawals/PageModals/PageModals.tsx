import React, { useContext } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Stack, TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { ApplicationEmailModal as EmailModal } from '../../../../components/EmailModal/ApplicationEmailModal'
import { WarningModal } from '../../../../components/WarningModal/Warning'
import { getEmailByWithdrawalId } from '../../../../graphql/queries/withdrawal'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { ActiveModal } from '../../UserProfile/StudentProfile/components/ActiveModal'
import { ConfirmModal } from '../components/ConfirmModal'
import {
  emailWithdrawalMutation,
  quickWithdrawalMutation,
  reinstateWithdrawalMutation,
  updateWithdrawalMutation,
} from '../service'
import { PageModalsProps } from '../type'
import { WithdrawalModal } from '../WithdrawalModal'
import { WithdrawalEmailModal } from '../WithdrawalPage/WithdrawalEmailModal'

const PageModals: React.FC<PageModalsProps> = ({
  showWithdrawalConfirmModal,
  showReinstateModal,
  reinstateModalType,
  openWarningModal,
  errorReinstateModal,
  openEmailModal,
  checkedWithdrawalIds,
  emailTemplate,
  openEmailHistoryModal,
  effective,
  openEffectiveCalendar,
  withdrawalId,
  isShowWithdrawalModal,
  selectedWithdrawal,
  setIsShowWithdrawalModal,
  setShowWithdrawalConfirmModal,
  setShowReinstateModal,
  setOpenWarningModal,
  setErrorReinstateModal,
  setOpenEmailModal,
  setOpenEmailHistoryModal,
  setEffective,
  setOpenEffectiveCalendar,
  refetch,
  refetchWithdrawalsCount,
  refetchEmailTemplate,
}) => {
  const { me } = useContext(UserContext)
  const [quickWithdrawal] = useMutation(quickWithdrawalMutation)
  const [reinstateWithdrawal] = useMutation(reinstateWithdrawalMutation)
  const [updateWithdrawal] = useMutation(updateWithdrawalMutation)
  const [emailWithdrawal] = useMutation(emailWithdrawalMutation)

  const { loading: emailLoading, data: emailData } = useQuery(getEmailByWithdrawalId, {
    variables: {
      withdrawId: Number(withdrawalId),
    },
    skip: withdrawalId === 0,
    fetchPolicy: 'network-only',
  })

  const onQuickWithdrawal = async () => {
    if (checkedWithdrawalIds.length === 0) {
      return
    }
    try {
      await quickWithdrawal({
        variables: {
          quickWithdrawalInput: {
            withdrawal_ids: checkedWithdrawalIds.map((id) => Number(id)),
            region_id: me?.selectedRegionId,
          },
        },
      })
      refetch()
      refetchWithdrawalsCount()
      refetchEmailTemplate()
    } catch (error) {}
  }
  const onReinstateWithdrawal = async (reinstateType = 0) => {
    if (checkedWithdrawalIds.length === 0) {
      return
    }
    setShowReinstateModal(false)
    try {
      await reinstateWithdrawal({
        variables: {
          reinstateWithdrawalInput: {
            withdrawal_ids: checkedWithdrawalIds.map((id) => Number(id)),
            reinstate_type: reinstateType,
          },
        },
      })
      refetch()
      refetchWithdrawalsCount()
      refetchEmailTemplate()
    } catch (error) {}
  }
  const openHandleEffectiveChange = (value: Date | null) => {
    setEffective({
      ...effective,
      date: value?.toString() || '',
    })
  }
  const handleAcceptDate = async (e: unknown) => {
    const acceptDate = new Date(e || '').toISOString()
    await updateWithdrawal({
      variables: {
        updateWithdrawalInput: {
          withdrawal_id: Number(effective?.withdrawId),
          value: acceptDate,
          field: 'date_effective',
        },
      },
    })
    refetch()
  }

  const handleEmailSend = (from: string, subject: string, body: string) => {
    if (checkedWithdrawalIds.length === 0) {
      return
    }
    onSendEmail(from, subject, body)
  }

  const onSendEmail = async (from: string, subject: string, body: string) => {
    if (checkedWithdrawalIds.length === 0) {
      return
    }
    try {
      await emailWithdrawal({
        variables: {
          emailWithdrawalInput: {
            withdrawal_ids: checkedWithdrawalIds.map((id) => Number(id)),
            from: from,
            subject: subject,
            body: body,
            region_id: me?.selectedRegionId,
          },
        },
      })
      refetch()
      refetchEmailTemplate()
      setOpenEmailModal(false)
    } catch (error) {}
  }
  return (
    <>
      {showWithdrawalConfirmModal && (
        <ConfirmModal
          title='Withdraw'
          description='A withdrawal form will be created and comfirmation email will be sent.'
          cancelStr='Cancel'
          confirmStr='Withdraw'
          onClose={() => {
            setShowWithdrawalConfirmModal(false)
          }}
          onConfirm={() => {
            setShowWithdrawalConfirmModal(false)
            onQuickWithdrawal()
          }}
        />
      )}
      {showReinstateModal && reinstateModalType == 0 && (
        <ConfirmModal
          title='Reinstate'
          description='Are you sure you want reinstate the student(s)?'
          cancelStr='Cancel'
          confirmStr='Reinstate'
          onClose={() => {
            setShowReinstateModal(false)
          }}
          onConfirm={() => {
            setShowReinstateModal(false)
            onReinstateWithdrawal(0)
          }}
        />
      )}
      {showReinstateModal && reinstateModalType == 1 && (
        <ActiveModal
          title='Reinstate'
          description='How would you like to proceed with reinstating this student?'
          confirmStr='Reinstate'
          cancelStr='Cancel'
          backgroundColor='#FFFFFF'
          onActive={onReinstateWithdrawal}
          onClose={() => setShowReinstateModal(false)}
        />
      )}
      {openWarningModal && (
        <WarningModal
          title='Warning'
          subtitle='Please select Withdrawals'
          btntitle='Close'
          handleModem={() => setOpenWarningModal(false)}
          handleSubmit={() => setOpenWarningModal(false)}
        />
      )}
      {errorReinstateModal && (
        <WarningModal
          title='Error'
          subtitle='You may only select multiple students with the same status.'
          btntitle='Ok'
          handleModem={() => setErrorReinstateModal(false)}
          handleSubmit={() => setErrorReinstateModal(false)}
        />
      )}
      {openEmailModal && (
        <EmailModal
          handleModem={() => setOpenEmailModal(!openEmailModal)}
          title={checkedWithdrawalIds.length + ' Recipients'}
          handleSubmit={handleEmailSend}
          template={emailTemplate}
          editFrom={true}
        />
      )}
      {openEmailHistoryModal && !emailLoading && (
        <WithdrawalEmailModal
          handleClose={() => setOpenEmailHistoryModal(false)}
          data={emailData?.getEmailsByWithdrawId}
        />
      )}
      {isShowWithdrawalModal && selectedWithdrawal && (
        <WithdrawalModal
          withdrawal={selectedWithdrawal}
          emailTemplate={emailTemplate}
          handleModem={() => {
            refetch()
            refetchEmailTemplate()
            setIsShowWithdrawalModal(false)
          }}
        />
      )}
      <LocalizationProvider dateAdapter={AdapterDateFns} localeText='Save' cancelButtonLabel='Cancel'>
        <Stack spacing={3} marginRight={8}>
          <MobileDatePicker
            label={'Select One Date'}
            inputFormat='MM/dd/yyyy'
            value={effective.date}
            onChange={openHandleEffectiveChange}
            onClose={() => {
              setOpenEffectiveCalendar(false)
            }}
            open={openEffectiveCalendar}
            onAccept={handleAcceptDate}
            okText='Save'
            renderInput={(params) => <TextField {...params} sx={{ display: 'none' }} />}
          />
        </Stack>
      </LocalizationProvider>
    </>
  )
}

export default PageModals
