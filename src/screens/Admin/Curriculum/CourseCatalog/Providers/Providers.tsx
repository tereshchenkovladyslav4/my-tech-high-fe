import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { DeleteForeverOutlined } from '@mui/icons-material'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import CreateIcon from '@mui/icons-material/Create'
import DehazeIcon from '@mui/icons-material/Dehaze'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'
import { Box, Button, Card, IconButton, Tooltip } from '@mui/material'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { CartEventType, MthColor, ReduceFunds } from '@mth/enums'
import { useProviders } from '@mth/hooks'
import { SchoolYear } from '@mth/models'
import Courses from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/Courses'
import ProviderConfirmModal from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/ProviderConfirmModal/ProviderConfirmModal'
import { ProviderEdit } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/ProviderEdit'
import { Provider } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/types'
import {
  createOrUpdateCourseMutation,
  createOrUpdateProviderMutation,
  deleteProviderMutation,
} from '@mth/screens/Admin/Curriculum/CourseCatalog/services'
import { commonClasses } from '@mth/styles/common.style'
import CourseCatalogHeader from '../Components/CourseCatalogHeader/CourseCatalogHeader'

const Providers: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(0)
  const [selectedYearData, setSelectedYearData] = useState<SchoolYear | undefined>()
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
  const [updateCourse, {}] = useMutation(createOrUpdateCourseMutation)

  const fields: MthTableField<Provider>[] = [
    {
      key: 'name',
      label: 'Provider',
      sortable: false,
      width: '35%',
    },
    {
      key: 'reducesFunds',
      label: 'Reduces Funds',
      sortable: false,
      width: '20%',
    },
    {
      key: 'multiplePeriods',
      label: 'Multiple Periods',
      sortable: false,
      width: '20%',
    },
    {
      key: 'action',
      label: '',
      sortable: false,
      width: 'calc(25% - 48px)',
      formatter: (item: MthTableRowItem<Provider>, dragHandleProps) => {
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
                <Tooltip title='Move' placement='top'>
                  <IconButton className='actionButton' color='primary' {...dragHandleProps}>
                    <DehazeIcon />
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
    const selectableCount = provider.Courses?.filter((course) => course.is_active)?.length || 0
    const selectedCount = provider.Courses?.filter((course) => course.allow_request)?.length || 0
    return {
      key: `provider-${showArchived}-${provider.id}`,
      columns: {
        name: provider.name,
        reducesFunds: provider.reduce_funds === ReduceFunds.NONE ? 'No' : 'Yes',
        multiplePeriods: provider.multiple_periods === undefined ? 'N/A' : provider.multiple_periods ? 'Yes' : 'No',
      },
      selectable: !showArchived && provider.is_active,
      isSelected: provider.allow_request,
      isSelectedPartial: selectedCount > 0 && selectedCount < selectableCount,
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
    const promises: Promise<void>[] = []
    newItems.forEach((item) => {
      const allowRequest = !!item.isSelected
      if (item.rawData.allow_request != allowRequest) {
        item.rawData = { ...item.rawData, allow_request: allowRequest }
        promises.push(
          new Promise<void>(async (resolve) => {
            await updateProvider({
              variables: {
                createProviderInput: {
                  id: Number(item.rawData.id),
                  allow_request: !!item.isSelected,
                },
              },
            })
            resolve()
          }),
        )
        item.rawData.Courses?.forEach(async (course) => {
          promises.push(
            new Promise<void>(async (resolve) => {
              await updateCourse({
                variables: {
                  createCourseInput: {
                    id: Number(course.id),
                    allow_request: allowRequest,
                  },
                },
              })
              resolve()
            }),
          )
        })
      }
    })

    setTableData(newItems)
    Promise.all(promises).then(() => {
      refetch()
    })
  }
  useEffect(() => {
    setTableData(
      (providers || []).map((item) => {
        return createData(item)
      }),
    )
  }, [providers])

  const handleArrange = async (arrangedItems: MthTableRowItem<Provider>[]) => {
    arrangedItems.map(async (item, index) => {
      const correctPriority = index + 1
      if (item.rawData.priority != correctPriority) {
        item.rawData = { ...item.rawData, priority: correctPriority }
        await updateProvider({
          variables: {
            createProviderInput: {
              id: Number(item.rawData.id),
              priority: correctPriority,
            },
          },
        })
      }
    })
    setTableData(arrangedItems)
  }

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
            isDraggable={true}
            checkBoxColor='secondary'
            onArrange={handleArrange}
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
          schoolYearData={selectedYearData}
          schoolYearId={selectedYear}
          item={selectedProvider}
          refetch={refetch}
          setShowEditModal={setShowEditModal}
          providers={tableData.map((obj) => obj.rawData)}
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
              case CartEventType.ARCHIVE: {
                await handleToggleActive(selectedProvider)
                break
              }
              case CartEventType.UNARCHIVE: {
                await handleToggleActive(selectedProvider)
                break
              }
              case CartEventType.DELETE: {
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
