import React from 'react'
import { Box } from '@mui/system'
import { map } from 'lodash'
import { Breadcrumb } from './BreadCrumb/Breadcrumb'
import { BreadcrumbsTemplateType } from './types'
// import { EnrollmentContext } from '../../providers/EnrollmentPacketPrivder/EnrollmentPacketProvider'

export const Breadcrumbs: BreadcrumbsTemplateType = ({ steps, handleClick }) => {
  const renderBreadcrumbs = () =>
    map(steps, (step, idx) => (
      <Breadcrumb key={idx} idx={idx} title={step.label} active={step.active} handleClick={handleClick} />
    ))

  return (
    <Box display='flex' flexDirection='row'>
      {renderBreadcrumbs()}
    </Box>
  )
}
