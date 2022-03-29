import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Breadcrumb } from './Breadcrumb'

export default {
  title: 'Components/Breadcrumbs/Breadcrumb',
  component: Breadcrumb,
} as ComponentMeta<typeof Breadcrumb>

export const Default: ComponentStory<typeof Breadcrumb> = () => <Breadcrumb title='Contacts' />

export const ActiveBreadcrumb: ComponentStory<typeof Breadcrumb> = () => <Breadcrumb title='Documents' active={true} />
