import { Box, Button } from '@mui/material'
import { map } from 'lodash'
import React, { useState } from 'react'
import { BUTTON_LINEAR_GRADIENT, MTHBLUE } from '../../../../utils/constants'

type UserFiltersProps = {
  filters: Array<string>
  setFilters: (value: Array<string>) => void
}

export const UserFilters = ({ setFilters, filters }: UserFiltersProps) => {
  const roles = [
    {
      id: 1,
      name: 'Observer',
      type: 'role',
    },
    {
      id: 2,
      name: 'Parent',
      type: 'role',
    },
    {
      id: 3,
      name: 'Student',
      type: 'role',
    },
    {
      id: 4,
      name: 'Admin',
      type: 'role',
    },
    {
      id: 5,
      name: 'Teacher',
      type: 'role',
    },
    {
      id: 6,
      name: 'Inactive',
      type: 'field',
    },
    {
      id: 7,
      name: 'School Partner',
      type: 'role',
    },
  ]

  const handleSelectFilter = (value) => {
    if (filters.includes(value)) {
      setFilters(filters.filter((item) => item !== value))
    } else {
      setFilters([...filters, ...[value]])
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingX: 15,
        marginY: 3,
      }}
    >
      {map(roles, (role) => (
        <Button
          key={role.id}
          variant={filters.findIndex((filter) => filter === role.name) !== -1 ? 'text' : 'outlined'}
          onClick={() => handleSelectFilter(role?.name)}
          sx={{
            color: filters.findIndex((filter) => filter === role.name) !== -1 ? 'white' : MTHBLUE,
            background:
              filters.findIndex((filter) => filter === role.name) !== -1 ? BUTTON_LINEAR_GRADIENT : 'transparent',
            borderRadius: 2,
            textTransform: 'none',
            height: 25,
            fontWeight: '700',
            width: '115px',
            fontSize: '12px',
          }}
        >
          {role.name}
        </Button>
      ))}
    </Box>
  )
}
