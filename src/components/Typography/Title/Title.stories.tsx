import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Title } from './Title'

export default {
  title: 'Typography/Title',
  component: Title,
} as ComponentMeta<typeof Title>

export const LargeTitle: ComponentStory<typeof Title> = () => <Title size='large'> This is a large title</Title>

export const MediumTitle: ComponentStory<typeof Title> = () => <Title size='medium'>This is a medium title </Title>

export const SmallTitle: ComponentStory<typeof Title> = () => <Title size='small'> This is a small title</Title>
