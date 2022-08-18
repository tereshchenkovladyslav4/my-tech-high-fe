import React, { useContext } from 'react'
import { Box, Button, Card, Typography } from '@mui/material'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { useRegionByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { ResourceConfirmProps } from '../types'

const ResourceConfirm: React.FC<ResourceConfirmProps> = ({ totalPrice, onConfirm, onCancel }) => {
  const { me } = useContext(UserContext)

  const { region } = useRegionByRegionId(me?.userRegion && me?.userRegion[0].region_id)

  return (
    <Card sx={{ padding: 4 }}>
      <Box>
        {region?.resource_confirm_details && region.resource_confirm_details.length > 8 && (
          <Subtitle
            sx={{
              textAlign: 'left',
              borderBottom: `solid 1px ${MthColor.LIGHTGRAY}`,
              maxWidth: '70%',
              mt: 2,
              px: 4,
              pb: '48px',
            }}
          >
            <Typography
              component={'span'}
              variant={'body2'}
              dangerouslySetInnerHTML={{ __html: region?.resource_confirm_details || '' }}
            />
          </Subtitle>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px' }}>
          <Box>
            {!!totalPrice && (
              <Box sx={{ display: 'flex', alignItems: 'end' }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 700, mr: 2 }}>Sum</Typography>
                <Typography sx={{ fontSize: '36px', fontWeight: 700, lineHeight: 1 }}>${totalPrice}</Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'end', gap: '20px' }}>
            <Button
              sx={{ width: '160px', height: '36px', background: MthColor.SYSTEM_08, borderRadius: '50px' }}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              sx={{
                width: '160px',
                height: '36px',
                background: MthColor.BLACK,
                borderRadius: '50px',
                color: MthColor.WHITE,
              }}
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

export default ResourceConfirm
