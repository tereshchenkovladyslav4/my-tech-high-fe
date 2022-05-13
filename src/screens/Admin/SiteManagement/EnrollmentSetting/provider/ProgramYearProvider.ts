import React, { createContext } from 'react'

export type ProgramYearContextType = {
    programYear?: string,
    setProgramYear?: React.Dispatch<React.SetStateAction<string | null>>
}

const programYearContext: ProgramYearContextType = {
  programYear: undefined,
  setProgramYear: (_) => {},
}

export const ProgramYearContext = createContext(programYearContext)
