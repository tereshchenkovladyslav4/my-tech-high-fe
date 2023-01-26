import React from 'react'
import { Divider, ListItem, ListItemText } from '@mui/material'
import { Box } from '@mui/system'
import { MthColor } from '@mth/enums'
import { MetadataTemplateType } from './types'
export const Metadata: MetadataTemplateType = ({
  image,
  title,
  subtitle,
  secondaryAction,
  verticle,
  disableGutters,
  divider,
  borderBottom,
}) =>
  !verticle ? (
    <ListItem
      sx={!borderBottom ? { px: 0 } : { px: 0, paddingBottom: '3px', borderBottom: '5px solid ' + MthColor.MTHBLUE }}
      secondaryAction={secondaryAction}
      disableGutters={disableGutters}
    >
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
