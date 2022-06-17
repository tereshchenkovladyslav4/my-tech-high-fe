import { Box, Button, Card, FormControl, InputAdornment, MenuItem, OutlinedInput, Select } from '@mui/material'
import React, { useEffect, useState, useContext } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import SearchIcon from '@mui/icons-material/Search'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { HeadCell } from '../../../../components/SortableTable/SortableTableHeader/types'
import { SortableTable } from '../../../../components/SortableTable/SortableTable'
import { useQuery, useMutation } from '@apollo/client'
import { getWithdrawalsQuery, getWithdrawalsCountByStatusQuery } from '../../../../graphql/queries/withdrawal';
import moment from 'moment'
import { WarningModal } from '../../../../components/WarningModal/Warning'
import { WithdrawalFilters } from '../WithdrawalFilters'
import { ProfileContext } from '../../../../providers/ProfileProvider/ProfileContext'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { makeStyles } from '@material-ui/styles'
import { useStyles } from './styles'
import { Withdrawal } from '../../../../graphql/models/withdrawal'
import { WITHDRAWAL_STATUS_LABEL } from '../../../../utils/constants'

const selectStyles = makeStyles({
	select: {
		'& .MuiSvgIcon-root': {
			color: 'blue',
		},
	},
})

const WithdrawalTable = () => {
	const classes = useStyles
	const selectedClass = selectStyles()

	const { me } = useContext(UserContext);

	//	Status filter state
	const [selectedStatuses, setSelectedStatuses] = useState([WITHDRAWAL_STATUS_LABEL[0], WITHDRAWAL_STATUS_LABEL[1]]);

	//	Search Keyword state
	const [searchField, setSearchField] = useState('');

	//	Table data state
	const [tableData, setTableData] = useState<Array<any>>([]);
	//	Pagination limit state
	const [paginatinLimit, setPaginatinLimit] = useState<number>(25)
	//	Current page number state
	const [currentPage, setCurrentPage] = useState<number>(1)
	//	Skip state(page start index)
	const [skip, setSkip] = useState<number>()
	//	Sort flag state
	const [sort, setSort] = useState('status|ASC');

	//	Withdrawals data state to keep the whole data from the database
	const [withdrawals, setWithdrawals] = useState<Array<Withdrawal>>([]);

	//	current selected Withdrawal state
	const [currentWithdrawal, setCurrentWithdrawal] = useState<Withdrawal | null>(null);

	//	Selected school year state
	const [selectedYear, setSelectedYear] = useState<string | number>('1');

	//	Total Withdrawal count state
	const [totalWithdrawals, setTotalWithdrawals] = useState<number>(0);

	//	Checked Withdrawal Ids State
	const [checkedWithdrawalIds, setCheckedWithdrawalIds] = useState<Array<string>>([])

	const [isShowModal, setIsShowModal] = useState(false);
	const [openEmailModal, setOpenEmailModal] = useState<boolean>(false);
	const [openWarningModal, setOpenWarningModal] = useState<boolean>(false);
	const { showModal, hideModal, store, setStore } = useContext(ProfileContext);
	
	//	Fetch Withdrawals from database
	const { loading, error, data, refetch } = useQuery(getWithdrawalsQuery, {
		variables: {
			skip: skip,
			sort: sort,
			take: paginatinLimit,
			filter: {
				region_id: me?.selectedRegionId,
				status: selectedStatuses,
				keyword: searchField
			},
		},
		skip: me?.selectedRegionId ? false : true,
		fetchPolicy: 'network-only',
	});
	useEffect(() => {
		if (!loading && data?.withdrawals) {
			setTableData(
				data?.withdrawals.results.map((withdrawal: any) => ({
					submitted: withdrawal.date ? moment(withdrawal.date).format('MM/DD/YY') : '',
					status: withdrawal.status,
					effective: withdrawal.date_effective ? moment(withdrawal.date_effective).format('MM/DD/YY') : '',
					student: withdrawal?.student_name,
					grade: withdrawal?.grade_level,
					soe: withdrawal?.soe,
					funding: withdrawal?.funding,	//	TODO
					emailed: withdrawal?.date_emailed ? moment(withdrawal.date_emailed).format('MM/DD/YY') : '',
					id: withdrawal?.withdrawal_id,
				})),
			);
			setTotalWithdrawals(data.withdrawals.total);
			setWithdrawals(data.withdrawals.results.map(v => v));
		}
	}, [loading]);

	//	Withdrawals count state by status
	const [withdrawalCounts, setWithdrawalCounts] = useState<Array<String>>([]);
	//	Fetch Withdrawals count by status from database
	const { data: withdrawalsCountData } = useQuery(getWithdrawalsCountByStatusQuery, {
		variables: {
			filter: {
				region_id: me?.selectedRegionId,
				keyword: searchField
			}
		},
		skip: me?.selectedRegionId ? false : true,
		fetchPolicy: 'network-only'
	});
	useEffect(() => {
		if(withdrawalsCountData && withdrawalsCountData.withdrawalCountsByStatus.error === false) {
			setWithdrawalCounts(withdrawalsCountData.withdrawalCountsByStatus.results);
		}
	}, [withdrawalsCountData]);

	//	Table sort action
	const sortChangeAction = (property, order) => {
		setSort(`${property}|${order}`);
		refetch();
	};

	//	Table Page change action
	const handlePageChange = (page) => {
		setCurrentPage(page);
		setSkip(() => {
			return paginatinLimit ? paginatinLimit * (page - 1) : 25
		});
	};
	
	//	School Years
	const schoolYears = [
		{
			label: '21-22',
			value: '1',
		},
		{
			label: '22-23',
			value: '2',
		},
		{
			label: '23-24',
			value: '3',
		},
	];

	const handleOpenProfile = (rowId: number) => {
		const row = withdrawals?.find(x => x.withdrawal_id === rowId)
		//showModal(row);
		setStore(true);
	}

	//	Withdraw Click Handler on Table
	const handleWithdrawSelect = (rowId: any) => {
		const row = withdrawals?.find(item => item.withdrawal_id === rowId);
		setCurrentWithdrawal(row);
		setIsShowModal(true);
	}

	//	Withdraw button click handler
	const onWithdrawClick = () => {}

	//	Email button click handler
	const onEmailClick = () => {
		if (checkedWithdrawalIds.length === 0) {
			setOpenWarningModal(true)
			return
		}
		setOpenEmailModal(true)
	}

	//	Reinstate button click handler
	const onReinstateClick = () => {
		//	TODO
	};

	//	Quick Withdrawal button click handler
	const onQuickWithdrawalClick = () => {
		//	TODO
	};

	//	Table header information
	const headCells: HeadCell[] = [
		{
			id: 'submitted',
			numeric: false,
			disablePadding: true,
			label: 'Submitted',
		},
		{
			id: 'status',
			numeric: false,
			disablePadding: true,
			label: 'Status',
		},
		{
			id: 'effective',
			numeric: false,
			disablePadding: true,
			label: 'Effective',
		},
		{
			id: 'student',
			numeric: false,
			disablePadding: true,
			label: 'Student',
		},
		{
			id: 'grade',
			numeric: false,
			disablePadding: true,
			label: 'Grade',
		},
		{
			id: 'soe',
			numeric: false,
			disablePadding: true,
			label: 'SoE',
		},
		{
			id: 'funding',
			numeric: false,
			disablePadding: true,
			label: 'Funding',
		},
		{
			id: 'emailed',
			numeric: false,
			disablePadding: true,
			label: 'Emailed',
		},
	];

	return (
		<Card sx={classes.card}>
			{/*	Headers */}
			<Box sx={classes.pageHeader}>
				<Box sx={classes.pageHeaderContent}>
					<Subtitle size='medium' fontWeight='700'>
						Withdrawals
					</Subtitle>
					<Subtitle size='medium' fontWeight='700' sx={{ marginLeft: 2 }}>
						{totalWithdrawals}
					</Subtitle>
					<Box marginLeft={4} sx={{ width: '300px' }}>
						<OutlinedInput
							onFocus={(e) => (e.target.placeholder = '')}
							onBlur={(e) => (e.target.placeholder = 'Search...')}
							size='small'
							fullWidth
							value={searchField}
							placeholder='Search...'
							onChange={(e) => setSearchField(e.target.value)}
							startAdornment={
								<InputAdornment position='start'>
									<SearchIcon style={{ color: 'black' }} />
								</InputAdornment>
							}
						/>
					</Box>
				</Box>
				<Box sx={classes.pageHeaderButtonGroup}>
					<Button sx={classes.emailButton} onClick={onEmailClick}>
						Email
					</Button>
					<Button
						sx={classes.withdrawalButton}
						onClick={onWithdrawClick}
					>
						Withdraw
					</Button>
					<Button
						sx={classes.reinstateButton}
						onClick={onReinstateClick}
					>
						Reinstate
					</Button>
				</Box>
			</Box>
			{/*	Pagination & Actions */}
			<Box sx={classes.container}>
				<Box sx={classes.content}>
					<Box sx={classes.buttonDiv}>
						<Button
							sx={classes.quickWithdrawalButton}
							onClick={onQuickWithdrawalClick}
						>
							Quick Withdrawal
						</Button>
					</Box>
				</Box>
				<Pagination
					setParentLimit={setPaginatinLimit}
					handlePageChange={handlePageChange}
					defaultValue={paginatinLimit || 25}
					numPages={Math.ceil(totalWithdrawals / paginatinLimit)}
					currentPage={currentPage}
				/>
			</Box>
			<Box>
				<WithdrawalFilters filters={selectedStatuses} setFilters={setSelectedStatuses} withdrawCount={withdrawalCounts} />
			</Box>
			<Box display='flex' flexDirection='row' justifyContent='flex-end' sx={{ mr: 3 }} alignItems='center'>
				<FormControl variant='standard' sx={{ m: 1 }}>
					<Select
						size='small'
						value={selectedYear}
						IconComponent={ExpandMoreIcon}
						disableUnderline
						onChange={(e) => {
							setSelectedYear(e.target.value)
						}}
						label='year'
						className={selectedClass.select}
						sx={{ color: 'blue', border: 'none' }}
					>
						{schoolYears.map((sy) => (
							<MenuItem key={sy.value} value={sy.value}>
								{sy.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>
			<SortableTable
				rows={tableData}
				headCells={headCells}
				onCheck={setCheckedWithdrawalIds}
				clearAll={false}
				onRowClick={handleWithdrawSelect}
				onParentClick={handleOpenProfile}
				onSortChange={sortChangeAction}
			/>
			{openWarningModal && (
				<WarningModal
					title='Warning'
					subtitle='Please select Withdrawals'
					btntitle='Close'
					handleModem={() => setOpenWarningModal(!openWarningModal)}
					handleSubmit={() => setOpenWarningModal(!openWarningModal)}
				/>
			)}
		</Card>
	)
}

export default WithdrawalTable
