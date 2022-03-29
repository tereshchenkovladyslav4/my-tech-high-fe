import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Table } from './Table'
import { Title } from '../Typography/Title/Title'

export default {
  title: 'Components/Table',
  component: Table,
} as ComponentMeta<typeof Table>

export const Default: ComponentStory<typeof Table> = () => {
  const tableHeaders = ['Name', 'Age', 'Sex']
  const data = [
    {
      name: 'Bob',
      age: 12,
      sex: 'M',
    },
    {
      name: 'Fob',
      age: 14,
      sex: 'F',
    },
    {
      name: 'Job',
      age: 56,
      sex: 'M',
    },
  ]
  return <Table tableHeaders={tableHeaders} tableBody={data} />
}

export const NoHeader: ComponentStory<typeof Table> = () => {
  const data = [
    {
      name: 'Bob',
      age: 12,
      sex: 'M',
    },
    {
      name: 'Fob',
      age: 14,
      sex: 'F',
    },
    {
      name: 'Job',
      age: 56,
      sex: 'M',
    },
  ]
  return <Table tableBody={data} />
}

export const ComponentsForCells: ComponentStory<typeof Table> = () => {
  const data = [
    {
      name: <Title>Bob</Title>,
      age: <Title>12</Title>,
      sex: <Title>F</Title>,
    },
    {
      name: <Title>Job</Title>,
      age: <Title>22</Title>,
      sex: <Title>Bob</Title>,
    },
    {
      name: <Title>Fob</Title>,
      naageme: <Title>44</Title>,
      sex: <Title>F</Title>,
    },
  ]
  return <Table tableBody={data} />
}
