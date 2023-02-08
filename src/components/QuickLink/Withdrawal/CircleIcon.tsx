import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Box } from '@mui/material'
import DotImage from '../../../assets/icons/circle-icon/dot.png'
import EllipseBottom from '../../../assets/icons/circle-icon/ellipse-bottom.png'
import Ellipse from '../../../assets/icons/circle-icon/ellipse.png'
import MainImage from '../../../assets/icons/circle-icon/main.png'

const additionalStyles = makeStyles((theme: Theme) => ({
  MainImage: {
    position: 'relative',
  },
  MainDotImage: {
    position: 'absolute',
    top: '45%',
    left: '50%',
  },
  SecondDotImage: {
    position: 'absolute',
    top: '48%',
    left: '53.4%',
    [theme.breakpoints.down('xs')]: {
      top: '53%',
      left: '62.4%',
    },
  },
  ThirdDotImage: {
    position: 'absolute',
    top: '50%',
    left: '54.5%',
    [theme.breakpoints.down('xs')]: {
      top: '55%',
      left: '64.5%',
    },
  },
}))

const CircleIcon: React.FC = () => {
  const classes = additionalStyles()
  return (
    <Box sx={{ position: 'relative' }}>
      <img src={MainImage} style={{ position: 'relative' }} />
      <img src={Ellipse} style={{ position: 'absolute', top: '49%', left: '0%', width: '100%' }} />
      <img src={EllipseBottom} style={{ position: 'absolute', top: '279px', right: '0%' }} />
      <img src={DotImage} className={classes.MainDotImage} />
      <img src={DotImage} className={classes.SecondDotImage} />
      <img src={DotImage} className={classes.ThirdDotImage} />
    </Box>
  )
}

export { CircleIcon as default }
