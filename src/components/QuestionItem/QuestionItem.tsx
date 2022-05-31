import { Box, Button, Checkbox, IconButton, outlinedInputClasses, Radio, TextField } from '@mui/material'
import { useFormikContext } from 'formik'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Subtitle } from '../Typography/Subtitle/Subtitle'
import DehazeIcon from '@mui/icons-material/Dehaze'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EditIcon from '@mui/icons-material/Edit'
import { SortableHandle } from 'react-sortable-hoc'
import { Question, QUESTION_TYPE } from './QuestionItemProps'
import QuestionModal from './AddNewQuestion'
import { SYSTEM_05, SYSTEM_07 } from '../../utils/constants'
import { DropDown } from '../DropDown/DropDown'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import SignaturePad from 'react-signature-pad-wrapper';
import CustomConfirmModal from '../CustomConfirmModal/CustomConfirmModal'
import { useQuery } from '@apollo/client'
import {
	getActiveSchoolYearsByRegionId,
	getCountiesByRegionId,
	getSchoolDistrictsByRegionId,
	getAllRegion
} from '../../screens/Admin/SiteManagement/EnrollmentSetting/EnrollmentQuestions/services';
import moment from 'moment'
import { UserContext } from '../../providers/UserContext/UserProvider'

const DragHandle = SortableHandle(() => (
	<IconButton>
		<DehazeIcon />
	</IconButton>
))

export default function QuestionItem({
	questions,
	questionTypes,
	additionalQuestionTypes,
	hasAction,	//	Admin => true, Parent => false
}: {
	questions: Question[],
	questionTypes: any[],
	additionalQuestionTypes: any[],
	hasAction: boolean
}) {
	const { me } = useContext(UserContext);
	
	//	Formik values context
	const { values, setValues } = useFormikContext<Question[]>();

	//	Flag State which indicates to show/hide Delete confirmation dialog
	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
	//	Flag State which indicates to show/hide edit dialog
	const [showEditDialog, setShowEditDialog] = useState(false);

	//	States for default options of default questions
	const updateOptionsForDefaultQuestion = (options) => {
		setValues(
			values.map((v) => (v.id == questions[0].id ? {
				...v,
				options: options
			} : v))
		)
	};
	//	program_year
	const {loading: schoolLoading, data: schoolYearData} = useQuery(getActiveSchoolYearsByRegionId, {
		variables: {
			regionId: questions[0]?.region_id,
		},
		skip: (hasAction || questions[0]?.defaultQuestion === false || questions[0]?.options.length > 0 || questions[0]?.slug != 'program_year'),
		fetchPolicy: 'network-only',
	});
	useEffect(() => {
		if (!schoolLoading && schoolYearData && schoolYearData.getSchoolYearsByRegionId) {
			updateOptionsForDefaultQuestion(
				schoolYearData.getSchoolYearsByRegionId.map((item) => {
					return {
						label: moment(item.date_begin).format('YYYY') + '-' + moment(item.date_end).format('YYYY'),
						value: item.school_year_id,
					}
				})
			);
		}
	}, [schoolYearData]);
	//	address_county_id
	const {loading: countyLoading, data: countyData } = useQuery(getCountiesByRegionId, {
    variables: {regionId: questions[0]?.region_id},
		skip: hasAction || questions[0]?.defaultQuestion === false || questions[0]?.options.length > 0 || questions[0]?.slug != 'address_county_id',
    fetchPolicy: 'network-only',
  });
  useEffect(() => {
    !countyLoading && countyData?.getCounties &&
      updateOptionsForDefaultQuestion(
        countyData.getCounties
          .map((v) => {return {label: v.county_name, value: Number(v.id)}})
      )
  }, [countyData]);
	//	packet_school_district
	const {loading: schoolDistrictsDataLoading, data: schoolDistrictsData} = useQuery(getSchoolDistrictsByRegionId, {
    variables: {
      regionId: questions[0]?.region_id,
    },
    skip: hasAction || questions[0]?.defaultQuestion === false || questions[0]?.options.length > 0 || questions[0]?.slug != 'packet_school_district',
    fetchPolicy: 'network-only',
  })
  useEffect(() => {
      !schoolDistrictsDataLoading && schoolDistrictsData?.schoolDistrict.length > 0 &&
      	updateOptionsForDefaultQuestion(
					schoolDistrictsData?.schoolDistrict.map((d) => {return {label: d.school_district_name, value: d.school_district_name}})
				)
  }, [schoolDistrictsDataLoading])
	//	address_state
	const { data: regionData, loading: regionDataLoading } = useQuery(getAllRegion, {
		skip: hasAction || questions[0]?.defaultQuestion === false || questions[0]?.options.length > 0 || questions[0]?.slug != 'address_state',
		fetchPolicy: 'network-only'
	});
  useEffect(() => {
    !regionDataLoading && regionData && regionData.regions &&
      updateOptionsForDefaultQuestion(
        regionData.regions?.map((region) => ({
          label: region.name,
          value: region.id,
        }))
      );
  }, [regionData])
	//	student_gender
	useEffect(() => {
		!hasAction && questions[0]?.defaultQuestion && questions[0]?.options.length == 0 && questions[0]?.slug == 'student_gender' &&
			updateOptionsForDefaultQuestion([
        {label: 'Male', value: 1},
        {label: 'Female', value: 2},
        {label: 'Non Binary', value: 3},
        {label: 'Undeclared', value: 4},
      ]);
	}, []);
	//	student_grade_level
	//	TODO

	//	student
	useEffect(() => {
		!hasAction && questions[0]?.mainQuestion && questions[0]?.options.length == 0 && questions[0]?.slug == 'student' &&
			updateOptionsForDefaultQuestion(
				me?.students?.map((student) => ({
					label: student.person.first_name,
					value: student.student_id
				}))
			);
	}, [questions]);

	return (
		<>
			<Box display='flex' mt='20px' alignItems='center' justifyContent='left'>
				<Box flex='1' paddingTop='10px' maxWidth={hasAction ? '80%' : '100%'}>
					<Item question={questions[0]} />
				</Box>
				{hasAction && !questions[0]?.mainQuestion && (
					<Box display='inline-flex' paddingTop='10px' height='40px' alignItems='center' justifyContent='center'>
						<DragHandle />
						
						<IconButton onClick={() => setShowEditDialog(true)}>
							<EditIcon />
						</IconButton>

						<IconButton onClick={() => setShowDeleteDialog(true)}>
							<DeleteForeverOutlinedIcon />
						</IconButton>
					</Box>
				)}
			</Box>
			{showEditDialog && <QuestionModal onClose={() => setShowEditDialog(false)} questions={questions} questionTypes={questionTypes} additionalQuestionTypes={additionalQuestionTypes} />}
			{showDeleteDialog && (
				<CustomConfirmModal
					header="Delete Question" 
					content="Are you sure you want to delete this question?"
					handleConfirmModalChange={(val: boolean, isOk: boolean) => {
						setShowDeleteDialog(false);
						if(isOk) {
							setValues(values.filter((i) => i.id !== questions[0].id))
						}
					}}
				/>
			)}
		</>
	)
}
function Item({ question: q }: { question: Question }) {
	const signature = useRef(null);

	//	Formik values context
	const { values, setValues, errors, touched } = useFormikContext<Question[]>();

	//	Response
	const setQuestionResponse = (value) => {//console.log(q, value);
		if(q.type == QUESTION_TYPE.CHECKBOX) {
			if(q.response.indexOf('"' + value + '"') >= 0) {
				q.response = q.response.replace('"' + value + '"', '');
			}
			else {
				q.response += '"' + value + '"';
			}
			value = q.response;
		}
		const newValues = values.map((v) => (v.id == q.id ? {
			...v,
			response: value
		} : v));
		let current = q;
		while(newValues.find(x => current.slug == x.additionalQuestion)
		&& (current.response == '' || current.options.find(x => x.value == current.response
													|| current.response.toString().indexOf('"' + x.value + '"') >= 0).action != 2)) {
			current = newValues.find(x => current.slug == x.additionalQuestion);
			current.response = '';
		}
		setValues(
			newValues
		);
	};

	switch (q?.type) {
		case QUESTION_TYPE.DROPDOWN:
			return (
				<DropDown
					sx={{
						marginTop: '10px',
						maxWidth: '100%',
						borderColor: errors[q.id] ? 'red' : '',
						[`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
							borderColor: SYSTEM_07,
						},
					}}
					name={q.id.toString()}
					labelTop
					dropDownItems={q.options || []}
					placeholder={q.question}
					setParentValue={(val) => {setQuestionResponse(val)}}
					alternate={true}
					size='small'
					error={{
						error: !!touched[q.id] && !!errors[q.id],
						errorMsg: !!touched[q.id] && !!errors[q.id] ? 'This field is required' : ''
					}}
				/>
			);
		case QUESTION_TYPE.TEXTFIELD:
			return (
				<TextField
					size='small'
					sx={{
						marginTop: '10px',
						minWidth: '100%',
						maxWidth: '100%',
						[`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
							borderColor: SYSTEM_07,
						}
					}}
					InputLabelProps={{
						style: { color: SYSTEM_05 },
					}}
					FormHelperTextProps={{
						style: {
							color: '#BD0043'
						}
					}}
					label={q.question}
					variant='outlined'
					value={q.response}
					onChange={(e) => (setQuestionResponse(e.currentTarget.value))}
					name={q.id.toString()}
					error={!!touched[q.id] && !!errors[q.id]}
					helperText={errors[q.id]}
				/>
			);
		case QUESTION_TYPE.CHECKBOX:
			return (
				<Box>
					<Subtitle
						color={SYSTEM_05}
						sx={{
							paddingLeft: '20px',
							paddingBottom: '10px',
							width: '100%',
							maxWidth: '100%',
							textAlign: 'start',
							wordWrap: 'break-word',
							borderBottom: '1px solid ' + SYSTEM_07,
						}}
					>
						{q.question}
					</Subtitle>
					{(q.options ?? []).map((o) => (
						<Box
							key={o.value}
							display='flex'
							alignItems='center'
							sx={{
								borderBottom: '1px solid ' + SYSTEM_07,
								marginTop: '10px',
								width: '100%',
							}}
						>
							<Checkbox
								checked={q.response?.indexOf('"' + o.value + '"') >= 0}
								onClick={() => setQuestionResponse(o.value)} />
							<Subtitle size='small' sx={{wordWrap: 'break-word',maxWidth: '90%',textAlign: 'start',}}>{o.label}</Subtitle>
						</Box>
					))}
				</Box>
			);
		case QUESTION_TYPE.AGREEMENT:
			return (
				<Box display='flex' alignItems='center'>
					<Checkbox
						checked={q.response === true}
						onChange={(e) => setQuestionResponse(e.currentTarget.checked)}
					/>
					<Subtitle size='small' color={SYSTEM_05} sx={{wordWrap: 'break-word', maxWidth: '90%', textAlign: 'start',}}>
						<p dangerouslySetInnerHTML={{ __html: q.question }}></p>
					</Subtitle>
				</Box>
			);
		case QUESTION_TYPE.MULTIPLECHOICES:
			return (
				<Box>
					<Subtitle
						sx={{
							paddingLeft: '20px',
							paddingBottom: '10px',
							width: '100%',
							textAlign: 'start',
							borderBottom: '1px solid ' + SYSTEM_07,
							wordWrap: 'break-word',
						}}
						color={SYSTEM_05}
					>
						{q.question}
					</Subtitle>
	
					{(q.options ?? []).map((o) => (
						<Box
							key={o.value}
							display='flex'
							alignItems='center'
							sx={{
								borderBottom: '1px solid ' + SYSTEM_07,
								marginTop: '10px',
								width: '100%',
							}}
						>
							<Radio
								checked={o.value == q.response}
								onChange={(e) => e.currentTarget.checked && setQuestionResponse(o.value)}
							/>
							<Subtitle size='small' sx={{wordWrap: 'break-word', maxWidth: '90%', textAlign: 'start'}}>{o.label}</Subtitle>
						</Box>
					))}
				</Box>
			);
			break;
		case QUESTION_TYPE.CALENDAR:
			return (
				<TextField
					size='small'
					sx={{
						marginTop: '10px',
						minWidth: '100%',
						[`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
							borderColor: SYSTEM_07,
						},
					}}
					InputLabelProps={{
						style: { color: SYSTEM_05 },
					}}
					label={q.question}
					variant='outlined'
					value={q.response}
					onChange={(v) => setQuestionResponse(v.currentTarget.value)}
					focused
					type="date"
					inputProps={{min: moment().format('YYYY-MM-DD')}}
					FormHelperTextProps={{
						style: {
							color: '#BD0043'
						}
					}}
					error={!!touched[q.id] && !!errors[q.id]}
					helperText={errors[q.id]}
				/>
			);
		case QUESTION_TYPE.INFORMATION:
			return (
				<Paragraph size='large'>
					<p dangerouslySetInnerHTML={{ __html: q.question }}></p>
				</Paragraph>
			);
		case QUESTION_TYPE.SIGNATURE:
			return (
				<Box sx={{ width: "100%", margin: "auto", mt: 0 }}>
					<TextField
						placeholder="Entry"
						fullWidth
						value={q.response}
						onChange={function(e: any): void {}}
						size="medium"
						sx={{ mb: 2, background: "#fff" }}
						value={q.response}
						onChange={(v) => setQuestionResponse(v.currentTarget.value)}
					/>
					<Subtitle size={12}>
						{q.question}
					</Subtitle>
					<SignaturePad
						options={{ minWidth: 1, maxWidth: 1, }}
						width={500}
						height={100}
						ref={signature}
					/>
					<Box sx={{ height: 1, width: "100%", borderBottom: "1px solid #000", mb: 0.5 }} />
					<Button onClick={function(e: any): void {if(signature.current) {signature.current.clear();}}}>
							<Subtitle size={12} sx={{textDecoration: 'underline'}} >
									Reset
							</Subtitle>
					</Button>
			</Box>
			);
		default:
			break;
	}

	return null
}
