import { Box, Button, Checkbox, Modal, outlinedInputClasses, TextField, Typography } from '@mui/material'
import { useFormikContext } from 'formik'
import React, { useState, useRef, useContext, useEffect } from 'react'
import { Subtitle } from '../../Typography/Subtitle/Subtitle'
import QuestionOptions from './Options'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import Wysiwyg from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import { convertFromHTML } from 'draft-convert'
import { Question, QuestionTypes, QUESTION_TYPE } from '../QuestionItemProps'
import { SYSTEM_07 } from '../../../utils/constants'
import { DropDown } from '../../DropDown/DropDown'
import { validationTypes } from '../../../screens/Admin/SiteManagement/EnrollmentSetting/constant/defaultQuestions'
import { UserContext } from '../../../providers/UserContext/UserProvider'
import moment from 'moment'
import { useQuery } from '@apollo/client'
import { getActiveSchoolYearsByRegionId } from '../../../screens/Admin/SiteManagement/EnrollmentSetting/EnrollmentQuestions/services';
import htmlToDraft from 'html-to-draftjs'

export default function AddNewQuestionModal({
	onClose,
	editItem,
	region
}: {
	onClose: () => void,
	editItem?: Question,
	region: number
}) {
	const { me } = useContext(UserContext);
	//	Formik values context
	const { values, setValues } = useFormikContext<Question[]>();
	//	The fields of editItem(Question)
	const [question, setQuestion] = useState(editItem?.question || '');
	const [type, setType] = useState(editItem?.type || QUESTION_TYPE.DROPDOWN);
	const [validationType, setValidationType] = useState(editItem?.validation || 1);
	const [required, setRequired] = useState(editItem?.required || false);
	const [validation, setValidation] = useState(editItem?.validation ? true : false || false);
	const [options, setOptions] = useState(editItem?.options || [])

	//	Error State
	const [error, setError] = useState('')

	//	Editor related states and functions
	const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(editItem?.question || '').contentBlocks)));
	const editorRef = useRef(null);
	const [currentBlocks, setCurrentBlocks] = useState(0)
	const handleEditorChange = (state) => {
		try {
			if (currentBlocks !== 0 && currentBlocks !== state.blocks.length) {
				editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
			}
			setCurrentBlocks(state.blocks.length)
		} catch {}
	}

	//	States for default options of default questions
	const {loading: schoolLoading, data: schoolYearData} = useQuery(getActiveSchoolYearsByRegionId, {
		variables: {
			regionId: region,
		},
		skip: (editItem?.defaultQuestion === false || editItem?.options.length > 0 || editItem?.slug != 'program_year'),
		fetchPolicy: 'network-only',
	});
	useEffect(() => {
		if (!schoolLoading && schoolYearData && schoolYearData.getActiveSchoolYears) {
			setOptions(
				schoolYearData.getActiveSchoolYears.map((item) => {
					return {
						label: moment(item.date_begin).format('YYYY') + '-' + moment(item.date_end).format('YYYY'),
						value: item.school_year_id,
					}
				}),
			)
		}
	}, [schoolYearData]);

	//	Save handler
	function onSave() {
		//	Validation check
		if (question.trim() === '' && type !== QUESTION_TYPE.INFORMATION && type !== QUESTION_TYPE.AGREEMENT) {
			setError('Question is required')
			return
		} else if ([QUESTION_TYPE.DROPDOWN
								, QUESTION_TYPE.CHECKBOX
								, QUESTION_TYPE.MULTIPLECHOICES].includes(type)
								&& options.length && options[0].label.trim() === '' && !editItem.defaultQuestion) {
			setError('Options are required')
			return
		}

		//	Generate new object from the edited information
		const item: Question = {
			id: editItem?.id,
			region_id: region,
			section: 'quick-link-withdrawal',
			sequence: editItem?.sequence || values.length + 1,
			question: type === QUESTION_TYPE.INFORMATION || type === QUESTION_TYPE.AGREEMENT ? draftToHtml(convertToRaw(editorState.getCurrentContent())) : question,
			type,
			options: options.filter((v) => v.label.trim()),
			mainQuestion: false,
			defaultQuestion: editItem?.defaultQuestion,
			validation: validation ? validationType : 0,
			required,
			slug: `meta_${+new Date()}`,

			response: '',
		};

		let id = editItem?.id;
		if(id === undefined) {	//	Insert case
			//	Generate new id
			const min = Math.min.apply(null, values.map(value => value.id));
			id = min - 1;
			//	-9 ~ 0 is reserved
			if(id > -10)	id = -10;
			item.id = id;

			setValues([...values, item])
		}
		else {									//	Update case
			setValues(values.map((v) => (v.id === editItem.id ? item : v)))
		}
		
		onClose()
	}

	//	Detect type Drop Down changes
	useEffect(() => {
		if(editItem?.defaultQuestion)
			return;

		if([QUESTION_TYPE.MULTIPLECHOICES
			, QUESTION_TYPE.CHECKBOX
			, QUESTION_TYPE.DROPDOWN].find(x => x == type) != null) {
			if(options.length == 0) {
				setOptions([{
					value: 1,
					label: '',
				}]);
			}
		}
		else {
			setOptions([]);
		}
	}, [type]);

	//	Set default options for default questions
	// useEffect(() => {console.log(options);
	// 	if(options.length == 0 && editItem?.defaultQuestion) {
	// 		switch(editItem?.slug) {
	// 			case 'student_grade_level':
	// 				break;
	// 			case 'address_state':
	// 				break;
	// 			case 'student_gender':
	// 				break;
	// 			case 'packet_school_district':
	// 				break;
	// 			case 'address_country_id':
	// 				break;
	// 			case 'program_year':
	// 				break;
	// 			default:
	// 				if(editItem?.type == QUESTION_TYPE.MULTIPLECHOICES
	// 					|| editItem?.type == QUESTION_TYPE.DROPDOWN
	// 					|| editItem?.type == QUESTION_TYPE.CHECKBOX) {
	// 					console.warn(editItem);
	// 				}
	// 				break;
	// 		}
	// 	}
	// }, [options]);

	return (
		<Modal open={true} aria-labelledby='child-modal-title' aria-describedby='child-modal-description'>
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: '800px',
					bgcolor: '#fff',
					borderRadius: 8,
					p: 4,
				}}
			>
				<Box
					sx={{
						display: 'flex',
						height: '40px',
						width: '100%',
						justifyContent: 'end',
					}}
				>
					<Button sx={styles.cancelButton} onClick={() => onClose()}>
						Cancel
					</Button>
					<Button sx={styles.actionButtons} onClick={() => onSave()}>
						Save
					</Button>
				</Box>

				<Box
					sx={{
						width: '100%',
						height: '40px',
						mt: '40px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					<TextField
						size='small'
						sx={{
							visibility: (type === QUESTION_TYPE.INFORMATION || type == QUESTION_TYPE.AGREEMENT) ? 'hidden' : 'visible',
							minWidth: '400px',
							[`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
							{
								borderColor: SYSTEM_07,
							},
						}}
						label='Question'
						variant='outlined'
						value={question}
						onChange={(v) => setQuestion(v.currentTarget.value)}
						focused
						disabled={editItem?.defaultQuestion}
					/>
					<DropDown
						sx={{
							pointerEvents: editItem?.defaultQuestion ? 'none' : 'unset',
							minWidth: '200px',
							[`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
							{
								borderColor: SYSTEM_07,
							},
							marginRight: '50px'
						}}
						labelTop
						dropDownItems={QuestionTypes}
						placeholder='Type'
						defaultValue={type}
						// @ts-ignore
						setParentValue={(v) => setType(+v)}
						size='small'
					/>
				</Box>
				<Box mt='30px' width='100%' display='flex' flexDirection='column'>
					{type === QUESTION_TYPE.TEXTFIELD || type === QUESTION_TYPE.CALENDAR ? (
						<Box height='50px' />
					) : type === QUESTION_TYPE.INFORMATION || type === QUESTION_TYPE.AGREEMENT ? (
						<Box sx={{
							border: '1px solid #d1d1d1',
							borderRadius: 1,
							'div.DraftEditor-editorContainer': {
								minHeight: '200px',
								maxHeight: '250px',
								overflow: 'auto',
								padding: 1,
							},
						}}>
							<Wysiwyg.Editor
								onContentStateChange={handleEditorChange}
								editorRef={(ref) => (editorRef.current = ref)}
								editorState={editorState}
								onEditorStateChange={setEditorState}
								toolbar={{
									options: [
										'inline', 
										'list',
										'link',
									],
									inline: {
										options: ['bold', 'italic'],
									},
									list: {
										options: ['unordered', 'ordered'],
									}
								}}
							/>
						</Box>
					) :
					!editItem?.defaultQuestion && (
						<QuestionOptions options={options} setOptions={setOptions} type={type} />
					)}
				</Box>

				<Box
					sx={{
						width: '100%',
						height: '40px',
						mt: '40px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					<Box sx={{display: 'flex', alignItems: 'center', visibility: type === QUESTION_TYPE.TEXTFIELD ? 'visible' : 'hidden'}}>
						<Checkbox checked={validation} onClick={() => setValidation(!validation)} disabled={editItem?.defaultQuestion}/>
						<Subtitle size='small'>Validation</Subtitle>
					</Box>
					<Box sx={{display: 'flex', alignItems: 'center',}}>
						<Checkbox checked={required} onClick={() => setRequired(!required)} />
						<Subtitle size='small'>Required</Subtitle>
					</Box>
				</Box>
				<Box sx={{
						width: '100%',
						height: '40px',
						mt: '40px',
						alignItems: 'center',
						justifyContent: 'start',
						display: validation ? 'flex' : 'none',
					}}
				>
					<DropDown
						sx={{
							pointerEvents: editItem?.defaultQuestion ? 'none' : 'unset',
							minWidth: '200px',
							[`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
							{
								borderColor: SYSTEM_07,
							},
						}}
						labelTop
						dropDownItems={validationTypes}
						placeholder='Type'
						defaultValue={validationType}
						// @ts-ignore
						setParentValue={(v) => setValidationType(+v)}
						size='small'
					/>
				</Box>
				{error && <Typography color='red'>{error}</Typography>}
			</Box>
		</Modal>
	)
}

const styles = {
	actionButtons: {
		borderRadius: 4,

		background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
		fontWeight: 'bold',
		padding: '11px 60px',
		color: 'white',
	},
	cancelButton: {
		borderRadius: 4,
		background: 'linear-gradient(90deg, #D23C33 0%, rgba(62, 39, 131, 0) 100%) #D23C33',
		fontWeight: 'bold',
		mr: 2,
		color: 'white',
		padding: '11px 60px',
	},
}
