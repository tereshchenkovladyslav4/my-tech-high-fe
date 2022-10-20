import React, { useState, useRef, useImperativeHandle, ReactNode } from 'react'
import { ChevronRight } from '@mui/icons-material'
import { Typography } from '@mui/material'
import Menu, { MenuProps } from '@mui/material/Menu'
import { MenuItemProps } from '@mui/material/MenuItem'
import { CustomModal, CustomModalType } from '@mth/components/CustomModal/CustomModals'
import { MthColor } from '@mth/enums'
import { IconMenuItem } from './IconMenuItem'

export interface NestedMenuItemProps extends Omit<MenuItemProps, 'button'> {
  parentMenuOpen: boolean
  component?: React.ElementType
  label?: string | ReactNode
  rightIcon?: React.ReactNode
  leftIcon?: React.ReactNode
  children?: React.ReactNode
  className?: string
  tabIndex?: number
  disabled?: boolean
  ContainerProps?: React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement | null>
  MenuProps?: Partial<Omit<MenuProps, 'children'>>
  button?: true | undefined
  customModalProps?: Partial<CustomModalType>
}

const NestedMenuItem = React.forwardRef<HTMLLIElement | null, NestedMenuItemProps>(function NestedMenuItem(props, ref) {
  const {
    parentMenuOpen,
    label,
    rightIcon = <ChevronRight />,
    leftIcon = null,
    children,
    className,
    tabIndex: tabIndexProp,
    ContainerProps: ContainerPropsProp = {},
    MenuProps,
    customModalProps,
    ...MenuItemProps
  } = props

  const { ref: containerRefProp, ...ContainerProps } = ContainerPropsProp

  const menuItemRef = useRef()
  useImperativeHandle(ref, () => menuItemRef?.current)

  const containerRef = useRef()
  useImperativeHandle(containerRefProp, () => containerRef.current)

  const menuContainerRef = useRef()

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)
  const [isHover, setIsHover] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const handleClick = () => {
    if (!isSubMenuOpen && customModalProps) {
      setShowAlert(true)
    }
    setIsSubMenuOpen(!isSubMenuOpen)
  }
  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    setIsHover(true)

    if (ContainerProps.onMouseEnter) {
      ContainerProps.onMouseEnter(e)
    }
  }
  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    setIsSubMenuOpen(false)
    setIsHover(false)

    if (ContainerProps.onMouseLeave) {
      ContainerProps.onMouseLeave(e)
    }
  }

  // Check if any immediate children are active
  const isSubmenuFocused = () => {
    const active = containerRef?.current?.ownerDocument.activeElement
    for (const child of menuContainerRef?.current?.children) {
      if (child === active) {
        return true
      }
    }
    return false
  }

  const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    if (e.target === containerRef.current) {
      setIsSubMenuOpen(true)
    }

    if (ContainerProps.onFocus) {
      ContainerProps.onFocus(e)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      return
    }

    if (isSubmenuFocused()) {
      e.stopPropagation()
    }

    const active = containerRef?.current?.ownerDocument.activeElement

    if (e.key === 'ArrowLeft' && isSubmenuFocused()) {
      containerRef?.current?.focus()
    }

    if (e.key === 'ArrowRight' && e.target === containerRef.current && e.target === active) {
      const firstChild = menuContainerRef?.current?.children[0]
      firstChild.focus()
    }
  }

  const open = isSubMenuOpen && parentMenuOpen

  // Root element must have a `tabIndex` attribute for keyboard navigation
  let tabIndex
  if (!props.disabled) {
    tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1
  }

  return (
    <div
      {...ContainerProps}
      ref={containerRef}
      onFocus={handleFocus}
      tabIndex={tabIndex}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      <IconMenuItem
        MenuItemProps={MenuItemProps}
        className={className}
        ref={menuItemRef}
        leftIcon={leftIcon}
        rightIcon={
          <Typography
            sx={{ display: 'flex', alignItems: 'center', visibility: isHover ? 'visible' : 'hidden' }}
            component={'span'}
          >
            {rightIcon}
          </Typography>
        }
        label={label}
        onClick={handleClick}
      />

      <Menu
        // Set pointer events to 'none' to prevent the invisible Popover div
        // from capturing events for clicks and hovers
        style={{ pointerEvents: 'none' }}
        anchorEl={menuItemRef.current}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        open={open}
        autoFocus={false}
        disableAutoFocus
        disableEnforceFocus
        onClose={() => {
          setIsSubMenuOpen(false)
        }}
        {...MenuProps}
      >
        <div ref={menuContainerRef} style={{ pointerEvents: 'auto' }}>
          {children}
        </div>
      </Menu>

      {showAlert && !!customModalProps && (
        <CustomModal
          title=''
          description=''
          confirmStr='Ok'
          showIcon={false}
          showCancel={false}
          backgroundColor={MthColor.WHITE}
          {...customModalProps}
          onClose={() => setShowAlert(false)}
          onConfirm={() => setShowAlert(false)}
        />
      )}
    </div>
  )
})

NestedMenuItem.displayName = 'NestedMenuItem'
export { NestedMenuItem }
