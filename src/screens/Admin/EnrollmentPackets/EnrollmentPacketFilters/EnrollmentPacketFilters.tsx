import React from 'react'
import { Button, Box } from '@mui/material'
import { MthColor } from '@mth/enums'

type EnrollmentPacketFiltersProps = {
  filters: unknown
  setFilters: (_: unknown) => void
  packetCount: number
}
export const EnrollmentPacketFilters: React.FC<EnrollmentPacketFiltersProps> = ({
  filters,
  setFilters,
  packetCount,
}) => {
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
        justifyContent: 'space-evenly',
        paddingX: '100px',
        marginY: 2,
        paddingY: 3,
      }}
    >
      <Button
        variant={filters.includes('Not Started') ? 'text' : 'outlined'}
        sx={{
          background: filters.includes('Not Started') && MthColor.BUTTON_LINEAR_GRADIENT,
          color: filters.includes('Not Started') ? 'white' : MthColor.MTHBLUE,
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Not Started')}
      >
        Not Started ({packetCount && packetCount['Not Started'] ? packetCount['Not Started'] : 0})
      </Button>
      <Button
        variant={filters.includes('Started') ? 'text' : 'outlined'}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          background: filters.includes('Started') && MthColor.BUTTON_LINEAR_GRADIENT,
          color: filters.includes('Started') ? 'white' : MthColor.MTHBLUE,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Started')}
      >
        Started ({packetCount && packetCount['Started'] ? packetCount['Started'] : 0})
      </Button>
      <Button
        variant={filters.includes('Missing Info') ? 'text' : 'outlined'}
        sx={{
          background: filters.includes('Missing Info') && MthColor.BUTTON_LINEAR_GRADIENT,
          color: filters.includes('Missing Info') ? 'white' : MthColor.MTHBLUE,
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Missing Info')}
      >
        Missing Info ({packetCount && packetCount['Missing Info'] ? packetCount['Missing Info'] : 0})
      </Button>
      <Button
        variant={filters.includes('Submitted') ? 'text' : 'outlined'}
        sx={{
          background: filters.includes('Submitted') && MthColor.BUTTON_LINEAR_GRADIENT,
          color: filters.includes('Submitted') ? 'white' : MthColor.MTHBLUE,
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Submitted')}
      >
        Submitted ({packetCount && packetCount['Submitted'] ? packetCount['Submitted'] : 0})
      </Button>
      <Button
        variant={filters.includes('Resubmitted') ? 'text' : 'outlined'}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          background: filters.includes('Resubmitted') && MthColor.BUTTON_LINEAR_GRADIENT,
          color: filters.includes('Resubmitted') ? 'white' : MthColor.MTHBLUE,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Resubmitted')}
      >
        Resubmitted ({packetCount && packetCount['Resubmitted'] ? packetCount['Resubmitted'] : 0})
      </Button>
      <Button
        variant={filters.includes('Age Issue') ? 'text' : 'outlined'}
        sx={{
          background: filters.includes('Age Issue') && MthColor.BUTTON_LINEAR_GRADIENT,
          color: filters.includes('Age Issue') ? 'white' : MthColor.MTHBLUE,
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Age Issue')}
      >
        Age Issue ({packetCount && packetCount['Age Issue'] ? packetCount['Age Issue'] : 0})
      </Button>
      <Button
        variant={filters.includes('Conditional') ? 'text' : 'outlined'}
        sx={{
          background: filters.includes('Conditional') && MthColor.BUTTON_LINEAR_GRADIENT,
          color: filters.includes('Conditional') ? 'white' : MthColor.MTHBLUE,
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          whiteSpace: 'nowrap',
        }}
        onClick={() => handleSelectFilter('Conditional')}
      >
        Conditional ({packetCount && packetCount['Conditional'] ? packetCount['Conditional'] : 0})
      </Button>
    </Box>
  )
}
