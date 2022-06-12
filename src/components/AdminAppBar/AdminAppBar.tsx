import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SearchIcon from '@mui/icons-material/Search'
import {
	AppBar as MUIAppBar,
	Avatar,
	Box,
	Divider,
	Grid,
	InputAdornment,
	List,
	ListItemButton,
	ListItemText,
	OutlinedInput,
} from '@mui/material'
import { map } from 'lodash'
import React, { FunctionComponent, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import Slider from 'react-slick'
import { useRecoilState } from 'recoil'
import { UserContext, userRegionState } from '../../providers/UserContext/UserProvider'
import { MTHBLUE } from '../../utils/constants'
import { Metadata } from '../Metadata/Metadata'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { Subtitle } from '../Typography/Subtitle/Subtitle'
import { useStyles } from './styles'
import { RegionType } from '../../providers/UserContext/types'
import { gql, useQuery } from '@apollo/client'
import { ProfileContext } from '../../providers/ProfileProvider/ProfileContext'
import debounce from 'lodash.debounce'
import CustomConfirmModal from '../CustomConfirmModal/CustomConfirmModal'

export const getAllPersonInfoBySearchItem = gql`
	query AllPersonInfoBySearchItem($getPersonInfoArgs: GetPersonInfoArgs!) {
		allPersonInfoBySearchItem(getPersonInfoArgs: $getPersonInfoArgs) {
			email
			id
			name
			parentId
			phoneNumber
			role
		}
	}
`

export const AdminAppBar: FunctionComponent = () => {
	const classes = useStyles
	const { me, setMe } = useContext(UserContext)
	const location = useLocation()
	const sliderRef = useRef()
	const [searchField, setSearchField] = useState('')
	const [selected, setSelected] = useRecoilState(userRegionState)
	const [searchListView, setSearchListView] = useState(false)
	const [personInfoList, setPersonInfoList] = useState<any[]>([])
	const { showModal, hideModal, store, setStore } = useContext(ProfileContext)
	const { loading: personInfoLoading, data: personInfos } = useQuery(getAllPersonInfoBySearchItem, {
		variables: {
			getPersonInfoArgs: {
				region_id: me?.selectedRegionId,
				search: searchField,
			},
		},
		skip: me?.selectedRegionId && searchField ? false : true,
		fetchPolicy: 'network-only',
	})
	const isActive = (id) => location.pathname.includes(`homeroom/${id}`)
	function SampleNextArrow(props) {
		const { className, style, onClick } = props
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					textAlign: 'center',
					right: '-30px',
					top: '31%',
					width: '24px',
					height: '30px',
					position: 'absolute',
					alignItems: 'center',
				}}
			>
				<ChevronRightIcon
					style={{ ...style, display: 'block', color: 'black', background: '#FAFAFA', cursor: 'pointer' }}
					// @ts-ignore
					onClick={() => sliderRef.current?.slickNext()}
				/>
			</div>
		)
	}

	function SamplePrevArrow(props) {
		const { className, style, onClick } = props
		return (
			<ChevronLeftIcon
				className={className}
				style={{ ...style, display: 'block', color: 'black', background: '#FAFAFA' }}
				// @ts-ignore
				onClick={() => sliderRef.current.slickPrev()}
			/>
		)
	}

	const settings = {
		className: "slider variable-width",
		infinite: false,
		speed: 500,
		slidesToShow: 5,
		slidesToScroll: 1,
		nextArrow: <SampleNextArrow />,
		prevArrow: <SamplePrevArrow />,
		variableWidth: true,
		rows: 1,
		responsive: [
			{
				breakpoint: 1920,
				settings: {
					slidesToShow: 4,
				}
			},
			{
				breakpoint: 1600,
				settings: {
					slidesToShow: 3
				}
			},
			{
				breakpoint: 1368,
				settings: {
					slidesToShow: 2
				}
			},
			{
				breakpoint: 960,
				settings: {
					slidesToShow: 1
				}
			},
		]
	}

	useEffect(() => {
		if (me?.selectedRegionId == null) {
			handleRegionChange(me?.userRegion[0])
		}
	}, [])

	useEffect(() => {
		if (!personInfoLoading && personInfos?.allPersonInfoBySearchItem) {
			setPersonInfoList(personInfos?.allPersonInfoBySearchItem)
		}
	}, [me?.selectedRegionId, personInfos])

	//	Flag state which indicates to leaving confirmation modal when changing region
	const [ unsavedChanges, setUnsavedChanges ] = useState(0);

	const handleRegionChange = (region) => {
		//	Check if there is any form and form is changed
		const forms = document.getElementsByTagName("form");
		let bHasChange: boolean = false;
		for(let i = 0; i < forms.length; i++) {
			let form = forms[i];
			//	Get changed property of the form
			if(form.getAttribute('changed') == 'true')
				bHasChange = true;

			//if(form.name == 'WithdrawalForm'
			//|| form.name == 'CustomFormName'	//	Add Form Name here.
			//	) {
				//	Manually compare the values of DOM elements
				// let inputs = form.getElementsByTagName("input");
				// for(let j = 0; j < inputs.length; j++) {
				// 	if(inputs[j].type == 'text' || inputs[j].type == 'date') {
				// 		//	React sets defaultValue with the value every time it changes, so we compare with empty string for the default forms.
				// 		//	If someone needs custom check, he needs to add another if instead of above if(comparing form names)
				// 		if(inputs[j].value != '')//inputs[j].defaultValue)
				// 			bHasChange = true;
				// 	}
				// 	else if(inputs[j].type == 'checkbox' || inputs[j].type == 'radio') {
				// 		if(inputs[j].checked)// != inputs[j].defaultChecked)
				// 			bHasChange = true;
				// 	}
				// 	else {
				// 		console.log(inputs[j].type, inputs[j]);
				// 	}

				// 	if(bHasChange)	break;
				// }

				// let textareas = form.getElementsByTagName("textarea");
				// for(let j = 0; j < textareas.length; j++) {
				// 	console.log(textareas[j].value, textareas[j].defaultValue);
				// }

				// let selects = form.getElementsByTagName("select");
				// for(let j = 0; j < selects.length; j++) {
				// 	let select = selects[j];
				// 	console.log(select.selectedIndex, select.options);
				// 	if (select.selectedIndex >= 0 && !select.options[select.selectedIndex].defaultSelected) {
				// 		bHasChange = true;
				// 	}
				// 	if(bHasChange)	break;
				// }
				// if(bHasChange)	break;
			//}
		}

		if(bHasChange) {
			setUnsavedChanges(region);
			return;
		}

		setRegion(region);
	}

	const setRegion = (region) => {
		setSelected(region)
		localStorage.setItem('selectedRegion', JSON.stringify(region));

		setMe((prev) => {
			return {
				...prev,
				selectedRegionId: region.region_id,
			}
		});
	};

	const changeHandler = (event) => {
		setSearchField(event)
	}

	const debouncedChangeHandler = useCallback(debounce(changeHandler, 300), [])

	const handleListItemClick = (val) => {
		if (val && val.role == 'Student') {
			const data = {
				student_id: parseInt(val.id),
				parent: {
					parent_id: parseInt(val.parentId),
				},
			}
			showModal(data)
			setStore(true)
		} else if (val && val.role == 'Parent') {
			const data = {
				parent_id: parseInt(val.id),
			}
			showModal(data)
			setStore(true)
		}
	}

	const renderRegionHeader = () =>
		map(me?.userRegion, (region: RegionType) => {
			return (
				<Box
					sx={{ textDecoration: 'none', cursor: 'pointer' }}
					key={region?.regionDetail.id}
					onClick={() => handleRegionChange(region)}
				>
					<Metadata
						divider={true}
						title={
							<Subtitle color={isActive(region?.regionDetail.id) ? MTHBLUE : '#A1A1A1'}>
								{region?.regionDetail.name}
							</Subtitle>
						}
						subtitle={
							<Paragraph color='#cccccc' size={'large'}>
								{region?.regionDetail.program}
							</Paragraph>
						}
						image={
							<Box sx={{position: 'relative'}}>
								<Avatar
									alt={region?.regionDetail.name}
									src={region?.regionDetail?.state_logo}
									variant='rounded'
									style={{ marginRight: 24 }}
								/>
								<Box
									sx={{
										position: 'absolute',
										bottom: -16,
										left: 0,
										width: '65%',
										height: 2,
										borderBottom: region.region_id === selected?.region_id ? '2px solid #4145FF' : 0,
									}}
								/>
							</Box>
						}
					/>
				</Box>
			)
		})

	return (
		<MUIAppBar position='static' sx={classes.appBar} elevation={0}>
			<div style={classes.toolbar}>
				<Grid container justifyContent='space-between' alignItems='center'>
					<Grid item xs={3} sx={{ position: 'relative' }}>
						<OutlinedInput
							size='small'
							style={{ fontSize: 12 }}
							fullWidth
							placeholder='Search Person, Email, or Phone Number'
							onBlur={() => {
								setTimeout(() => {
									setSearchField('')
									setPersonInfoList([])
									setSearchListView(false)
								}, 300)
							}}
							onFocus={() => {
								setSearchListView(true)
							}}
							onChange={(e) => debouncedChangeHandler(e.target.value)}
							startAdornment={
								<InputAdornment position='start'>
									<SearchIcon fontSize='small' style={{ color: 'black' }} />
								</InputAdornment>
							}
						/>
						{searchListView && personInfoList.length > 0 && (
							<Box sx={classes.searchList}>
								<List arial-label='main mailbox folders'>
									{personInfoList.map((personInfo) => (
										<>
											<ListItemButton onClick={() => handleListItemClick(personInfo)}>
												<ListItemText primary={personInfo.name + ' ' + '(' + personInfo.role + ')'} />
											</ListItemButton>
										</>
									))}
								</List>
							</Box>
						)}
					</Grid>
					<Grid item xs={1} />
					<Grid item xs={7}>
						<Box width={'calc(58vw - 200px)'}>
							<Slider {...settings} ref={sliderRef}>
								{renderRegionHeader()}
							</Slider>
						</Box>
					</Grid>
				</Grid>
				{unsavedChanges && (
					<CustomConfirmModal
						header='Unsaved Changes'
						content='Are you sure you want to leave without saving changes?'
						handleConfirmModalChange={(val: boolean, isOk: boolean) => {
							if(isOk) {
								setRegion(unsavedChanges);
							}
							setUnsavedChanges(0);
						}}
					/>
				)}
			</div>
		</MUIAppBar>
	)
}
