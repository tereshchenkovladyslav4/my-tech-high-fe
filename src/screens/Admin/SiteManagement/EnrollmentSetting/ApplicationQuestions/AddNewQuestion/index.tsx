import { Box, Button, Checkbox, Modal, outlinedInputClasses, TextField, Typography } from '@mui/material'
import { useFormikContext } from 'formik'
import React, { useState, useRef, useContext, useEffect } from 'react'
import { Subtitle } from '../../../../../../components/Typography/Subtitle/Subtitle'
import QuestionOptions from './Options'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import Wysiwyg from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import { Question, QUESTION_TYPE } from '../../../../../../components/QuestionItem/QuestionItemProps';
import { SYSTEM_07 } from '../../../../../../utils/constants'
import { DropDown } from '../../../components/DropDown/DropDown'
import htmlToDraft from 'html-to-draftjs'
import { ApplicationQuestion } from '../types'
import CustomModal from '../../components/CustomModal/CustomModals'

export default function AddNewQuestionModal({
	onClose,
	questions,
	questionTypes,
	additionalQuestionTypes
}: {
	onClose: (res) => void,
	questions?: ApplicationQuestion[],
	questionTypes: any[],
	additionalQuestionTypes: any[]
}) {
	const validationTypes = [
		{
			label: 'Email',
			value: 1
		},
		{
			label: 'Numbers',
			value: 2
		}
	];

	//	Formik values context
	const { values, setValues } = useFormikContext<ApplicationQuestion[]>();

	const [editQuestions, setEditQuestions] = useState(JSON.parse(JSON.stringify(questions)));
	const [deleteIds, setDeleteIds] = useState([]);
	const [isDefaultQuestion, setIsDefaultQuestion] = useState(questions[0]?.default_question || false)

	const editQuestionsRef = useRef([]);

	useEffect(() => {
		if (editQuestions.length == 0) {
			return;
		}

		if (editQuestionsRef.current.length == 0 && editQuestions.length > 0) {
			//	Set Editor Content
			(editQuestions[0].type == QUESTION_TYPE.AGREEMENT || editQuestions[0].type == QUESTION_TYPE.INFORMATION)
				&& draftToHtml(convertToRaw(editorState.getCurrentContent())) != editQuestions[0].question
				&& setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(editQuestions[0].question).contentBlocks)));
		}

		editQuestionsRef.current = editQuestions;

		// if (editQuestions[0].default_question)
		// 	return;

		//	Detect Changes
		let bHasChange = false;
		const newQuestions = editQuestions.map(
			question => {
				if ([QUESTION_TYPE.MULTIPLECHOICES
					, QUESTION_TYPE.CHECKBOX
					, QUESTION_TYPE.DROPDOWN].find(x => x == question.type)) {
					if (question.options.length == 0) {
						bHasChange = true;
						return {
							...question,
							options: [{
								value: 1,
								label: ''
							}]
						};
					}
					else if (question.options[question.options.length - 1].label.trim() != '') {
						bHasChange = true;
						return {
							...question,
							options: [
								...question.options,
								{
									value: question.options.length + 1,
									label: ''
								}]
						};
					}
					else {
						return question;
					}
				}
				else {
					return question;
				}
			}
		);

		//	Handle additional questions
		for (let i = 0; i < newQuestions.length; i++) {
			let question = newQuestions[i];
			if (question.options.find(o => o.action == 2)		//	If one option is set to Ask an additional question
				&& i == newQuestions.length - 1)							//	And no additional question exists
			{
				//	Add One
				newQuestions.push({
					id: undefined,
					region_id: newQuestions[0].region_id,
					section: newQuestions[0].section,
					type: QUESTION_TYPE.DROPDOWN,
					sequence: newQuestions[0].sequence,
					question: '',
					default_question: false,
					mainQuestion: false,
					additional_question: question.slug,
					validation: 0,
					slug: `meta_${+new Date()}`,
					options: [{
						value: 1,
						label: ''
					}],
					required: false,
					response: ''
				});
				bHasChange = true;
			}
			else if (question.options.find(o => o.action == 2) == null	//	If no options is set to Ask an additional question
				&& i < newQuestions.length - 1)								//	And this is the latest question
			{
				bHasChange = true;
				//	Remove all following additional questions
				for (let j = newQuestions.length - 1; j > i; j--) {
					if (newQuestions[j].id != undefined) {
						deleteIds.push(newQuestions[j].id);
					}
					newQuestions.pop();
				}
				setDeleteIds(deleteIds);
			}
		}

		if (bHasChange)
			setEditQuestions(
				newQuestions
			);
	}, [editQuestions]);

	//	The fields of editItem(Question)
	const setQuestionValue = (id, slug, field, value) => {
		const newQuestions = editQuestions.map(
			question => {
				if (question.id == id && question.slug == slug) {	//	We compare slug if id is undefined when adding new question
					question[field] = value;
					return question;
				}
				else {
					return question;
				}
			}
		);

		setEditQuestions(newQuestions);
	};

	//	Error State
	const [error, setError] = useState('')

	//	Editor related states and functions
	const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft('').contentBlocks)));
	const editorRef = useRef(null);
	const [currentBlocks, setCurrentBlocks] = useState(0)
	const handleEditorChange = (state) => {
		try {
			if (currentBlocks !== 0 && currentBlocks !== state.blocks.length) {
				editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
			}
			setCurrentBlocks(state.blocks.length);

			setQuestionValue(questions[0].id, questions[0].slug, 'question', draftToHtml(convertToRaw(editorState.getCurrentContent())));
		} catch { }
	}

	//	Save handler
	function onSave() {
		let newQuestions = editQuestions.filter(x => x.question.trim());


		let newValues = values.map(v => v);

		const min = Math.min.apply(null, values.map(value => value.id));
		let newid = min - 1;
		//	-9 ~ 0 is reserved
		if (newid > -10) newid = -10;

		for (let i = 0; i < newQuestions.length; i++) {
			let newQuestion = newQuestions[i];
			//	Validation check
			if (newQuestion.question.trim() === '' && newQuestion.type !== QUESTION_TYPE.INFORMATION && newQuestion.type !== QUESTION_TYPE.AGREEMENT) {
				setError('Question is required')
				return
			} else if ([QUESTION_TYPE.DROPDOWN
				, QUESTION_TYPE.CHECKBOX
				, QUESTION_TYPE.MULTIPLECHOICES].includes(newQuestion.type)
				&& newQuestion.options.length && newQuestion.options[0].label.trim() === '' && !newQuestion.default_question) {
				setError('Options are required')
				return
			}

			let parent_index=-100;
			newValues.map((i, index) => {
				if(i.slug == newQuestion.additional_question){
					parent_index = index;
				}
			});
			
			//	Generate new object from the edited information
			const item: ApplicationQuestion = {
				id: newQuestion.id,
				order: newQuestion?.order || newValues.length + 1,
				// order: newQuestion?.order || newValues.length + 1,
				question: newQuestion.type === QUESTION_TYPE.INFORMATION
					|| newQuestion.type === QUESTION_TYPE.AGREEMENT
					? draftToHtml(convertToRaw(editorState.getCurrentContent()))
					: newQuestion.question,
				type: newQuestion.type,
				options: newQuestion.options.filter((v) => v.label.trim()),
				required: newQuestion.required,
				default_question: newQuestion.default_question,
				validation: newQuestion.validation,
				student_question: newQuestion.student_question,
				slug: newQuestion.slug || `meta_${+ new Date()}`,
				additional_question: newQuestion.additional_question,
				response: '',
			};

			let id = newQuestion.id;

			if (id === undefined) {	//	Insert case
				//	Generate new id
				item.id = newid--;
				if(parent_index != -100){
					newValues.splice(parent_index + 1, 0, item);
				}else{
					newValues.push(item);
				}
			}
			else {									//	Update case
				newValues = newValues.map((v) => (v.id === newQuestion.id ? item : v));
			}
		}

		newValues = newValues.filter((i) => deleteIds.find(x => x == i.id) == null);
		setValues(newValues);
		onClose(true);
	}

	const [clickedEvent, setClickedEvent] = useState({})  
  const [warningPopup, setWarningPopup] = useState(false)
  const [ableToEdit, setAbleToEdit] = useState(false)

  const setCancelWarningPopup = () => {
    setWarningPopup(false);   
    setAbleToEdit(false);
  }

  const setConfirmWarningPopup = () => {
    setWarningPopup(false);    
    setAbleToEdit(true);
  }

  useEffect(() => {
    if (ableToEdit == true)
      clickedEvent.target.focus()
  }, [ableToEdit])

  const setFocused = (event) => {    
    console.log('focused');
    if (!isDefaultQuestion)
      return;

    if (!ableToEdit || clickedEvent.target != event.target) {
      event.preventDefault();
      event.target.blur();
      setClickedEvent(event)
      setWarningPopup(true);
    }
  }

  const setBlured = (event) => {
    setAbleToEdit(false);
  }

	return (
		<>
		<Modal open={true} aria-labelledby='child-modal-title' aria-describedby='child-modal-description'>
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: '800px',
					maxHeight: '97vh',
					overflowY: 'auto',
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
					<Button sx={styles.cancelButton} onClick={() => onClose(false)}>
						Cancel
					</Button>
					<Button sx={styles.actionButtons} onClick={() => onSave()}>
						Save
					</Button>
				</Box>
				<Box
					sx = {{
						maxHeight: 'calc(100vh - 200px)',
						overflowY: 'auto',
						padding: '8px',
						marginTop: '10px'						
					}}
				>
				{editQuestions.map((newQuestion, i) => (
					<Box
						key={i}>
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
									visibility: (newQuestion.type === QUESTION_TYPE.INFORMATION
										|| newQuestion.type == QUESTION_TYPE.AGREEMENT)
										? 'hidden' : 'visible',
									minWidth: '400px',
									[`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
									{
										borderColor: SYSTEM_07,
									},
								}}
								label='Question'
								variant='outlined'
								value={newQuestion.question}
								onChange={(v) => {
									setQuestionValue(newQuestion.id, newQuestion.slug, 'question', v.currentTarget.value);
								}}
								onFocus={(v) => {
									if (i == 0)
									  setFocused(v)
								}}
								onBlur={(v) => {
								if (i == 0)
									setBlured(v)
								}}
								focused
								// disabled={newQuestion.default_question}
							/>
							<DropDown
								sx={{
									pointerEvents: newQuestion.default_question ? 'none' : 'unset',
									minWidth: '200px',
									[`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
									{
										borderColor: SYSTEM_07,
									},
									marginRight: '50px'
								}}
								labelTop
								dropDownItems={i == 0 ? questionTypes : additionalQuestionTypes}
								placeholder='Type'
								defaultValue={newQuestion.type}
								// @ts-ignore
								setParentValue={(v) => {
									setQuestionValue(newQuestion.id, newQuestion.slug, 'type', +v);
								}}
								size='small'
							/>
						</Box>
						<Box mt='30px' width='100%' display='flex' flexDirection='column'>
							{newQuestion.type === QUESTION_TYPE.TEXTFIELD
								|| newQuestion.type === QUESTION_TYPE.CALENDAR ? (
								<Box height='50px' />
							) : newQuestion.type === QUESTION_TYPE.INFORMATION || newQuestion.type === QUESTION_TYPE.AGREEMENT ? (
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
								(
									<QuestionOptions
										options={newQuestion.options}
										setOptions={(options) => setQuestionValue(newQuestion.id, newQuestion.slug, 'options', options)}
										type={newQuestion.type} 
										setFocused={i == 0 ? setFocused : setBlured} setBlured={setBlured} isDefault={i == 0 ? isDefaultQuestion : false}
										/>
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
							<Box sx={{ display: 'flex', alignItems: 'center', visibility: newQuestion.type === QUESTION_TYPE.TEXTFIELD ? 'visible' : 'hidden' }}>
								<Checkbox checked={newQuestion.validation ? true : false} onClick={() => {
									setQuestionValue(newQuestion.id, newQuestion.slug, 'validation', newQuestion.validation ? 0 : 1);
								}} disabled={newQuestion.default_question && newQuestion.type !== QUESTION_TYPE.TEXTFIELD} />
								<Subtitle size='small'>Validation</Subtitle>
							</Box>
							<Box sx={{ display: 'flex', alignItems: 'center', }}>
								{newQuestion?.slug &&
									['packet_school_district', 'packet_secondary_contact_first', 'packet_secondary_contact_last', 'address_county_id', 'address_zip', 'address_city', 'address_street', 'program_year'].indexOf(newQuestion.slug) !== -1 ? (
									<Checkbox disabled />
								) : (
									<Checkbox checked={newQuestion.student_question} onClick={() => setQuestionValue(newQuestion.id, newQuestion.slug, 'student_question', newQuestion.student_question ? false : true)} />
								)}
								<Subtitle size='small'>Add Student Question</Subtitle>
							</Box>
							<Box sx={{ display: 'flex', alignItems: 'center', }}>
								<Checkbox checked={newQuestion.required ? true : false} onClick={() => {
									setQuestionValue(newQuestion.id, newQuestion.slug, 'required', newQuestion.required ? false : true);
								}} />
								<Subtitle size='small'>Required</Subtitle>
							</Box>
						</Box>
						<Box sx={{
							width: '100%',
							height: '40px',
							mt: '40px',
							alignItems: 'center',
							justifyContent: 'start',
							display: newQuestion.validation ? 'flex' : 'none',
						}}
						>
							<DropDown
								sx={{
									pointerEvents: newQuestion.default_question && newQuestion.type !== QUESTION_TYPE.TEXTFIELD ? 'none' : 'unset',
									minWidth: '200px',
									[`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
									{
										borderColor: SYSTEM_07,
									},
								}}
								labelTop
								dropDownItems={validationTypes}
								placeholder='Type'
								defaultValue={newQuestion.validation}
								// @ts-ignore
								setParentValue={(v) => {
									setQuestionValue(newQuestion.id, newQuestion.slug, 'validation', +v);
								}}
								size='small'
							/>
						</Box>
					</Box>))}
				</Box>
				{error && <Typography color='red'>{error}</Typography>}
			</Box>
		</Modal>
		{warningPopup && (
		<CustomModal
			title='Default Question'
			description='You are attempting to edit a default question. You may customize the way the question is asked, but the default ask of question will remain the same in the application. Are you sure you want to edit?'
			cancelStr='No'
			confirmStr='Yes'
			onClose={() => {
			setCancelWarningPopup()
			}}
			onConfirm={() => {
			setConfirmWarningPopup()
			}}
		/>
    )}
	</>
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
