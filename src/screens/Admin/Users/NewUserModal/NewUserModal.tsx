import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Checkbox, FormControlLabel, FormGroup, Grid, Modal, TextField, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { map } from 'lodash';
import { DropDown } from '../../../../components/DropDown/DropDown';
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle';
import { createUserMutation } from '../../../../graphql/mutation/user';
import { getAllAccess } from '../../../../graphql/queries/access';
import { getAllRegion } from '../../../../graphql/queries/region';
import { getAllRoles } from '../../../../graphql/queries/role';
import { getUsersByRegions } from '../../../../graphql/queries/user';
import { UserContext } from '../../../../providers/UserContext/UserProvider';
import { BUTTON_LINEAR_GRADIENT, PROVIDERS, SOE, SOE_OPTIONS, SPED } from '../../../../utils/constants';
import { useStyles } from './styles';
import { NewModalTemplateType } from './types';
import { WarningModal } from '../../../../components/WarningModal/Warning';
import { ApolloError, Region } from '../interfaces';
import { AddedModal } from './AddedModal/AddedModal';


interface CheckBoxTemplate {
	value: number;
	label: string;
	selected: boolean;
}



export const NewUserModal: NewModalTemplateType = ({
	handleModem,
	visible
}) => {
	const classes = useStyles;
	const { me } = useContext(UserContext);
	const [apolloError, setApolloError] = useState<ApolloError>({
		title: '',
		severity: '',
		flag: false
	});
	const [userAddedModal, setUserAddedModal] = useState(false);
	const [email, setEmail] = useState('');
	const [parentEmail, setParentEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [userLevel, setUserLevel] = useState('');
	const [state, setState] = useState([]);
	const [regionAll, setRegionAll] = useState(false);
	const [accessAll, setAccessAll] = useState(false);
	const [counter, setCounter] = useState(0);
	const [soe, setSoe] = useState('');
	const [selectedState, setSelectedState] = useState<Number | null>(null);
	const [regions, setRegions] = useState([]);
	const [accesses, setAccesses] = useState([]);
	const [role, setRole] = useState(0);


	const [rolesOption, setRolesOption] = useState([]);
	const [regionOption, setRegionOption] = useState<CheckBoxTemplate[]>([]);
	const [accessOption, setAccessOption] = useState<CheckBoxTemplate[]>([]);

	const { loading: load1, error: error1, data: data1 } = useQuery(getAllRegion);
	const { loading: load2, data: data2 } = useQuery(getAllRoles);
	const { loading: load3, data: data3 } = useQuery(getAllAccess);

	const [createUser, { data: responseData, loading: uploading, error: uploadingError }] = useMutation(createUserMutation);

	useEffect(() => {
		if (!uploading && responseData !== undefined) {
			setUserAddedModal(true)
		} else {
			if (uploadingError?.networkError || uploadingError?.graphQLErrors?.length > 0 || uploadingError?.clientErrors.length > 0) {
				setApolloError({
					title: uploadingError?.clientErrors[0]?.message || uploadingError?.graphQLErrors[0]?.message || uploadingError?.networkError?.message,
					severity: 'Error',
					flag: true
				});
			}
			// console.log(JSON.stringify(uploadingError,null, 2));
		}

	}, [uploading]);


	useEffect(() => {
		if (!load1 && data1 !== undefined) {
			const updatedRegions = map(data1?.regions, region => {
				return {
					value: region.id,
					label: region.name,
					selected: false
				}
			});
			setRegionOption(updatedRegions)
		} else {
			console.log(JSON.stringify(error1, null, 2));
		}
	}, [load1]);

	useEffect(() => {
		if (!load2 && data2 !== undefined) {
			const updatedRoles = data2?.roles?.map(role => {
				return {
					label: role?.name,
					value: role?.id
				}
			})
			setRolesOption(updatedRoles)
		}
	}, [load2]);

	useEffect(() => {
		if (!load3 && data3 !== undefined) {
			setAccessOption(data3?.getAllAccesses)
			const updatedAccess = map(data3?.getAllAccesses, access => {
				return {
					value: access.id,
					label: access.name,
					selected: false
				}
			});
			setAccessOption(updatedAccess)

		}
	}, [load3]);

	const dropDownSOE = map(SOE, (el) => ({
		label: el,
		value: el,
	}));

	const handleRoleChange = (value: any) => {
		const data = rolesOption.filter(role => role?.value == value);
		if (data.length > 0) {
			setUserLevel(data[0]?.label);
		}
		setRegions([]);
		setAccesses([]);
		toggleCheckBoxes('region');
		toggleCheckBoxes('access');
		setSelectedState(null);
		setParentEmail('');
		setSoe('')
	}

	const toggleCheckBoxes = (group: string, flag: boolean = false) => {
		if (group === 'region') {
			if (flag) {
				const updatedRegion = map(regionOption, (region) => {
					return {
						value: region.value,
						label: region.label,
						selected: true
					}
				});
				const regions = [];
				map(updatedRegion, reg => regions.push(Number(reg.value)));
				setRegions(regions);
				setRegionOption(updatedRegion);
			} else {
				const updatedRegion = map(regionOption, (region) => {
					return {
						value: region.value,
						label: region.label,
						selected: false
					}
				});
				setRegionOption(updatedRegion);
				setRegions([])

			}
		} else if (group === 'access') {
			if (flag) {
				const updatedAccess = map(accessOption, (access) => {
					return {
						value: access.value,
						label: access.label,
						selected: true
					}
				});
				setAccessOption(updatedAccess);
				const access = [];
				map(updatedAccess, acc => access.push(Number(acc.value)));
				setAccesses(access);
			} else {
				const updatedAccess = map(accessOption, (access) => {
					return {
						value: access.value,
						label: access.label,
						selected: false
					}
				});
				setAccessOption(updatedAccess);
				setAccesses([])

			}
		}
	}

	const handleRegionChange = (value: number, index: number, checked: boolean) => {
		checkboxRegionChanged(index, checked);
		const updatedRegions = regions;
		const indexAt = updatedRegions.findIndex((r => r == value));
		if (indexAt !== -1) {
			updatedRegions.splice(indexAt, 1);
		} else {
			updatedRegions.push(Number(value))
		}
		if (updatedRegions.length === regionOption.length) {
			setRegionAll(true)
		} else {
			setRegionAll(false)
		}
		setRegions(updatedRegions)
	}

	const handleAccessChange = (value: number, index: number, checked: boolean) => {
		checkboxAccessChanged(index, checked);
		const updatedAccesses = accesses;
		const indexAt = updatedAccesses.findIndex((r => r == value));
		if (indexAt !== -1) {
			updatedAccesses.splice(indexAt, 1);
		} else {
			updatedAccesses.push(Number(value))
		}
		if (updatedAccesses.length === accessOption.length) {
			setAccessAll(true)
		} else {
			setAccessAll(false)
		}
		setAccesses(updatedAccesses)
	}


	const checkboxAccessChanged = (index: number, checked: boolean) => {
		const updatedAccess = accessOption;
		accessOption[index].selected = !checked;
		setAccessOption(updatedAccess);
		setCounter(counter => counter + 1)
	}

	const checkboxRegionChanged = (index: number, checked: boolean) => {
		const updatedRegion = regionOption;
		regionOption[index].selected = !checked;
		setRegionOption(updatedRegion);
		setCounter(counter => counter + 1)
	}


	const handleSubmit = () => {
		if (!firstName) {
			setApolloError({
				title: 'First name is required',
				severity: 'Warning',
				flag: true
			});
			return;
		} else if (!email) {
			setApolloError({
				title: 'Email address is required',
				severity: 'Warning',
				flag: true
			});
			return;
		} else if (!role) {
			setApolloError({
				title: 'You must declare a role for user.',
				severity: 'Warning',
				flag: true
			});
			return;
		}
		const payload = {
			creator_id: Number(me.user_id),
			email: email,
			first_name: firstName,
			last_name: lastName,
			level: Number(role),
			regions: selectedState ? [Number(selectedState)] : regions,
			parent_email: parentEmail,
			access: accesses
		}
		createUser({
			variables: { createUserInput: payload },
			refetchQueries: [{
				query:
					getUsersByRegions,
				variables: {
					regions: map(me?.userRegion, (region: Region) => region.region_id)
				}
			}],
		});
	}

	const conditionalUserForm = useCallback(() => {
		let form
		switch (userLevel) {
			case 'Teacher':
			case 'Super Admin':
				form = (
					<Grid item>
						<Subtitle fontWeight='700'>Regions</Subtitle>
						<FormGroup>
							{map(regionOption, (region, index) => (
								<FormControlLabel
									key={index}
									control={
										<Checkbox
											checked={region.selected}
											onChange={() => handleRegionChange(region.value, index, region.selected)}
										/>}
									label={region.label}
								/>
							))}
							<FormControlLabel
								control={
									<Checkbox
										checked={regionAll}
										onChange={(e) => {
											setRegionAll(e.target.checked);
											toggleCheckBoxes('region', e.target.checked ? true : false);
											setCounter(counter => counter + 1)

										}}
									/>
								}
								label="All"
							/>
						</FormGroup>
					</Grid>
				)
				break;
			case 'Admin':
				form = (
					<Grid item container xs={12}>
						<Grid item xs={6}>
							<Subtitle fontWeight='700'>Regions</Subtitle>
							<FormGroup>
								{map(regionOption, (region, index) => (
									<FormControlLabel
										key={index}
										control={
											<Checkbox
												checked={region.selected}
												onChange={() => handleRegionChange(region.value, index, region.selected)}
											/>
										}
										label={region.label}
									/>
								))}
								<FormControlLabel
									control={
										<Checkbox
											checked={regionAll}
											onChange={(e) => {
												setRegionAll(e.target.checked)
												toggleCheckBoxes('region', e.target.checked ? true : false);
											}}
										/>
									}
									label="All"
								/>
							</FormGroup>
						</Grid>
						<Grid item xs={6}>
							<Subtitle fontWeight='700'>Access</Subtitle>
							<FormGroup>
								{map(accessOption, (access, index) => (
									<FormControlLabel
										key={index}
										control={
											<Checkbox
												checked={access.selected}
												onChange={() => handleAccessChange(access.value, index, access.selected)}
											/>
										}
										label={access.label}
									/>
								))}
								<FormControlLabel
									control={
										<Checkbox
											checked={accessAll}
											onChange={(e) => {
												setAccessAll(e.target.checked);
												toggleCheckBoxes('access', e.target.checked ? true : false);
											}}
										/>
									}
									label="All"
								/>
							</FormGroup>
						</Grid>
					</Grid>
				)
				break;
			case 'Parent':
				form = (
					<Grid container>
						<Grid item xs={6}>
							<DropDown
								size='small'
								dropDownItems={regionOption}
								defaultValue={selectedState}
								placeholder='Select State'
								setParentValue={(value) => setSelectedState(Number(value))}
							/>
						</Grid>
					</Grid>
				)
				break;
			case 'Observer':
			case 'Student':
				form = (
					<Grid container >
						<Grid item xs={6}>
							<DropDown
								size='small'
								dropDownItems={regionOption}
								defaultValue={selectedState}
								placeholder='Select State'
								setParentValue={(value) => {
									setSelectedState(Number(value));
								}}
							/>
							{selectedState ?
								<Box sx={{ mt: 2 }}>
									<Subtitle>Parent Email</Subtitle>
									<TextField
										size='small'
										variant='outlined'
										fullWidth
										value={parentEmail}
										onChange={(e) => setParentEmail(e.target.value)}
									/>
								</Box>
								:
								<Fragment />
							}
						</Grid>
						<Grid item xs={2} />
						<Grid item xs={4}>
							<Subtitle fontWeight='700'>Access</Subtitle>
							<FormGroup>
								{map(accessOption, (access, index) => (
									<FormControlLabel
										key={index}
										control={
											<Checkbox
												checked={access.selected}
												onChange={() => handleAccessChange(access.value, index, access.selected)}
											/>
										}
										label={access.label}
									/>
								))}
								<FormControlLabel
									control={
										<Checkbox
											checked={accessAll}
											onChange={(e) => {
												setAccessAll(e.target.checked);
												toggleCheckBoxes('access', e.target.checked ? true : false);
											}}
										/>
									}
									label="All"
								/>
							</FormGroup>
						</Grid>
					</Grid>
				)
				break;
			case 'Teacher Assistant':
				form = (
					<Grid container justifyContent="space-between">
						<Grid item xs={6}>
							<DropDown
								size='small'
								dropDownItems={regionOption}
								defaultValue={selectedState}
								placeholder='Select State'
								setParentValue={(value) => setSelectedState(Number(value))}
								sx={{ width: '100%' }}
							/>
							{selectedState ?
								<Box sx={{ mt: 2 }}>
									<DropDown
										size='small'
										dropDownItems={dropDownSOE}
										placeholder={soe}
										setParentValue={setSoe}
									/>
								</Box>
								:
								<Fragment />
							}
						</Grid>
						<Grid item xs={4} sx={{ ml: 4 }}>
							{conditionalTAForm()}
						</Grid>
					</Grid>
				)
				break
			case 'School Partner':
				form = (
					<Grid container>
						<Grid item xs={6} >
							<DropDown
								size='small'
								dropDownItems={regionOption}
								defaultValue={selectedState}
								placeholder='Select State'
								setParentValue={(value) => setSelectedState(Number(value))}
								sx={{ width: '100%' }}
							/>
							{selectedState ?
								<Box sx={{ mt: 2 }}>
									<DropDown
										size='small'
										dropDownItems={dropDownSOE}
										placeholder="Select Type"
										setParentValue={setSoe}
										sx={{ width: '100%' }}
									/>
								</Box>
								:
								<Fragment />
							}
						</Grid>
					</Grid>
				)
				break
			default:
				break;
		}
		return form
	}, [userLevel, selectedState, regionAll, accessAll, parentEmail, soe]);

	const conditionalTAForm = () => {
		let form
		switch (soe) {
			case 'School of Enrollment':
				form = (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column'
						}}
					>
						<Subtitle fontWeight='700'>School of Enrollment</Subtitle>
						{map((SOE_OPTIONS), (option) => (
							<FormControlLabel control={<Checkbox />} label={option} />
						))}
					</Box>
				)
				break
			case 'Provider':
				form = (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column'
						}}
					>
						<Subtitle fontWeight='700'>Providers</Subtitle>
						{map((PROVIDERS), (provider) => (
							<FormControlLabel control={<Checkbox />} label={provider} />
						))}
					</Box>
				)
				break
			case 'SPED':
				form = (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column'
						}}
					>
						<Subtitle fontWeight='700'>SPED</Subtitle>
						{map((SPED), (sped) => (
							<FormControlLabel control={<Checkbox />} label={sped} />
						))}
					</Box>
				)
				break
		}
		return form
	}


	return (
		<Modal
			open={visible}
			onClose={() => handleModem()}
			aria-labelledby="Create User"
			aria-describedby="Create New User"
		>
			<Box sx={classes.modalCard}>
				{
					userAddedModal &&
					<AddedModal
						handleModem={(type) => {
							if (type === "finish") {
								setUserAddedModal(false);
								handleModem()
							} else if (type === "add") {
								setFirstName("");
								setLastName("");
								setUserLevel("");
								setRole(-1)
								setParentEmail("")
								setSoe("")
								setUserAddedModal(false);
							}
						}}
					/>
				}
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
				<Box sx={classes.header}>
					<Subtitle>This user will receive an email giving them a link to create a password.</Subtitle>
					<IconButton onClick={handleModem} >
						<CloseIcon
							style={classes.close}
						/>
					</IconButton>
				</Box>
				<Grid container rowSpacing={2}>
					<Grid item xs={12}>
						<Subtitle fontWeight='700' size='large'>Email</Subtitle>
						<TextField
							size='small'
							variant='outlined'
							fullWidth
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</Grid>
					<Grid item xs={12}>
						<Subtitle fontWeight='700' size='large'>First Name</Subtitle>
						<TextField
							size='small'
							variant='outlined'
							fullWidth
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
						/>
					</Grid>
					<Grid item xs={12}>
						<Subtitle fontWeight='700' size='large'>Last Name</Subtitle>
						<TextField
							size='small'
							variant='outlined'
							fullWidth
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
						/>
					</Grid>
					<Grid container item xs={9}>
						<Grid item xs={12} sx={{ mb: 3 }}>
							<DropDown
								dropDownItems={rolesOption}
								placeholder='User Type'
								setParentValue={(value) => {
									setRole(Number(value));
									handleRoleChange(value)
								}}
								size='small'
								sx={{ width: '70%' }}
							/>
						</Grid>
						{conditionalUserForm()}
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'flex-end',
							alignItems: 'end',
							height: '100%',
							width: '100%'
						}}
					>
						<Button
							onClick={handleSubmit}
							sx={{
								background: BUTTON_LINEAR_GRADIENT,
								color: 'white',
								width: '92px',
								borderRadius: 8,
								textTransform: 'none',
								fontWeight: 700,
							}}
						>
							Add
						</Button>
					</Box>
				</Grid>
			</Box>
		</Modal>
	)
}

/**
 * Partials
 * Super Admin
 * 	Regions
 * Admin
 * 	Regions
 * 	Access Options
 * New Parent + Student + Observer 
 * 	State Drop Down
 * 	Parent Account Email
 * Teacher + TA + School Partner 
 * 	
 * 
 */