import { Box, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material'
import React from 'react'
import EastIcon from '@mui/icons-material/East'
import { useHistory } from 'react-router-dom'
import { ItemCardProps } from './ItemCardProps'
import AddNewIcon from '../../assets/add-new.png';
import EditIcon from '@mui/icons-material/Edit';
import DehazeIcon from '@mui/icons-material/Dehaze'
import LoginIcon from '@mui/icons-material/Login';
import { SYSTEM_01 } from '../../utils/constants'

export const ItemCard: React.FC<ItemCardProps> = ({ title, subTitle, img, link, isLink, onClick, action }) => {
  const history = useHistory()
  return (
    <Card
      id="item-card"
      sx={{
        position: "relative",
        cursor: 'pointer',
        borderRadius: 2,
        marginX: 4,
      }}
      onClick={(e) => {
        isLink !== false ? history.push(link) : onClick()
      }}
    >
      <CardMedia component='img' sx={{ minHeight: img ? "auto" : 240 }} src={img} />
      {!img && <img onClick={() => history.push(link)} src={AddNewIcon} style={{ position: "absolute", top: 15, right: 15 }} />}
      <CardContent sx={{ textAlign: "left" }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: subTitle ? "center" : "flex-start",
          alignContent: 'flex-start',
        }}>
          <Typography fontSize='20px' component='div'>
            {title}
          </Typography>
          {!action &&
            <EastIcon sx={{ mt: subTitle ? 0 : 0.75 }} />
          }
        </Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography color='#A1A1A1' fontSize='16px' fontWeight='700px' sx={{ visibility: subTitle ? "shown" : "hidden" }}>
            {subTitle || "N/A"}
          </Typography>
          {action &&
            <Stack direction="row" spacing={1.5} alignItems="center">
              <DehazeIcon htmlColor={SYSTEM_01} />
              <EditIcon htmlColor={SYSTEM_01} onClick={(e) => {
                alert(`Edit ${title}`);
                e.stopPropagation();
              }} />
              <LoginIcon htmlColor={SYSTEM_01} sx={{ transform: 'rotate(90deg)' }} onClick={(e) => {
                alert(`Download ${title}`);
                e.stopPropagation();
              }} />
            </Stack>
          }
        </Stack>

      </CardContent>
    </Card >
  )
}
