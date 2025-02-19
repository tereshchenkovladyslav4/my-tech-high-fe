import React, { useEffect, useState } from 'react'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { CartEventType, MthColor } from '@mth/enums'
import { WaitListModalProps } from '../types'

const WaitListModal: React.FC<WaitListModalProps> = ({
  joinWaitlistResources,
  handleChangeResourceStatus,
  isAllDone,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0)

  useEffect(() => {
    if (selectedIdx >= joinWaitlistResources?.length) {
      isAllDone()
    }
  }, [selectedIdx])

  return (
    <>
      <CustomModal
        title='Waitlist'
        description={`[${joinWaitlistResources?.[selectedIdx]?.title}] is full, would you like to join the waitlist and have it added if a spot becomes available?`}
        cancelStr='Remove Resource'
        confirmStr='Join Waitlist'
        backgroundColor={MthColor.WHITE}
        onClose={() => {
          handleChangeResourceStatus(joinWaitlistResources[selectedIdx], CartEventType.REMOVE_CART)
          setSelectedIdx((prev) => ++prev)
        }}
        onConfirm={() => {
          handleChangeResourceStatus(joinWaitlistResources[selectedIdx], CartEventType.ADD_CART)
          setSelectedIdx((prev) => ++prev)
        }}
      />
    </>
  )
}

export default WaitListModal
