import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Metadata } from './Metadata'
import { Title } from '../Typography/Title/Title'
import { Subtitle } from '../Typography/Subtitle/Subtitle'
import { Avatar } from '@mui/material'

export default {
  title: 'Components/Metadata',
  component: Metadata,
} as ComponentMeta<typeof Metadata>

const imageURL =
  'https://cdn.vox-cdn.com/thumbor/zFJuBWv5NjSeVilWJntvQcgji5M=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/19979927/jomi_avatar_nickleodeon_ringer.jpg'

export const Default: ComponentStory<typeof Metadata> = () => (
  <Metadata
    title='Hunter'
    subtitle='5th Grade'
    image={<Avatar style={{ marginRight: 12 }} alt='Remy Sharp' src={imageURL} variant='circular' />}
  />
)

export const UsingTypographyComponent: ComponentStory<typeof Metadata> = () => (
  <Metadata
    title='Hunter'
    subtitle='5th Grade'
    image={<Avatar style={{ marginRight: 12 }} alt='Remy Sharp' src={imageURL} variant='rounded' />}
  />
)

export const VerticleMetadata: ComponentStory<typeof Metadata> = () => (
  <Metadata
    title={<Title>Hunter</Title>}
    subtitle={<Subtitle size={'large'}>5th Grade</Subtitle>}
    image={<Avatar alt='Remy Sharp' src={imageURL} variant='rounded' />}
    rounded
    verticle
  />
)
