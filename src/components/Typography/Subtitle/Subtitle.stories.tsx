import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Subtitle } from './Subtitle'

export default {
  title: 'Typography/Subtitle',
  component: Subtitle,
} as ComponentMeta<typeof Subtitle>

export const LargeTitle: ComponentStory<typeof Subtitle> = () => (
  <Subtitle size='large'> This is a large Subtitle</Subtitle>
)

export const MediumTitle: ComponentStory<typeof Subtitle> = () => (
  <Subtitle size='medium'> This is a medium Subtitle</Subtitle>
)

export const SmallTitle: ComponentStory<typeof Subtitle> = () => <Subtitle> This is a small Subtitle</Subtitle>
