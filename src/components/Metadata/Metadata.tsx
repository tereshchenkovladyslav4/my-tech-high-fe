import { Divider, ListItem, ListItemText } from '@mui/material'
import React from 'react'
import { MetadataTemplateType } from './types'
import { Box } from '@mui/system'
export const Metadata: MetadataTemplateType = ({
  image,
  title,
  subtitle,
  secondaryAction,
  verticle,
  disableGutters,
  divider,
}) =>
  !verticle ? (
    <ListItem secondaryAction={secondaryAction} disableGutters={disableGutters}>
      {divider && (
        <Divider
          sx={{
            background: 'black',
            height: 35,
            marginX: 3,
          }}
          variant='middle'
          orientation='vertical'
        />
      )}
      {image && image}
      <ListItemText primary={title} secondary={subtitle} />
    </ListItem>
  ) : (
    <Box flexDirection='column' textAlign='center' alignItems='center' display='flex'>
      {image && image}
      <ListItemText primary={title} secondary={subtitle} />
    </Box>
  )
