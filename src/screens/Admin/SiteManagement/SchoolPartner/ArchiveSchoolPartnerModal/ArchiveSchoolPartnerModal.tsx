import React, { FunctionComponent } from 'react'
import { useMutation } from '@apollo/client'
import { toNumber } from 'lodash'
import { CustomModal } from '../../../../../components/CustomModal/CustomModals'
import { ToggleSchoolPartnerMutation } from '../services'
import { SchoolPartnerType } from '../types'

export const ArchiveSchoolPartnerModal: FunctionComponent<{ handleModem: () => void; el: SchoolPartnerType }> = ({
  handleModem,
  el,
}) => {
  const text = toNumber(el.active) === 1 ? 'Archive School Partner' : 'Unarchive School Partner'

  const subtext =
    toNumber(el.active) === 1
      ? 'Are you sure you want to archive this School Partner?'
      : 'Are you sure you want to unarchive this School Partner?'

  const confirmText = toNumber(el.active) === 1 ? 'Archive' : 'Unarchive'

  const [toggleSchoolPartner] = useMutation(ToggleSchoolPartnerMutation)

  const handleArchive = () =>
    toggleSchoolPartner({
      variables: {
        schoolPartnerId: toNumber(el.school_partner_id),
      },
    }).then(() => {
      handleModem()
    })

  return (
    <CustomModal
      title={text}
      description={subtext}
      confirmStr={confirmText}
      onClose={() => handleModem()}
      onConfirm={handleArchive}
      backgroundColor='white'
    />
  )
}
