import { useMutation, useQuery } from '@apollo/client'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Card, InputAdornment, OutlinedInput } from '@mui/material'
import { map } from 'lodash'
import moment from 'moment'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { Pagination } from '../../../components/Pagination/Pagination'
import { HeadCell } from '../../../components/SortableTable/SortableTableHeader/types'
import { SortableUserTable } from '../../../components/SortableTable/SortableUserTable'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { WarningModal } from '../../../components/WarningModal/Warning'
import { changeUserStatusMutation } from '../../../graphql/mutation/user'
import { getUsersByRegions } from '../../../graphql/queries/user'
import { UserContext } from '../../../providers/UserContext/UserProvider'
import { BUTTON_LINEAR_GRADIENT } from '../../../utils/constants'
import { ApolloError, Region } from './interfaces'
import { NewUserModal } from './NewUserModal/NewUserModal'
import { UserFilters } from './UserFilters/UserFilters'
import debounce from 'lodash.debounce'

type UserInfo = {
  user_id: number
  name: string
  email: string
  level: string
  last_login: string
  status: number
  can_emulate: boolean
}

export const Users = () => {
  const [rows, setRows] = useState<Array<UserInfo>>([])
  const [paginatinLimit, setPaginatinLimit] = useState<number>(25)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [skip, setSkip] = useState<number>(0)
  const { me } = useContext(UserContext)
  const [apolloError, setApolloError] = useState<ApolloError>({
    title: '',
    severity: '',
    flag: false,
  })
  const [newUserModal, setNewUserModal] = useState<boolean>(false)
  const [searchField, setSearchField] = useState<string>('')
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [selectedFilter, setSelectedFilter] = useState<Array<string>>(['Parent', 'Student'])
  const [sort, setSort] = useState<string>('status|ASC')

  const { loading, error, data, refetch } = useQuery(getUsersByRegions, {
    variables: {
      skip: skip,
      sort: sort,
      take: paginatinLimit,
      search: searchField,
      filters: selectedFilter,
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const [changeUserStatus, { data: responseData, loading: uploading, error: uploadingError }] =
    useMutation(changeUserStatusMutation)

  useEffect(() => {
    if (!uploading && responseData !== undefined) {
      setApolloError({
        title: 'Status has been updated',
        severity: 'Success',
        flag: true,
      })
    } else {
      if (
        uploadingError?.networkError ||
        uploadingError?.graphQLErrors?.length > 0 ||
        uploadingError?.clientErrors.length > 0
      ) {
        setApolloError({
          title:
            uploadingError?.clientErrors[0]?.message ||
            uploadingError?.graphQLErrors[0]?.message ||
            uploadingError?.networkError?.message,
          severity: 'Error',
          flag: true,
        })
      }
    }
  }, [uploading])

  const handleStatusChange = (id: number, status: string) => {
    const payload = {
      user_id: Number(id),
      creator_id: Number(me?.user_id),
      status: status.toString(),
    }
    changeUserStatus({
      variables: payload,
      refetchQueries: [{ query: getUsersByRegions }],
    })
  }

  const sortChangeAction = (property, order) => {
    setSort(`${property}|${order}`)
    refetch()
  }

  useEffect(() => {
    if (!loading && data !== undefined) {
      const { usersByRegions } = data
      const { results, total } = usersByRegions
      const updatedRecord: Array<UserInfo> = []
      map(results, (user) => {
        const level = user?.role?.name.toLowerCase() === 'admin' ? 'Administrator' : user?.role?.name
        updatedRecord.push({
          user_id: user.user_id,
          name: `${user.first_name} ${user?.last_name}` || '',
          email: user.email,
          level: level || 'null',
          last_login: user?.last_login ? moment(user?.last_login).format('L') : 'Never',
          status: user?.status,
          can_emulate:
            user?.role?.name.toLowerCase() === 'admin' || user?.role?.name.toLowerCase() === 'super admin'
              ? true
              : false,
        })
      })
      setTotalUsers(total)
      setRows(updatedRecord)
    } else {
      if (error?.networkError || error?.graphQLErrors?.length > 0 || error?.clientErrors.length > 0) {
        setApolloError({
          title: error?.clientErrors[0]?.message || error?.graphQLErrors[0]?.message || error?.networkError?.message,
          severity: 'Error',
          flag: true,
        })
      }
    }
  }, [loading, data])

  const handleModal = () => {
    refetch()
    setNewUserModal(!newUserModal)
  }

  const headCells: HeadCell[] = [
    {
      id: 'user_id',
      numeric: false,
      disablePadding: true,
      label: 'ID',
    },
    {
      id: 'first_name',
      numeric: false,
      disablePadding: true,
      label: 'Name',
    },
    {
      id: 'email',
      numeric: false,
      disablePadding: true,
      label: 'Email',
    },
    {
      id: 'level',
      numeric: false,
      disablePadding: true,
      label: 'Level',
    },
    {
      id: 'last_login',
      numeric: false,
      disablePadding: true,
      label: 'Last Login',
    },
    {
      id: 'status',
      numeric: false,
      disablePadding: true,
      label: 'Status',
    },
    {
      id: 'can_emulate',
      numeric: false,
      disablePadding: true,
      label: 'Can Emulate',
    },
  ]

  const handlePageChange = (page) => {
    setCurrentPage(page)
    setSkip(() => {
      return paginatinLimit ? paginatinLimit * (page - 1) : 25
    })
  }

  const handleChangePageLimit = (e) => {
    setSkip(0)
    setCurrentPage(1)
    setPaginatinLimit(e)
  }

  const changeHandler = (event) => {
    setSearchField(event)
  }

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 300), [])

  return (
    <Card sx={{ paddingTop: '24px', margin: 2 }}>
      {apolloError.flag && (
        <WarningModal
          handleModem={() => setApolloError({ title: '', severity: '', flag: false })}
          title={apolloError.severity}
          subtitle={apolloError.title}
          btntitle='Close'
          handleSubmit={() => setApolloError({ title: '', severity: '', flag: false })}
        />
      )}
      <Box
        sx={{
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'row',
            marginLeft: '24px',
          }}
        >
          <Subtitle size='medium' fontWeight='700'>
            Users
          </Subtitle>
        </Box>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'left',
            justifyContent: 'flex-start',
            width: '100%',
            marginLeft: '20px',
          }}
        >
          <Box>
            <OutlinedInput
              size='small'
              fullWidth
              sx={{ width: '250px' }}
              placeholder='Search...'
              onChange={(e) => debouncedChangeHandler(e.target.value)}
              startAdornment={
                <InputAdornment position='start'>
                  <SearchIcon style={{ color: 'black' }} />
                </InputAdornment>
              }
            />
          </Box>
          <Button
            onClick={() => {
              if (me?.level === 1) {
                handleModal()
              } else {
                setApolloError({
                  title: 'You do not have access for this action.',
                  severity: 'Error',
                  flag: true,
                })
              }
            }}
            sx={{
              background: BUTTON_LINEAR_GRADIENT,
              textTransform: 'none',
              color: 'white',
              width: '150px',
              height: '39px',
              marginTop: '1px',
              marginLeft: '20px',
              borderRadius: 2,
            }}
          >
            New User
          </Button>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'right',
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <Pagination
              setParentLimit={(e) => handleChangePageLimit(e)}
              handlePageChange={handlePageChange}
              defaultValue={paginatinLimit || 25}
              numPages={Math.ceil(totalUsers / paginatinLimit)}
              currentPage={currentPage}
            />
          </Box>
        </Box>
      </Box>
      <UserFilters setFilters={setSelectedFilter} filters={selectedFilter} />
      <SortableUserTable
        rows={rows}
        headCells={headCells}
        onCheck={() => {}}
        updateStatus={handleStatusChange}
        clearAll={false}
        onRowClick={() => null}
        type='core_user'
        onSortChange={sortChangeAction}
      />
      {newUserModal && <NewUserModal visible={newUserModal} handleModem={handleModal} />}
    </Card>
  )
}
