import React, { FunctionComponent, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Button from '@mui/material/Button'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import { useFormContext } from 'react-hook-form'
import { BUTTON_LINEAR_GRADIENT } from '../../../../utils/constants'
import { getEnrollmentPacketStatusesQuery } from '../services'
import { EnrollmentPacketFormType } from './types'

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
  },
}))

export const EnrollmentPacketDropDownButton: FunctionComponent = () => {
  const { watch, setValue } = useFormContext<EnrollmentPacketFormType>()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const [status] = watch(['status', 'packetStatuses'])
  const [pkStatues, setPkStatues] = useState([])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const { data } = useQuery(getEnrollmentPacketStatusesQuery, {
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    console.log(data?.packetStatuses?.results)
    if (data?.packetStatuses?.results) {
      setValue('packetStatuses', data?.packetStatuses?.results)
      setPkStatues(data?.packetStatuses?.results)
    }
  }, [data])

  const handlePacketStatus = (name: unknown) => {
    setValue('status', name)
    setValue('preSaveStatus', name)
    setAnchorEl(null)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // const onChangeStatus = async (status: string) => {
  //   await savePacket({
  //     variables: {
  //       enrollmentPacketInput: {
  //         admin_notes: selectedPacket.admin_notes,
  //         packet_id: parseInt(selectedPacket.packet_id),
  //         secondary_phone: selectedPacket?.secondaryPhone,
  //         secondary_email: selectedPacket?.secondaryEmail,
  //         birth_country: selectedPacket?.country,
  //         birth_place: selectedPacket?.birthPlace,
  //         hispanic: parseInt(selectedPacket?.hispanic),
  //         race: selectedPacket.race,
  //         language: selectedPacket?.firstLanguageLearned,
  //         language_home: selectedPacket?.languageUsedByAdults,
  //         language_home_child: selectedPacket?.languageUsedByChild,
  //         language_friends: selectedPacket?.languageUsedOutside,
  //         language_home_preferred: selectedPacket?.prefferredLanguage,
  //         last_school_type: selectedPacket?.schoolType ? 1 : 0,
  //         last_school: selectedPacket?.nameOfSchool,
  //         last_school_address: selectedPacket?.addressOfSchool,
  //         school_district: selectedPacket?.schoolDistrict,
  //         household_size: parseInt(selectedPacket?.houseHoldSize),
  //         household_income: parseInt(selectedPacket?.houseHoldIncome),
  //         worked_in_agriculture: parseInt(selectedPacket?.workinAgriculture),
  //         military: parseInt(selectedPacket?.military),
  //         ferpa_agreement: parseInt(selectedPacket?.ferpaAgreement),
  //         dir_permission: parseInt(selectedPacket?.dirPermission),
  //         photo_permission: parseInt(selectedPacket?.photoPermission),
  //         status: status,
  //       },
  //     },
  //   })
  //   refetch()
  //   setSelectedPacket({ ...selectedPacket, status: status })
  // }

  return (
    <div>
      <Button
        id='demo-customized-button'
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        variant='contained'
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          height: 25,
          background: BUTTON_LINEAR_GRADIENT,
          color: 'white',
          width: '115px',
          padding: 'unset',
        }}
      >
        {status}
      </Button>
      <StyledMenu
        id='demo-customized-menu'
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {pkStatues?.map((x: unknown, index: number) => (
          <MenuItem key={index} onClick={() => handlePacketStatus(x)} disableRipple>
            {x}
          </MenuItem>
        ))}
      </StyledMenu>
    </div>
  )
}
