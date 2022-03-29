import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Card } from './Card'

export default {
  title: 'Components/Card',
  component: Card,
} as ComponentMeta<typeof Card>

export const Default: ComponentStory<typeof Card> = () => <Card>This is a card</Card>
