import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Paragraph } from './Paragraph'

export default {
  title: 'Typography/Paragraph',
  component: Paragraph,
} as ComponentMeta<typeof Paragraph>

export const LargeParagraph: ComponentStory<typeof Paragraph> = () => (
  <Paragraph size='large'> Large Paragraph </Paragraph>
)

export const MediumParagraph: ComponentStory<typeof Paragraph> = () => (
  <Paragraph size='medium'> medium Paragraph </Paragraph>
)

export const SmallParagraph: ComponentStory<typeof Paragraph> = () => (
  <Paragraph size='small'> small Paragraph </Paragraph>
)
