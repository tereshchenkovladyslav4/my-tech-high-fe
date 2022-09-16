import React, { useCallback, useContext, useEffect, useState } from 'react'
import { DeleteForeverOutlined } from '@mui/icons-material'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing'
import CreateIcon from '@mui/icons-material/Create'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import SearchIcon from '@mui/icons-material/Search'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'
import {
  Box,
  Button,
  ButtonBase,
  Card,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import { debounce } from 'lodash'
import { useHistory } from 'react-router-dom'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { MthTable } from '@mth/components/MthTable'
import { MthTableField, MthTableRowItem } from '@mth/components/MthTable/types'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import Courses from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/Courses'
import { Provider } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/types'
import { providersClasses } from './styles'

const Providers: React.FC = () => {
  const { me } = useContext(UserContext)
  const history = useHistory()

  const { dropdownItems: schoolYearDropdownItems, schoolYears: schoolYears } = useSchoolYearsByRegionId(
    me?.selectedRegionId,
  )

  const providersData: Provider[] = [
    {
      id: 1,
      title: 'Accelerated Spark Online Elementary',
      reducesFunds: false,
      multiplePeriods: false,
      active: true,
    },
    {
      id: 2,
      title: 'ALEKS Math',
      reducesFunds: undefined,
      multiplePeriods: false,
      active: true,
      courses: [
        {
          name: 'Algebra 1',
          grades: '9-12',
          diplomaSeeking: false,
          reducesFunds: false,
          semesterOnly: false,
          limit: 0,
          subjects: 'Algebra 1, High School Math',
          active: true,
        },
        {
          name: 'Algebra 2',
          grades: '9-12',
          diplomaSeeking: false,
          reducesFunds: true,
          semesterOnly: false,
          limit: 200,
          subjects: 'Algebra 2, High School Math',
          active: false,
        },
        {
          name: 'Algebra 3',
          grades: '9-12',
          diplomaSeeking: false,
          reducesFunds: true,
          semesterOnly: false,
          limit: 150,
          subjects: 'Algebra 3, High School Math',
          active: false,
        },
      ],
    },
    {
      id: 3,
      title: 'APEX Learning',
      reducesFunds: false,
      multiplePeriods: false,
      active: false,
    },
    {
      id: 4,
      title: 'Beast Academy Online',
      reducesFunds: false,
      multiplePeriods: false,
      active: true,
    },
  ]

  const [loading] = useState(false)
  const [selectedYear, setSelectedYear] = useState<string | number>('')
  const [searchField, setSearchField] = useState<string>('')
  const [showArchived, setShowArchived] = useState<boolean>(false)
  const [providers] = useState<Provider[]>(providersData)

  const fields: MthTableField<Provider>[] = [
    {
      key: 'title',
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
            <Tooltip title={item.rawData.active ? 'Edit' : ''}>
              <IconButton color='primary' disabled={!item.rawData.active} className='actionButton'>
                <CreateIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={item.rawData.active ? 'Archive' : 'Unarchive'}>
              <IconButton className='actionButton' color='primary'>
                {item.rawData.active ? <SystemUpdateAltRoundedIcon /> : <CallMissedOutgoingIcon />}
              </IconButton>
            </Tooltip>
            {!item.rawData.active && (
              <Tooltip title='Delete'>
                <IconButton className='actionButton' color='primary'>
                  <DeleteForeverOutlined />
                </IconButton>
              </Tooltip>
            )}
            {item.rawData.active && (
              <Tooltip title='Expand'>
                <IconButton
                  onClick={() => {
                    if (item.toggleExpand) item.toggleExpand()
                  }}
                  className='actionButton expandButton'
                  color='primary'
                >
                  <ExpandMoreOutlinedIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )
      },
    },
  ]

  const [tableData, setTableData] = useState<MthTableRowItem<Provider>[]>([])

  const backAction = () => {
    history.goBack()
  }

  const changeHandler = (event = '') => {
    setSearchField(event)
  }
  const debouncedChangeHandler = useCallback(debounce(changeHandler, 300), [])

  const createData = (provider: Provider): MthTableRowItem<Provider> => {
    return {
      columns: {
        title: provider.title,
        reducesFunds: provider.reducesFunds === undefined ? 'N/A' : provider.reducesFunds ? 'Yes' : 'No',
        multiplePeriods: provider.multiplePeriods === undefined ? 'N/A' : provider.multiplePeriods ? 'Yes' : 'No',
      },
      selectable: provider.active,
      rawData: provider,
      expandNode: <Courses courses={provider.courses} />,
    }
  }

  useEffect(() => {
    if (providers?.length) {
      setTableData(
        providers
          .map((item) => {
            return { ...item, courses: item.courses?.filter((x) => showArchived || x.active) }
          })
          .map((item) => {
            return createData(item)
          }),
      )
    }
  }, [providers, showArchived])

  useEffect(() => {
    if (schoolYears?.length) setSelectedYear(schoolYears[0].school_year_id)
  }, [schoolYears])

  return (
    <Box sx={{ p: 4, textAlign: 'left' }}>
      <Card sx={{ p: 4, borderRadius: '12px', boxShadow: '0px 0px 35px rgba(0, 0, 0, 0.05)' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
          }}
        >
          <Grid container sx={{ background: 'inherit' }}>
            <ButtonBase onClick={backAction} disableRipple>
              <Grid container justifyContent='flex-start' alignItems='center'>
                <ArrowBackIosOutlinedIcon />
                <Typography sx={{ fontWeight: 700, fontSize: 20, ml: 4 }}>Providers</Typography>
              </Grid>
            </ButtonBase>
          </Grid>
          <Box display='flex' flexDirection='row' justifyContent='flex-end' alignItems='center'>
            <DropDown
              dropDownItems={schoolYearDropdownItems}
              placeholder={'Select Year'}
              defaultValue={selectedYear}
              borderNone={true}
              setParentValue={(val) => {
                setSelectedYear(val)
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
          }}
        >
          <Box sx={{ width: { xs: '100%', md: '280px' } }}>
            <OutlinedInput
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'Search...')}
              size='small'
              fullWidth
              value={searchField ? searchField : ''}
              placeholder='Search...'
              onChange={(e) => debouncedChangeHandler(e.target.value)}
              startAdornment={
                <InputAdornment position='start'>
                  <SearchIcon style={{ color: 'black' }} />
                </InputAdornment>
              }
            />
          </Box>
          <ToggleButtonGroup
            color='primary'
            value={showArchived}
            exclusive
            onChange={(_event, newValue) => {
              if (newValue !== null) setShowArchived(newValue)
            }}
            sx={providersClasses.toggleButtonGroup}
          >
            <ToggleButton value={true}>Show Archived</ToggleButton>
            <ToggleButton value={false}>Hide Archived</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box>
          <MthTable
            items={tableData}
            loading={loading}
            fields={fields}
            selectable={true}
            checkBoxColor={MthColor.MTHBLUE}
          />
        </Box>

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
          >
            <Subtitle sx={{ fontSize: '14px', fontWeight: '700' }}>+ Add Provider</Subtitle>
          </Button>
        </Box>
      </Card>
    </Box>
  )
}

export default Providers
