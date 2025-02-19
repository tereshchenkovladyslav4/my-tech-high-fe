import React from 'react'
import { AppBar, Tabs } from '@mui/material'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { LinkTab } from './SegmentControlTab/SegmentControlTab'
import { useStyles } from './styles'

export const SegmentedControl: React.FC = () => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.ChangeEvent<unknown>, newValue: number) => {
    setValue(newValue)
  }
  const classes = useStyles
  return (
    <AppBar position='static' elevation={9} style={{ borderRadius: '25px', backgroundColor: 'white' }}>
      <Tabs value={value} onChange={handleChange} sx={classes.tabs}>
        <LinkTab label={<Paragraph size='medium'>Read</Paragraph>} href='/trash' sx={classes.tabTwo} />
        <LinkTab label={<Paragraph size='medium'>Unread</Paragraph>} href='/spam' sx={classes.tabThree} />
      </Tabs>
    </AppBar>
  )
}
