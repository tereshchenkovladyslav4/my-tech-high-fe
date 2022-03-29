import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { EmptyState } from './EmptyState'

export default {
  title: 'Components/EmptyState',
  component: EmptyState,
} as ComponentMeta<typeof EmptyState>

export const Default: ComponentStory<typeof EmptyState> = () => (
  <EmptyState title='Congrats' subtitle='This is subtitle' />
)
