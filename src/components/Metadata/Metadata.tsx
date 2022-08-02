import React from 'react'
import { Divider, ListItem, ListItemText } from '@mui/material'
import { Box } from '@mui/system'
import { MetadataTemplateType } from './types'
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
    <ListItem sx={{ px: 0 }} secondaryAction={secondaryAction} disableGutters={disableGutters}>
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
      <ListItemText disableTypography primary={title} secondary={subtitle} />
    </ListItem>
  ) : (
    <Box flexDirection='column' textAlign='center' alignItems='center' display='flex'>
      {image && image}
      <ListItemText disableTypography primary={title} secondary={subtitle} />
    </Box>
  )
