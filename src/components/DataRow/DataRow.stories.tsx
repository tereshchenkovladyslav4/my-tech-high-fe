import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { DataRow } from './DataRow'

import { Subtitle } from '../Typography/Subtitle/Subtitle'
import { Title } from '../Typography/Title/Title'

export default {
  title: 'Components/DataRow',
  component: DataRow,
} as ComponentMeta<typeof DataRow>

export const Default: ComponentStory<typeof DataRow> = () => (
  <DataRow backgroundColor='red' label={<Title>Left Label</Title>} value={<Subtitle>Right Value</Subtitle>} />
)
