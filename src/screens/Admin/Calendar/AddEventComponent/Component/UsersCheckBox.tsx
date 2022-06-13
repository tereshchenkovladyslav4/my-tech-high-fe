import { Box, Checkbox, FormControlLabel, Grid } from '@mui/material'
import React, { useState } from 'react'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { map } from 'lodash'
import { DropDownItem } from '../../../SiteManagement/components/DropDown/types'

type UsersCheckBoxProps = {
  users: string[]
  setUsers: (value: string[]) => void
}
const UsersCheckBox = ({ users, setUsers }: UsersCheckBoxProps) => {
  const [userList, setUserList] = useState<DropDownItem[]>([
    {
      label: 'Parents/Observers',
      value: 'parent/observers',
    },
    {
      label: 'Students',
      value: 'students',
    },
    {
      label: 'Teachers & Assistants',
      value: 'teacher&assistants',
    },
    {
      label: 'Admin',
      value: 'admin',
    },
  ])

  const handleChangeUsers = (e) => {
    if (users.includes(e.target.value)) {
      setUsers(users.filter((item) => item !== e.target.value && !!item))
    } else {
      setUsers([...users, e.target.value].filter((item) => !!item))
    }
  }

  const renderUsers = () =>
    map(userList, (user, index) => (
      <FormControlLabel
        key={index}
        sx={{ height: 30 }}
        control={
          <Checkbox checked={users.includes(user.value.toString())} value={user.value} onChange={handleChangeUsers} />
        }
        label={
          <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
            {user.label}
          </Paragraph>
        }
      />
    ))

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Paragraph size='large' fontWeight='700'>
        Users
      </Paragraph>
      {renderUsers()}
    </Box>
  )
}

export default UsersCheckBox
