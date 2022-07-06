import { Box, TextField } from '@mui/material'
import React, { useState } from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import { useStyles } from '../../EditType/styles'
import { SYSTEM_05 } from '../../../../../utils/constants'

type ColorPickerProps = {
  color: string
  setColor: (value: string) => void
}

const ColorPicker = ({ color, setColor }: ColorPickerProps) => {
  const classes = useStyles
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false)
  const styles = reactCSS({
    default: {
      color: {
        width: '20px',
        height: '20px',
        borderRadius: 50,
        background: color,
        marginRight: 'auto',
        marginLeft: 'auto',
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        width: '50px',
        display: 'inline-block',
        cursor: 'pointer',
        position: 'absolute',
        right: '2px',
        top: '22px',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  })
  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker)
  }
  const handleClose = () => {
    setDisplayColorPicker(false)
  }
  const handleChange = (value: any) => {
    setColor(value.hex.toLocaleUpperCase())
  }
  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        size='small'
        label='Color'
        variant='outlined'
        inputProps={{
          style: { color: 'black' },
        }}
        InputLabelProps={{
          style: { color: SYSTEM_05 },
        }}
        sx={classes.textfield}
        fullWidth
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <Box sx={styles.swatch} onClick={handleClick}>
        <Box style={styles.color} />
      </Box>
      {displayColorPicker ? (
        <Box sx={styles.popover}>
          <Box sx={styles.cover} onClick={handleClose} />
          <SketchPicker color={color} onChange={handleChange} />
        </Box>
      ) : null}
    </Box>
  )
}

export default ColorPicker
