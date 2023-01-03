import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Button, Card, InputAdornment, OutlinedInput } from '@mui/material'
import { map } from 'lodash'
import debounce from 'lodash.debounce'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { Pagination } from '@mth/components/Pagination/Pagination'
import { SortableUserTable } from '@mth/components/SortableTable/SortableUserTable'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import { USERS_HEADCELLS } from '@mth/constants'
import { MthColor, MthRoute } from '@mth/enums'
import { changeUserStatusMutation, becomeUserMutation, toggleMasqueradeMutation } from '@mth/graphql/mutation/user'
import { getUsersByRegions } from '@mth/graphql/queries/user'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { ApolloError } from './interfaces'
import { NewUserModal } from './NewUserModal/NewUserModal'
import { UserFilters } from './UserFilters/UserFilters'

type UserInfo = {
  user_id: number
  name: string
  email: string
  level: string
  last_login: string
  status: number
  masquerade: boolean
}

export const Users: React.FC = () => {
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

  const history = useHistory()

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

  const [toggleMasquerade] = useMutation(toggleMasqueradeMutation)

  const [becomeUserAction] = useMutation(becomeUserMutation)

  const becomeUser = (id) => {
    becomeUserAction({
      variables: {
        userId: Number(id),
      },
    })
      .then((resp) => {
        localStorage.setItem('masquerade', resp.data.masqueradeUser.jwt)
        localStorage.setItem('previousPage', '/users')
      })
      .then(() => {
        history.push(MthRoute.DASHBOARD)
        location.reload()
      })
  }

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

  const sortChangeAction = (property: string, order: string) => {
    setSort(`${property}|${order}`)
    refetch()
  }

  useEffect(() => {
    if (!loading && data !== undefined) {
      const { usersByRegions } = data
      const { results, total } = usersByRegions
      const updatedRecord: Array<UserInfo> = []
      map(results, (user) => {
        const level = user?.role?.name
        updatedRecord.push({
          user_id: user.user_id,
          name: `${user.first_name} ${user?.last_name}` || '',
          email: user.email,
          level: level || 'null',
          last_login: user?.last_login ? moment(user?.last_login).format('L') : 'Never',
          status: user?.status,
          masquerade: user?.masquerade === 1 ? true : false,
          //user?.role?.name.toLowerCase() === 'admin' || user?.role?.name.toLowerCase() === 'super admin'
          //  ? true
          //  : false,
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

  const handleMasqueradeToggle = (id: number, masquerade: boolean) => {
    const payload = {
      user_id: Number(id),
      masquerade,
    }
    toggleMasquerade({
      variables: {
        masqueradeInput: payload,
      },
      refetchQueries: [
        {
          query: getUsersByRegions,
          variables: {
            skip: skip,
            sort: sort,
            take: paginatinLimit,
            search: searchField,
            filters: selectedFilter,
            regionId: me?.selectedRegionId,
          },
        },
      ],
    })
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
              background: MthColor.BUTTON_LINEAR_GRADIENT,
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
      {rows.length > 0 && (
        <SortableUserTable
          canMasquerade={me?.masquerade}
          rows={rows}
          headCells={USERS_HEADCELLS}
          onCheck={() => {}}
          updateStatus={handleStatusChange}
          toggleMasquerade={handleMasqueradeToggle}
          clearAll={false}
          onRowClick={() => null}
          type='core_user'
          onSortChange={sortChangeAction}
          handleMasquerade={becomeUser}
        />
      )}
      {newUserModal && <NewUserModal visible={newUserModal} handleModem={handleModal} />}
    </Card>
  )
}
