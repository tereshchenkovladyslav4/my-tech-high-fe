import { Box } from '@mui/system'
import React, { useContext } from 'react'
import { BreadcrumbsTemplateType } from './types'
import { map } from 'lodash'
import { Breadcrumb } from './BreadCrumb/Breadcrumb'
// import { EnrollmentContext } from '../../providers/EnrollmentPacketPrivder/EnrollmentPacketProvider'

export const Breadcrumbs: BreadcrumbsTemplateType = ({ 
  steps,
  handleClick,
}) => {
  const renderBreadcrumbs = () => map(steps, (step, idx) => <Breadcrumb key={idx} idx={idx} title={step.label} active={step.active} handleClick={handleClick}/>)

  return (
    <Box display='flex' flexDirection='row'>
      {renderBreadcrumbs()}
    </Box>
  )
}
