import React from 'react'
import { Box } from '@mui/system'
import { map } from 'lodash'
import { Breadcrumb } from './BreadCrumb/Breadcrumb'
import { BreadcrumbsTemplateType } from './types'

export const Breadcrumbs: BreadcrumbsTemplateType = ({ steps, handleClick }) => {
  const renderBreadcrumbs = () =>
    map(steps, (step, idx) => (
      <Breadcrumb idx={idx} title={step.label} active={step.active} handleClick={handleClick} />
    ))

  return (
    <Box sx={{ display: { xs: 'none', sm: 'flex' } }} flexDirection='row'>
      {renderBreadcrumbs()}
    </Box>
  )
}
