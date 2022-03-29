import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Breadcrumbs } from './Breadcrumbs'

export default {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
} as ComponentMeta<typeof Breadcrumbs>

export const Default: ComponentStory<typeof Breadcrumbs> = () => (
  <Breadcrumbs steps={['Contact', 'Personal', 'Education', 'Documents', 'Submission']} />
)
