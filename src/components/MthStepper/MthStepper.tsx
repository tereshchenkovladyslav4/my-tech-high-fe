import React, { useCallback } from 'react'
import { Step, StepConnector, stepConnectorClasses, StepIconProps, StepLabel, Stepper, styled } from '@mui/material'
import { MthColor } from '@mth/enums'

type MthStepperProps = {
  activeStep: number
  totalPageCount: number
  setSelectStep: (value: number) => void
}

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: MthColor.MTHBLUE,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: MthColor.MTHBLUE,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}))

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#784af4',
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 16,
    height: 16,
    borderRadius: '50%',
    backgroundColor: MthColor.SYSTEM_01,
  },
  '& .QontoStepIcon-active-circle': {
    width: 16,
    height: 16,
    borderRadius: '50%',
    backgroundColor: MthColor.MTHBLUE,
  },
}))

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className} sx={{ cursor: 'pointer' }}>
      {completed ? <div className='QontoStepIcon-active-circle' /> : <div className='QontoStepIcon-circle' />}
    </QontoStepIconRoot>
  )
}

export const MthStepper: React.FC<MthStepperProps> = ({ activeStep, totalPageCount, setSelectStep }) => {
  const renderStep = useCallback(() => {
    const steps: number[] = []
    for (let i = 0; i < totalPageCount; i++) {
      steps.push(i)
    }
    return steps.map((step, index) => {
      const stepProps: { completed?: boolean } = {}
      return (
        <Step key={`step-${index}-${step}`} {...stepProps} data-testid={'step'}>
          <StepLabel
            StepIconComponent={QontoStepIcon}
            data-testid={'stepLabel'}
            onClick={() => setSelectStep(step)}
          ></StepLabel>
        </Step>
      )
    })
  }, [totalPageCount])

  return (
    <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
      {renderStep()}
    </Stepper>
  )
}
