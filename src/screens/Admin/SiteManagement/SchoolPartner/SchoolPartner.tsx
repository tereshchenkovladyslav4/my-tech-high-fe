import { IconButton, Typography, Button, Grid, TextField, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useStyles } from '../styles'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { useHistory } from 'react-router-dom'
import { Title } from '../../../../components/Typography/Title/Title'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded';
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { BUTTON_LINEAR_GRADIENT, RED_GRADIENT } from '../../../../utils/constants'
import { HeadCell } from '../../../../components/SortableTable/SortableTableHeader/types'
import { SortableTable } from '../../../../components/SortableTable/SortableTable'
import CreateIcon from '@mui/icons-material/Create';
import { SchoolPartnerEditModal } from './SchoolPartnerEditModal/SchoolPartnerEditModal'
import CircularProgress from '@mui/material/CircularProgress';
import { Field, Form, Formik, useFormik } from 'formik';
import * as yup from 'yup'
import { useMutation, useQuery } from '@apollo/client'
import { CreateNewSchoolPartnerMutation, GetSchoolsOfEnrollment } from './services'
import { map, orderBy, sortBy } from 'lodash'
import { ArchiveSchoolPartnerModal } from './ArchiveSchoolPartnerModal/ArchiveSchoolPartnerModal'
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import { SchoolPartnerType } from './types'

export type ValidateFileResponse = {
	status: boolean,
	message?: string,
}

export const SchoolPartner = () => {
	
	const classes = useStyles
  const history = useHistory()
	
	const [ createNewSchoolPartner, {data, error, loading} ] = useMutation(CreateNewSchoolPartnerMutation)
	const {loading: schoolLoading, data: schoolsOfEnrollmentData, refetch} = useQuery(GetSchoolsOfEnrollment, {
		fetchPolicy: 'network-only',
	});

	const [selectedFiles, setSelectedFiles] = useState<File>()
	const [errorMessage, setErrorMessage] = useState('')
	const [isUploading, setIsUploading] = useState(false)
	const initialValues = {
		partnerName: undefined,
		abbreviation: undefined,
	}

	const [openEditModal, setOpenEditModal] = useState<SchoolPartnerType>()
	const [archiveModal, setArchiveModal] = useState<SchoolPartnerType>()

	const validationSchema = {
		partnerName: yup.string()
			.required('Partner Name is a required field'),
		abbreviation: yup.string()
		.required('Abbreviation is a required field'),
	}

	const handleBackClick = () => {
    history.push('/site-management/')
  }

	const tableHeaders: HeadCell[] = [
    {
      id: 'submitted',
      numeric: false,
      disablePadding: true,
      label: 'Partner Name',
    },
    {
      id: 'year',
      numeric: false,
      disablePadding: true,
      label: 'Abbreviation',
    },
  ]

	const filesSelected = (e: any) => {
		handleFiles(e.target.files)
	}

	const handleFiles = (files: File[]) => {
		const file = validateFile(files[0])
			if (file.status === true) {
					setSelectedFiles(files[0])
			} else {
				files[0]['invalid'] = true;
				setErrorMessage(file.message);
			}
	}

	const validateFile = (file: File): ValidateFileResponse => {
		// Get the size of the file by files.item(i).size.
			const validTypes = ['application/pdf', "image/png", "image/jpeg"]
			if(Math.round((file.size/1024)) > 25000){
				return {
					status: false,
					message: 'This file exceeds maximum allowed size of 25 MB'
				}
			}
			if (validTypes.indexOf(file.type) === -1) {
				return {
					status: false,
					message: 'Please only submit pdf, jpeg, or png'
				}
			}
			return {
				status: true,
			}
	}

	const uploadPhoto = async () => {
		if (selectedFiles) {
			const bodyFormData = new FormData()
			bodyFormData.append('file', selectedFiles)
			const response = await fetch(import.meta.env.SNOWPACK_PUBLIC_BASE_S3_UPLOAD_URL + '/uploadImage',{
				method: 'POST',
				body: bodyFormData,
				headers: {
					Authorization: `Bearer ${localStorage.getItem('JWT')}`,
				},
			})
			const imageUrl = await response.json()
			return imageUrl.data.file.item1
		}
	}

	const renderRows = () => {
		const sortedElements = sortBy(schoolsOfEnrollmentData?.getSchoolsOfEnrollment, el => el.active  !== 1)
		return map(sortedElements, (el) => {
			return el.active === 1
				? ({
						id: el.school_partner_id,
						name: <Paragraph size='medium' fontWeight='500'> { el.name } </Paragraph>,
						abbreviation: <Paragraph size='medium' fontWeight='500'> { el.abbreviation } </Paragraph>,
						edit: <Box display={'flex'} flexDirection='row'>
						<Tooltip title='Edit'>
							<CreateIcon onClick={() => setOpenEditModal(el)}/>
						</Tooltip>
						<Tooltip title='Archive'>
							<SystemUpdateAltRoundedIcon sx={{ marginLeft: 2}} onClick={() => setArchiveModal(el)}/>
						</Tooltip>
					</Box>
				})
				: ({
					id: el.school_partner_id,
					name: <Paragraph size='medium' fontWeight='500' color='#A3A3A4'> { el.name } </Paragraph>,
					abbreviation: <Paragraph size='medium' color='#A3A3A4'> { el.abbreviation } </Paragraph>,
					edit: <Box display={'flex'} flexDirection='row' >
						<Tooltip title='Unarchive'>
							<CallMissedOutgoingIcon sx={{ marginLeft:5, color: '#A3A3A4'}} onClick={() => setArchiveModal(el)}/>
						</Tooltip>
				</Box>
			})
	})
}
	
	useEffect(() => {
		if(!openEditModal){
			refetch()
		}
	},[openEditModal])

	useEffect(() => {
		if(!archiveModal){
			refetch()
		}
	},[archiveModal])

	return (
    <Box sx={classes.base}>
			{ openEditModal 
			&& <SchoolPartnerEditModal 
				handleModem={() => setOpenEditModal(undefined)}
				el={openEditModal}
			/> 
			}
			{
				archiveModal
				&& <ArchiveSchoolPartnerModal
					handleModem={() => setArchiveModal(undefined)}
					el={archiveModal}
					/>
			}
			<Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: '16px',
          paddingLeft: 0,
        }}
      >
        <Box sx={{ paddingLeft: 0 }}>
          <IconButton
            onClick={handleBackClick}
            sx={{
              position: 'relative',
              bottom: '2px',
              paddingLeft: 0,
            }}
          >
            <ArrowBackIosRoundedIcon sx={{ fontSize: '15px', stroke: 'black', strokeWidth: 2 }} />
          </IconButton>
          <Typography paddingLeft='7px' fontSize='20px' fontWeight='700' component='span'>
            Edit School Partners
          </Typography>
        </Box>
      </Box>
			<Grid container columnSpacing={8}>
				<Grid item xs={6} sx={{ marginTop: 4, borderRight: '1px solid black'}}>
					<SortableTable
						headCells={tableHeaders}
						rows={renderRows()}
						onSortChange={() => {}}
						hideCheck={true}
						hover={false}
					/>
				</Grid>
				<Grid item xs={6}>
					<Formik
						initialValues={initialValues}
						validationSchema={yup.object(validationSchema)}
						onSubmit={(values, { resetForm }) => {
							setIsUploading(true)
							uploadPhoto().then((resp) => {
								createNewSchoolPartner({
									variables: {
										schoolPartnerInput: {
											name: values.partnerName,
											abbreviation: values.abbreviation,
											photo: resp
										}
									}
								}).then(() => {
									resetForm({})
									setSelectedFiles(undefined)
									refetch()
									setIsUploading(false)
								})
							})				
						}}
					>
						{ ({ values, errors, resetForm }) => {
							return (
								<Form>
									<Box 
										sx={{
											display: 'flex',
											flexDirection: 'column'
										}}
									> 
										<Subtitle textAlign='left' size='large' fontWeight='900'>New School Partner</Subtitle>
											{ !isUploading
												? <>
													<Box
														sx={{
															display: 'flex',
															flexDirection: 'column',
														}}
													>
														<Field name={`partnerName`} fullWidth focused>
															{({ field, form, meta }) => (
																<TextField
																	name='partnerName'
																	label="Partner Name"
																	placeholder="Entry"
																	fullWidth
																	variant='outlined'
																	focused
																	sx={{ 
																		width: '100%', 
																		marginTop: 2,
																		'& .MuiOutlinedInput-root': {
																			'&.Mui-focused fieldset': {
																				borderColor: '#333',
																				borderWidth: '1px',
																			},
																		}
																	}}
																	size='small'
																	{...field}
																	error={meta.error}
																	helperText={meta.touched && meta.error}
																	value={values.partnerName || ''}
																/>
															)}
														</Field>
														<Field name={`abbreviation`} fullWidth focused>
															{({ field, form, meta }) => (
																<TextField
																	name='abbreviation'
																	label="Abbreviation"
																	placeholder="Entry"
																	fullWidth
																	variant='outlined'
																	focused
																	sx={{ 
																		width: '100%', 
																		marginTop: 2,
																		'& .MuiOutlinedInput-root': {
																			'&.Mui-focused fieldset': {
																				borderColor: '#333',
																				borderWidth: '1px',
																			},
																		}
																	}}
																	size='small'
																	{...field}
																	error={meta.error}
																	helperText={meta.touched && meta.error}
																	value={values.abbreviation || ''}
																/>
															)}
														</Field>
													</Box>
													<Box
														sx={{
															display: 'flex',
															flexDirection: 'column',
															marginTop: 4,
															justifyContent: 'center',
															alignSelf: 'center'
														}}
													>
														<label 											
															style={{
																display: 'flex',
																background: '#FAFAFA',
																flexDirection: 'column',
																justifyContent: 'center',
																alignItems: 'center',
																alignContent: 'center',
																height: '164px',
																width: '164px',
																alignSelf: 'center',
																cursor: 'pointer'
															}}
														>
															<input 
																type="file"
																style={{ display: 'none' }}
																onChange={filesSelected}
																accept='image/png, image/jpeg'
															/>
															<Box>
																{
																	!selectedFiles
																	? <>
																		<SystemUpdateAltRoundedIcon 
																			sx={{ 
																				width: 35, 
																				height: 35, 
																				cursor: 'pointer',
																				WebkitTransform: 'rotateX(180deg)', 
																				transform: 'rotateX(180deg)',
																			}}
																		/>
																		<Paragraph size='large'>Upload Logo</Paragraph>
																	</>
																	: <img 
																		src={URL.createObjectURL(selectedFiles)}
																		style={{
																			height: '164px',
																			width: '164px',
																		}}
																	/>
																}
															</Box>
														</label>
														<Box
															sx={{
																display: 'flex',
																flexDirection: 'row',
																justifyContent: 'space-between',
																marginTop: 4
															}}
														>
															<Button
																sx={{
																	fontSize: 11,
																	fontWeight: 700,
																	borderRadius: 2,
																	textTransform: 'none',
																	height: '33px',
																	background: RED_GRADIENT,
																	color: 'white',
																	width: '195px',
																	marginRight: 2,
																}}
																onClick={() => {
																	resetForm()
																	setSelectedFiles(undefined)
																}}
															> 
																Cancel 
															</Button>
															<Button
																type='submit'
																sx={{
																	fontSize: 11,
																	fontWeight: 700,
																	borderRadius: 2,
																	textTransform: 'none',
																	height: '33px',
																	background: BUTTON_LINEAR_GRADIENT,
																	color: 'white',
																	width: '195px',
																	marginRight: 2,
																}}
															> 
																Save
															</Button>
														</Box>
													</Box>
												</>
										: <Box display='flex' flexDirection='column' justifyContent='center' alignContent='center'>
										<CircularProgress sx={{ alignSelf:'center', marginTop: 4}}/>
									</Box>
									}
									</Box>
								</Form>
							)
						}}
						</Formik>
				</Grid>
			</Grid>
		</Box>
	)
}
