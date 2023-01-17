import React from 'react'
import { Box } from '@mui/material'
import BgBlue from '@mth/assets/quick-link-blue.png'
import BgOrange from '@mth/assets/quick-link-orange.png'
import { CardGrid, CardItem } from '@mth/components/CardGrid'
import { Layout } from '@mth/components/Layout'
import { MthRoute } from '@mth/enums'

export const Reimbursements: React.FC = () => {
  const items: CardItem[] = [
    {
      id: 1,
      icon: 'Requests',
      title: (
        <>
          <Box>Direct Orders &</Box>
          <Box>Reimbursements</Box>
        </>
      ),
      img: BgOrange,
      link: MthRoute.REIMBURSEMENTS_REQUESTS,
    },
    {
      id: 2,
      icon: 'Settings',
      title: 'Configure',
      img: BgBlue,
      link: MthRoute.REIMBURSEMENTS_SETTINGS,
    },
    {
      id: 3,
      icon: 'Reimbursement Forms',
      title: 'Edit Request Forms',
      img: BgOrange,
      link: MthRoute.REIMBURSEMENTS_REIMBURSEMENT_FORM,
    },
    {
      id: 4,
      icon: 'Direct Order Forms',
      title: 'Edit Request Forms',
      img: BgBlue,
      link: MthRoute.REIMBURSEMENTS_DIRECT_ORDER_FORM,
    },
  ]

  return (
    <Layout>
      <Box sx={{ paddingX: 2, marginTop: 4, marginBottom: 4 }}>
        <CardGrid items={items}></CardGrid>
      </Box>
    </Layout>
  )
}
