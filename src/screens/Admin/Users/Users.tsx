import { useMutation, useQuery } from '@apollo/client';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Card, InputAdornment, OutlinedInput } from '@mui/material';
import { map } from 'lodash';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Pagination } from '../../../components/Pagination/Pagination';
import { HeadCell } from '../../../components/SortableTable/SortableTableHeader/types';
import { SortableUserTable } from '../../../components/SortableTable/SortableUserTable';
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle';
import { WarningModal } from '../../../components/WarningModal/Warning';
import { changeUserStatusMutation } from '../../../graphql/mutation/user';
import { getUsersByRegions } from '../../../graphql/queries/user';
import { RegionType } from '../../../providers/UserContext/types';
import { UserContext } from '../../../providers/UserContext/UserProvider';
import { BUTTON_LINEAR_GRADIENT } from '../../../utils/constants';
import { ApolloError, Region } from './interfaces';
import { NewUserModal } from './NewUserModal/NewUserModal';
import { UserFilters } from './UserFilters/UserFilters';


function escapeRegExp(value: string) {
	return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export const Users = () => {
	const [rows, setRows] = useState([]);
	const [counter, setCounter] = useState(0);
	const [selectedRegion, setSelectedRegion] = useState<RegionType | undefined>();
	const { me } = useContext(UserContext);
	const [apolloError, setApolloError] = useState<ApolloError>({
		title: '',
		severity: '',
		flag: false
	});
	const [users, setUsers] = useState([]);
	const [newUserModal, setNewUserModal] = useState(false);
	const [seachField, setSearchField] = useState('');
	const [selectedFilter, setselectedFilter] = useState([
		{
			id: 2,
			name: 'Parent',
			type: 'role'
		},
		{
			id: 3,
			name: 'Student',
			type: 'role'
		},
	]);

	React.useEffect(() => {
		setSelectedRegion(JSON.parse(localStorage.getItem('selectedRegion')))
		window.addEventListener('storage', storageEventHandler, false);
	}, [])

	function storageEventHandler() {
		console.log("Hi from storageEventHandler")
		const region = localStorage.getItem('selectedRegion');
		setSelectedRegion(JSON.parse(region))
	}

	const { loading, error, data } = useQuery(getUsersByRegions, {
		variables: {
			regions: [selectedRegion?.region_id],
		},
		skip: selectedRegion === undefined,
		fetchPolicy: 'cache-and-network'
	});
	const [changeUserStatus, { data: responseData, loading: uploading, error: uploadingError }] = useMutation(changeUserStatusMutation);

	useEffect(() => {
		if (!uploading && responseData !== undefined) {
			setApolloError({
				title: "Status has been updated",
				severity: 'Success',
				flag: true
			});
		} else {
			if (uploadingError?.networkError || uploadingError?.graphQLErrors?.length > 0 || uploadingError?.clientErrors.length > 0) {
				setApolloError({
					title: uploadingError?.clientErrors[0]?.message || uploadingError?.graphQLErrors[0]?.message || uploadingError?.networkError?.message,
					severity: 'Error',
					flag: true
				});
			}
		}
	}, [uploading]);

	const handleStatusChange = (id: number, status: string) => {
		const payload = {
			user_id: Number(id),
			creator_id: Number(me?.user_id),
			status: status.toString()
		}
		changeUserStatus({
			variables: payload,
			refetchQueries: [{ query: getUsersByRegions, }],
		});
	}

	useEffect(() => {
		if (!loading && data !== undefined) {
			const updatedRecord: any = [];
			console.log(data?.usersByRegions)
			map(data?.usersByRegions, user => {
				updatedRecord.push({
					user_id: user.user_id,
					name: `${user.first_name} ${user?.last_name}` || '',
					email: user.email,
					level: user?.role?.name || "null",
					last_login: user?.last_login ? moment(user?.last_login).format("L") : "Never",
					status: user?.status,
					can_emulate: user?.can_emulate ? true : false
				});
			});
			setUsers(updatedRecord);
			setRows(updatedRecord);
			setCounter(counter => counter + 1)
		} else {
			if (error?.networkError || error?.graphQLErrors?.length > 0 || error?.clientErrors.length > 0) {
				setApolloError({
					title: error?.clientErrors[0]?.message || error?.graphQLErrors[0]?.message || error?.networkError?.message,
					severity: 'Error',
					flag: true
				});
			}
		}
	}, [loading]);

	useEffect(() => {
		requestRoleFilter(null, -1);
	}, [counter]);

	const handleModal = () => setNewUserModal(!newUserModal);

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
	];

	const requestSearchHandler = (input: string) => {
		const searchRegex = new RegExp(escapeRegExp(input), 'i');
		const filteredRows = users.filter((row) => {
			return Object.keys(row).some((field) => {
				return searchRegex.test(row[field].toString());
			});
		});
		setRows(filteredRows);
	}

	useEffect(() => {
		requestSearchHandler(seachField)
	}, [seachField]);

	const requestRoleFilter = (role: any, active: number) => {
		const updatedFilters = selectedFilter;
		let updatedRows = [];
		let fieldData = [];
		let otherData = [];
		if (role !== null) {
			const existed = updatedFilters.findIndex(filter => filter.id === active);
			if (existed !== -1) {
				updatedFilters.splice(existed, 1);
			} else {
				updatedFilters.push({
					name: role.name,
					id: active,
					type: role.type
				});
			}
			setselectedFilter(updatedFilters)
		}
		map(updatedFilters, filter => {

			if (filter.type === "field") {
				const filteredRecord = users.filter((user: any) => {
					return Number(user?.status) === 0
				});
				fieldData = [...fieldData, ...filteredRecord];
			} else {
				const filteredRecord = users.filter((user: any) => {
					return user?.level === filter.name
				});
				otherData = [...otherData, ...filteredRecord];
			}
		});
		updatedRows = [...fieldData, ...otherData];
		if (updatedFilters.length > 0) {
			if (updatedRows.length > 0) {
				setRows(updatedRows)
			} else {
				setRows([])
			}
		} else {
			setRows(users)
		}
	}


	return (
		<Card sx={{ paddingTop: '24px', margin: 2 }}>
			{
				apolloError.flag &&
				<WarningModal
					handleModem={() => setApolloError({ title: '', severity: '', flag: false })}
					title={apolloError.severity}
					subtitle={apolloError.title}
					btntitle="Close"
					handleSubmit={() => setApolloError({ title: '', severity: '', flag: false })}
				/>
			}
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
					<Subtitle size='medium' fontWeight='700'>Users</Subtitle>
					<Subtitle size='medium' fontWeight='700' sx={{ marginLeft: 2 }}>{loading ? "..." : users?.length}</Subtitle>
				</Box>
				<Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}>
					<Box>
						<OutlinedInput
							size='small'
							fullWidth
							value={seachField}
							placeholder='Search...'
							onChange={(e) => setSearchField(e.target.value)}
							startAdornment={
								<InputAdornment position="start"><SearchIcon style={{ color: 'black' }} /></InputAdornment>
							}
						/>
					</Box>
					<Button
						onClick={() => {
							if (me?.level === 1) {
								handleModal()
							} else {
								setApolloError({
									title: "You do not have access for this action.",
									severity: 'Error',
									flag: true
								})
							}
						}}
						sx={{
							background: BUTTON_LINEAR_GRADIENT,
							textTransform: 'none',
							color: 'white',
							width: '150px'
						}}
					>
						New User
					</Button>
					<Pagination
						handlePageChange={() => null}
						numPages={5}
						currentPage={1}
					/>
				</Box>
			</Box>
			<UserFilters
				onPress={requestRoleFilter}
				filters={selectedFilter}
			/>
			<SortableUserTable
				rows={rows}
				headCells={headCells}
				onCheck={() => { }}
				updateStatus={handleStatusChange}
				clearAll={false}
				onRowClick={() => null}
				type="core_user"
			/>
			{newUserModal &&
				<NewUserModal
					visible={newUserModal}
					handleModem={handleModal}
				/>
			}
		</Card>
	)
}