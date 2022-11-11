import React from 'react'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import Button, { ButtonProps } from '@mui/material/Button'
import Menu, { MenuProps } from '@mui/material/Menu'
import { MenuItemData } from '@mth/components/NestedDropdown/types'
import { nestedMenuItemsFromObject } from './nestedMenuItemsFromObject'

interface NestedDropdownProps {
  children?: React.ReactNode
  menuItemsData?: MenuItemData
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  ButtonProps?: Partial<ButtonProps>
  MenuProps?: Partial<MenuProps>
}

export const NestedDropdown = React.forwardRef<HTMLDivElement | null, NestedDropdownProps>(function NestedDropdown(
  props,
  ref,
) {
  const [anchorEl, setAnchorEl] = React.useState<null | Element | ((element: Element) => Element)>(null)
  const open = Boolean(anchorEl)

  const { menuItemsData: data, onClick, ButtonProps, MenuProps, ...rest } = props

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget)
    if (onClick) onClick(e)
  }
  const handleClose = () => setAnchorEl(null)

  const menuItems = nestedMenuItemsFromObject({
    menuItemsData: data?.items || [],
    isOpen: open,
    handleClose,
  })

  return (
    <div ref={ref} {...rest}>
      <Button onClick={handleClick} endIcon={<ExpandMoreOutlinedIcon />} {...ButtonProps}>
        {data?.label}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} {...MenuProps}>
        {menuItems}
      </Menu>
    </div>
  )
})
