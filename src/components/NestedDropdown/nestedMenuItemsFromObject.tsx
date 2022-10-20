import React, { useState } from 'react'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import { Collapse, Typography } from '@mui/material'
import { MenuItemData } from '@mth/components/NestedDropdown/types'
import { MthColor } from '@mth/enums'
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
    const { leftIcon, rightIcon, label, items, moreItems, showMoreLabel, showLessLabel, callback, customModalProps } =
      item
    const [showMore, setShowMore] = useState<boolean>(false)

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
        >
          {/* Call this function to nest more items */}
          {nestedMenuItemsFromObject({
            menuItemsData: items,
            isOpen,
            handleClose,
          })}
          {!!moreItems?.length && (
            <Collapse in={showMore} timeout='auto' unmountOnExit>
              {nestedMenuItemsFromObject({
                menuItemsData: moreItems,
                isOpen,
                handleClose,
              })}
            </Collapse>
          )}
          {!!moreItems?.length && (
            <IconMenuItem
              label={
                <Typography sx={{ color: MthColor.MTHBLUE }} component={'span'}>
                  {showMore
                    ? showLessLabel || 'Hide options for other grades'
                    : showMoreLabel || 'Show options for other grades'}
                </Typography>
              }
              rightIcon={
                <ExpandMoreOutlinedIcon
                  sx={{
                    color: MthColor.MTHBLUE,
                    transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                    transform: showMore ? 'rotate(180deg)' : '',
                  }}
                />
              }
              onClick={() => {
                setShowMore(!showMore)
              }}
            />
          )}
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
