import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { DeleteForeverOutlined } from '@mui/icons-material'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import CreateIcon from '@mui/icons-material/Create'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'
import { Box, Button, Card, IconButton, Tooltip } from '@mui/material'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, ReduceFunds } from '@mth/enums'
import { SchoolYearResponseType, useProviders } from '@mth/hooks'
import Courses from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/Courses'
import ProviderConfirmModal from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/ProviderConfirmModal/ProviderConfirmModal'
import { ProviderEdit } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/ProviderEdit'
import { Provider } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/types'
import {
  createOrUpdateProviderMutation,
  deleteProviderMutation,
} from '@mth/screens/Admin/Curriculum/CourseCatalog/services'
import { EventType } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects/types'
import { commonClasses } from '@mth/styles/common.style'
import CourseCatalogHeader from '../Components/CourseCatalogHeader/CourseCatalogHeader'

const Providers: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(0)
  const [selectedYearData, setSelectedYearData] = useState<SchoolYearResponseType | undefined>()
  const [searchField, setSearchField] = useState<string>('')
  const [showArchived, setShowArchived] = useState<boolean>(false)
  const [tableData, setTableData] = useState<MthTableRowItem<Provider>[]>([])
  const [selectedProvider, setSelectedProvider] = useState<Provider | undefined>()
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showArchivedModal, setShowArchivedModal] = useState<boolean>(false)
  const [showUnarchivedModal, setShowUnarchivedModal] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

  const { loading, providers, refetch } = useProviders(selectedYear, searchField, !showArchived)

  const [updateProvider, {}] = useMutation(createOrUpdateProviderMutation)
  const [deleteProvider, {}] = useMutation(deleteProviderMutation)

  const fields: MthTableField<Provider>[] = [
    {
      key: 'name',
      label: 'Provider',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'reducesFunds',
      label: 'Reduces Funds',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'multiplePeriods',
      label: 'Multiple Periods',
      sortable: false,
      tdClass: '',
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      tdClass: '',
      formatter: (item: MthTableRowItem<Provider>) => {
        return (
          <Box display={'flex'} flexDirection='row' justifyContent={'flex-end'}>
            {!(showArchived && item.rawData.is_active) && (
              <>
                <Tooltip title={item.rawData.is_active ? 'Edit' : ''} placement='top'>
                  <IconButton
                    color='primary'
                    disabled={!item.rawData.is_active}
                    className='actionButton'
                    onClick={() => {
                      setSelectedProvider(item.rawData)
                      setShowEditModal(true)
                    }}
                  >
                    <CreateIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={item.rawData.is_active ? 'Archive' : 'Unarchive'} placement='top'>
                  <IconButton
                    className='actionButton'
                    color='primary'
                    onClick={() => {
                      setSelectedProvider(item.rawData)
                      if (item.rawData.is_active) {
                        setShowArchivedModal(true)
                      } else {
                        setShowUnarchivedModal(true)
                      }
                    }}
                  >
                    {item.rawData.is_active ? <SystemUpdateAltRoundedIcon /> : <CallMissedOutgoingIcon />}
                  </IconButton>
                </Tooltip>
                {!item.rawData.is_active && (
                  <Tooltip title='Delete' placement='top'>
                    <IconButton
                      className='actionButton'
                      color='primary'
                      onClick={() => {
                        setSelectedProvider(item.rawData)
                        setShowDeleteModal(true)
                      }}
                    >
                      <DeleteForeverOutlined />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            )}
            <IconButton
              onClick={() => {
                if (item.toggleExpand) item.toggleExpand()
              }}
              className='actionButton expandButton'
              color='primary'
            >
              <ExpandMoreOutlinedIcon />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  const createData = (provider: Provider): MthTableRowItem<Provider> => {
    return {
      columns: {
        name: provider.name,
        reducesFunds: provider.reduce_funds === ReduceFunds.NONE ? 'No' : 'Yes',
        multiplePeriods: provider.multiple_periods === undefined ? 'N/A' : provider.multiple_periods ? 'Yes' : 'No',
      },
      selectable: !showArchived && provider.is_active,
      isSelected: provider.allow_request,
      rawData: provider,
      expandNode: (
        <Courses
          schoolYearId={selectedYear}
          schoolYearData={selectedYearData}
          provider={provider}
          showArchived={showArchived}
          refetch={refetch}
        />
      ),
    }
  }

  const handleToggleActive = async (provider: Provider) => {
    await updateProvider({
      variables: {
        createProviderInput: {
          id: Number(provider.id),
          is_active: !provider.is_active,
        },
      },
    })
    await refetch()
  }

  const handleDelete = async (provider: Provider) => {
    await deleteProvider({
      variables: {
        providerId: Number(provider.id),
      },
    })
    await refetch()
  }

  const handleAllowRequestChange = async (newItems: MthTableRowItem<Provider>[]) => {
    newItems.map(async (item) => {
      const allowRequest = !!item.isSelected
      if (item.rawData.allow_request != allowRequest) {
        item.rawData = { ...item.rawData, allow_request: allowRequest }
        await updateProvider({
          variables: {
            createProviderInput: {
              id: Number(item.rawData.id),
              allow_request: !!item.isSelected,
            },
          },
        })
      }
    })

    setTableData(newItems)
  }

  useEffect(() => {
    setTableData(
      (providers || []).map((item) => {
        return createData(item)
      }),
    )
  }, [providers, showArchived])

  return (
    <Box sx={commonClasses.mainLayout}>
      <Card sx={{ ...commonClasses.mainBlock, ...commonClasses.fitScreen }}>
        <CourseCatalogHeader
          title='Providers'
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          setSelectedYearData={setSelectedYearData}
          setSearchField={setSearchField}
          showArchived={showArchived}
          setShowArchived={setShowArchived}
        />

        <Box>
          <MthTable
            items={tableData}
            loading={loading}
            fields={fields}
            selectable={true}
            disableSelectAll={showArchived}
            checkBoxColor='secondary'
            isMultiRowExpandable={true}
            onSelectionChange={handleAllowRequestChange}
          />
        </Box>

        {!showArchived && (
          <Box sx={{ mt: '100px' }}>
            <Button
              variant='contained'
              sx={{
                borderRadius: 2,
                fontSize: 12,
                background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
                width: 140,
                height: 48,
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': {
                  background: MthColor.PRIMARY_MEDIUM_MOUSEOVER,
                  color: 'white',
                },
              }}
              onClick={() => {
                setSelectedProvider(undefined)
                setShowEditModal(true)
              }}
            >
              <Subtitle sx={{ fontSize: '14px', fontWeight: '700' }}>+ Add Provider</Subtitle>
            </Button>
          </Box>
        )}
      </Card>

      {showEditModal && (
        <ProviderEdit
          schoolYearId={selectedYear}
          item={selectedProvider}
          refetch={refetch}
          setShowEditModal={setShowEditModal}
        />
      )}

      {!!selectedProvider && (
        <ProviderConfirmModal
          showArchivedModal={showArchivedModal}
          setShowArchivedModal={setShowArchivedModal}
          showUnarchivedModal={showUnarchivedModal}
          setShowUnarchivedModal={setShowUnarchivedModal}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          onConfirm={async (eventType) => {
            switch (eventType) {
              case EventType.ARCHIVE: {
                await handleToggleActive(selectedProvider)
                break
              }
              case EventType.UNARCHIVE: {
                await handleToggleActive(selectedProvider)
                break
              }
              case EventType.DELETE: {
                await handleDelete(selectedProvider)
                break
              }
            }
          }}
        />
      )}
    </Box>
  )
}

export default Providers
