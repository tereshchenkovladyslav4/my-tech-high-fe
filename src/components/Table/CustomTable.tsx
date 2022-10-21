import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { ArrowDropDown } from '@mui/icons-material'
import {
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  styled,
  TableBody,
  CircularProgress,
  Box,
  TableSortLabel,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import { isEqual } from 'lodash'
import { useStyles } from './styles'
import { CustomTableProps, GroupItem, ValueOf } from './types'

const StyledTableRow = styled(TableRow)(() => ({
  '&.hover-active': {
    backgroundColor: 'rgba(161, 9, 9, 0.2) !important',
  },
  '.cell-item': {
    textAlign: 'left',
    paddingLeft: '14px',
  },
  '.group-check-item': {
    paddingLeft: 0,
  },
  '.group-check-item .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
  },
}))

const StyledTableCell = styled(TableCell)(() => ({
  '.sort-active .MuiTableSortLabel-icon': {
    color: '#000 !important',
  },
}))

const CustomTable = <T extends Record<string, unknown>>({
  fields,
  items,
  loading,
  orderBy,
  order,
  onSort,
  rowGroupBy,
  checkKey = 'id',
  checked = [],
  checkable = false,
  handleCheck,
  striped = false,
  borderedLeft = false,
  borderedBottom = false,
  size,
  isEmptyText = true,
}: CustomTableProps<T>): React.ReactElement => {
  const [checkedIds, setCheckedIds] = useState<ValueOf<T>[]>(checked)
  const [hoverGroup, setHoverGroup] = useState<unknown>('')

  const setSelectedIds = (ids: Array<ValueOf<T>>) => {
    const nonDuplicatedIds = [...new Set(ids)]
    setCheckedIds(nonDuplicatedIds)
    if (handleCheck) {
      handleCheck(nonDuplicatedIds)
    }
  }

  const handleSort = (name: string, order: 'desc' | 'asc' | undefined) => {
    if (onSort) {
      if (name !== orderBy) {
        onSort(name, 'desc')
      } else {
        onSort(name, order === 'desc' ? 'asc' : 'desc')
      }
    }
  }

  useEffect(() => {
    setSelectedIds([])
  }, [items])

  useEffect(() => {
    if (handleCheck && !isEqual(checked, checkedIds)) setSelectedIds(checked)
  }, [checked, handleCheck])

  const itemsByGroup = useMemo(() => {
    if (!!rowGroupBy) {
      const groupItems: GroupItem<T>[] = []
      items.forEach((item: T) => {
        const existIndex = groupItems.findIndex((el) => el.id == item[rowGroupBy])
        if (existIndex == -1) {
          groupItems.push({
            id: item[rowGroupBy],
            childrenIds: [item[checkKey]],
            children: [item],
          })
        } else {
          groupItems[existIndex].children.push(item)
          groupItems[existIndex].childrenIds.push(item[checkKey])
        }
      })

      return groupItems
    } else return []
  }, [items, rowGroupBy, checkKey])

  const onSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newCheckedIds: Array<ValueOf<T>>
    if (e.target.checked) {
      newCheckedIds = items.map((el) => el[checkKey]).filter((el) => !!el)
    } else newCheckedIds = []
    setSelectedIds(newCheckedIds)
  }
  const onClickCheckbox = (e: React.ChangeEvent<HTMLInputElement>, id: ValueOf<T>) => {
    let newCheckedIds: Array<ValueOf<T>> = [...checkedIds]
    if (e.target.checked) {
      newCheckedIds.push(id)
    } else {
      newCheckedIds = newCheckedIds.filter((el) => el != id)
    }
    setSelectedIds(newCheckedIds)
  }
  const onClickCheckboxAll = (e: React.ChangeEvent<HTMLInputElement>, ids: Array<ValueOf<T>>) => {
    let newCheckedIds = [...checkedIds]
    if (e.target.checked) {
      newCheckedIds.push(...ids)
    } else {
      newCheckedIds = newCheckedIds.filter((el) => !ids.includes(el))
    }
    setSelectedIds(newCheckedIds)
  }

  const getGroupCheckedSub = useCallback(
    (childrenIds) => {
      let status: boolean | 'inter' = false
      let checkedCount = 0
      checkedIds.forEach((el) => {
        if (childrenIds.includes(el)) checkedCount += 1
      })

      if (checkedCount) {
        if (checkedCount === childrenIds.length) status = true
        else status = 'inter'
      }
      return status
    },
    [checkedIds],
  )

  return (
    <TableContainer>
      <Table
        sx={useStyles.table}
        className={`${striped ? 'striped' : ''}${borderedBottom ? ' bordered-b' : ''}
        ${borderedLeft ? ' bordered-l' : ''}${size ? ' table-' + size : ''}
        ${checkable || itemsByGroup.length > 0 ? ' table-checkable' : ''}`}
      >
        <TableHead>
          <TableRow>
            {(checkable || itemsByGroup.length > 0) && (
              <TableCell>
                <Checkbox
                  color='primary'
                  indeterminate={checkedIds.length > 0 && checkedIds.length < items.length}
                  checked={items.length > 0 && checkedIds.length === items.length}
                  onChange={onSelectAllClick}
                />
              </TableCell>
            )}
            {fields.map((field) => (
              <StyledTableCell key={field.key} className={field.thClass}>
                {field.sortable ? (
                  <div className={orderBy === field.key ? 'sort-active' : ''}>
                    <TableSortLabel
                      active={true}
                      direction={orderBy === field.key ? order || 'desc' : 'desc'}
                      onClick={() => handleSort(field.key, order)}
                      IconComponent={ArrowDropDown}
                    >
                      {field.label}
                    </TableSortLabel>
                  </div>
                ) : (
                  field.label
                )}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading && items.length > 0 && (
            <>
              {!!rowGroupBy && itemsByGroup.length
                ? itemsByGroup.map((itemGroup: GroupItem<T>) => {
                    const currentCheckedStatus = getGroupCheckedSub(itemGroup.childrenIds)
                    return itemGroup.children.map((item, idx) => {
                      return (
                        <StyledTableRow
                          key={`row_${idx}`}
                          hover={!rowGroupBy}
                          role='checkbox'
                          data-group-id={`row_${itemGroup.id}`}
                          onMouseEnter={() => setHoverGroup(itemGroup.id)}
                          onMouseLeave={() => setHoverGroup('')}
                          className={itemGroup.id == hoverGroup ? 'hover-active' : ''}
                        >
                          <td>
                            {idx === 0 && (
                              <Checkbox
                                color='primary'
                                indeterminate={currentCheckedStatus === 'inter'}
                                checked={currentCheckedStatus !== 'inter' ? currentCheckedStatus : false}
                                onChange={(e) => onClickCheckboxAll(e, itemGroup.childrenIds)}
                              />
                            )}
                          </td>
                          {fields.map((field, indexCol) => (
                            <td key={`row_${idx}_col_${field.key}`} className={field.tdClass || ''}>
                              <div
                                className={`cell-item${
                                  indexCol > 0 && indexCol + 1 !== fields.length && borderedLeft ? ' border-l' : ''
                                }${indexCol === 0 ? ' group-check-item' : ''}`}
                              >
                                {indexCol === 0 && itemGroup.childrenIds.length > 1 ? (
                                  <FormControlLabel
                                    label={field.formatter ? field.formatter(item, idx) : item[field.key]}
                                    control={
                                      <Checkbox
                                        color='primary'
                                        checked={checkedIds.includes(item[checkKey])}
                                        onChange={(e) => onClickCheckbox(e, item[checkKey])}
                                        size='small'
                                      />
                                    }
                                  />
                                ) : (
                                  <span>{field.formatter ? field.formatter(item, idx) : item[field.key]}</span>
                                )}
                              </div>
                            </td>
                          ))}
                        </StyledTableRow>
                      )
                    })
                  })
                : items.map((item, idx) => (
                    <StyledTableRow key={`row_${idx}`} hover role='checkbox'>
                      {checkable && (
                        <td>
                          <Checkbox
                            color='primary'
                            checked={checkedIds.includes(item[checkKey])}
                            onChange={(e) => onClickCheckbox(e, item[checkKey])}
                          />
                        </td>
                      )}
                      {fields.map((field, indexCol) => (
                        <td key={`row_${idx}_col_${field.key}`} className={field.tdClass || ''}>
                          <div
                            className={
                              striped && indexCol > 0 && indexCol + 1 !== fields.length && borderedLeft
                                ? 'border-l cell-item'
                                : 'cell-item'
                            }
                          >
                            {field.formatter ? field.formatter(item, idx) : item[field.key]}
                          </div>
                        </td>
                      ))}
                    </StyledTableRow>
                  ))}
            </>
          )}
          {loading && (
            <StyledTableRow>
              <td colSpan={fields.length + (checkable ? 1 : 0)}>
                <Box display={'flex'} justifyContent='center' py={3}>
                  <CircularProgress />
                </Box>
              </td>
            </StyledTableRow>
          )}
          {!loading && !items.length && (
            <StyledTableRow>
              <td colSpan={fields.length + (checkable ? 1 : 0)}>
                <Box className='no-data' sx={{ opacity: 0.1, py: 2, textAlign: 'center' }}>
                  {isEmptyText ? 'Not found' : ''}
                </Box>
              </td>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export default CustomTable
