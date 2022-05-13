import { Checkbox, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState, useContext } from 'react'
import { DropDown } from '../DropDown/DropDown'
import { SortableTableHeader } from './SortableTableHeader/SortableTableHeader'
import { SortableTableTemplateType } from './types'
import { UpdateUserModal } from '../../screens/Admin/Users/UpdateUserModal/UpdateUserModal'
import { UserContext } from '../../providers/UserContext/UserProvider'

type Order = 'asc' | 'desc'

export const SortableUserTable: SortableTableTemplateType = ({
  headCells,
  type,
  rows,
  onCheck,
  updateStatus,
  clearAll,
  onSortChange,
  toggleMasquerade,
  handleMasquerade,
}) => {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof any>('status')
  const [selected, setSelected] = useState<readonly string[]>([])
  const { me } = useContext(UserContext)
  const [currentUserID, setCurrentUserID] = useState(null)
  const [updateModal, setUpdateModal] = useState(false)
  const [status, _] = useState([
    {
      value: 0,
      label: 'Inactive',
    },
    {
      value: 1,
      label: 'Active',
    },
    {
      value: 2,
      label: 'Archived',
    },
  ])

  useEffect(() => {
    onCheck(selected)
  }, [selected])

  useEffect(() => {
    setSelected([])
  }, [clearAll])

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof any) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
    onSortChange(property, isAsc ? 'desc' : 'asc')
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n, idx) => idx)
      setSelected(newSelecteds) 
      return
    }
    setSelected([])
  }


  const handleMasqueradeToggle = (id: number, masquerade: boolean) => {
    toggleMasquerade(id, masquerade)
  }

  const handleBecomeUser = (id) => {
    handleMasquerade(id)
  }
  return (
    <Box sx={{ width: '100%', padding: 3 }}>
      {currentUserID && updateModal && (
        <UpdateUserModal visible={updateModal} userID={currentUserID} handleModem={() => setUpdateModal(false)} />
      )}
      <TableContainer>
        <Table sx={{ width: '87%', minWidth: 750, marginX: '95px' }} aria-labelledby='tableTitle' size='medium'>
          <SortableTableHeader
            numSelected={selected.length}
            order={order}
            orderBy={orderBy.toString()}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            headCells={headCells}
            noCheckbox
          />
          <TableBody>
            {rows.map((row, index) => {
              return (
                <TableRow hover tabIndex={-1} key={index} sx={{ cursor: 'pointer', py: 2 }}>
                  {Object.values(row).map((val: any, idx: number) => {
                    return (
                      <TableCell
                        style={{
                          paddingLeft: 0,
                          fontWeight: 700,
                          borderBottom: '1px solid #E7E7E7',
                          borderTop: '1px solid #E7E7E7',
                        }}
                        key={`${val}-${idx}`}
                      >
                        {type === 'core_user' && idx === 5 ? (
                          <DropDown
                            size='small'
                            dropDownItems={status}
                            sx={{ width: 105, height: 24, fontSize: 12, fontWeight: 700 }}
                            defaultValue={status[val].value}
                            setParentValue={(value: any) => {
                              updateStatus(Number(row?.user_id), value)
                            }}
                            disabled={me?.level !== 1}
                          />
                        ) : type === 'core_user' && idx === 6 ? (
                          (val || row.level === 'Administrator') ? (
                            
                            <Checkbox 
                              sx={{ zIndex: 9999, paddingLeft: 0 }} 
                              checked={val} 
                              size='small'  
                              onClick={() => {
                                handleMasqueradeToggle(row?.user_id, !val)
                              }}
                            />
                          ) : (
                            <Typography sx={{ fontSize: 12, fontWeight: 700 }}>N/A</Typography>
                          )
                        ) : (
                          <Box
                            onClick={() => {
                              if(idx !== 0){
                                if (me?.level === 1) {
                                  setUpdateModal(true)
                                  setCurrentUserID(row.user_id)
                                }
                              }
                            }}
                          >
                            {(type === 'core_user' && idx === 3) 
                              ? <Typography
                                  sx={{ fontSize: 12, fontWeight: 700, color: '#4145FF', textDecoration: 'underline', zIndex: 9999 }}
                              >
                                {val}
                              </Typography>
                              : idx === 0
                                ? <Tooltip title='Masquerade'>
                                  <Typography
                                    sx={{ fontSize: 12, fontWeight: 700, color: '#4145FF', textDecoration: 'underline', zIndex: 9999 }}
                                    onClick={() => idx === 0 && handleBecomeUser(row.user_id)}
                                    >
                                    {val}
                                  </Typography>
                                </Tooltip>
                                : <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{val}</Typography>
                            }
                          </Box>
                        )}
                      </TableCell>
                    )}
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
