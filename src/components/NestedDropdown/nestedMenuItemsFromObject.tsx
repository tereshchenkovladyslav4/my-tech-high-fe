import React from 'react'
import { MenuItemData } from '@mth/components/NestedDropdown/types'
import { IconMenuItem } from './IconMenuItem'
import { NestedMenuItem } from './NestedMenuItem'

export interface nestedMenuItemsFromObjectProps {
  menuItemsData: MenuItemData[]
  isOpen: boolean
  handleClose: () => void
}

export function nestedMenuItemsFromObject({
  menuItemsData: items,
  isOpen,
  handleClose,
}: nestedMenuItemsFromObjectProps): React.ReactElement[] {
  return items.map((item, index) => {
    const { leftIcon, rightIcon, label, items, callback, customModalProps } = item

    if (items && items.length > 0) {
      // Recurse deeper
      return (
        <NestedMenuItem
          key={index}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          label={label}
          parentMenuOpen={isOpen}
          customModalProps={customModalProps}
          menuItemsData={item}
        >
          {/* Call this function to nest more items */}
          {nestedMenuItemsFromObject({
            menuItemsData: items,
            isOpen,
            handleClose,
          })}
        </NestedMenuItem>
      )
    } else {
      // No children elements, return MenuItem
      return (
        <IconMenuItem
          key={index}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          label={label}
          onClick={() => {
            handleClose()
            if (callback) callback()
          }}
        />
      )
    }
  })
}
