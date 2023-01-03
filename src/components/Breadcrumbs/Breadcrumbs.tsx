import React from 'react'
import { Box } from '@mui/system'
import { map } from 'lodash'
import { Breadcrumb } from './BreadCrumb/Breadcrumb'
import { BreadCrumbsProps } from './types'

export const Breadcrumbs: React.FC<BreadCrumbsProps> = ({ steps, handleClick }) => {
  const renderBreadcrumbs = () =>
    map(steps, (step, idx) => (
      <Breadcrumb key={idx} idx={idx} title={step.label} active={step.active} handleClick={handleClick} />
    ))

  return (
    <Box sx={{ display: { xs: 'none', sm: 'flex' } }} flexDirection='row'>
      {renderBreadcrumbs()}
    </Box>
  )
}
