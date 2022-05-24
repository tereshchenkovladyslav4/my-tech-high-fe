import { Alert, Box, Button, Card, Grid, IconButton, List, Stack, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle';
import CircleIcon from './CircleIcon';
import { useStyles } from '../styles';
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc';
import { defaultQuestions, Question, QUESTION_TYPE } from '../../../../components/QuestionItem/QuestionItemProps';
import QuestionItem from '../../../../components/QuestionItem/QuestionItem';
import { Formik, Form, Field } from 'formik';
import { useHistory } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { saveQuestionsMutation, deleteQuestionMutation } from '../../../../graphql/mutation/question';
import { getQuestionsByRegionQuery } from '../../../../graphql/queries/question';
import QuestionModal from '../../../../components/QuestionItem/AddNewQuestion';
import CustomConfirmModal from '../../../../components/CustomConfirmModal/CustomConfirmModal';
import SelectDefaultCustomQuestionModal from '../../../../components/QuestionItem/AddNewQuestion/SelectDefaultCustomQuestionModal';
import { QuickLink } from '../../../../components/QuickLink/QuickLinkCardProps'
import _ from 'lodash';
import DefaultQuestionModal from '../../../../components/QuestionItem/AddNewQuestion/DefaultQuestionModal';

//	Possible Question Types List
const QuestionTypes = [
	{
		value: QUESTION_TYPE.DROPDOWN,
		label: 'Drop Down',
	},
	{
		value: QUESTION_TYPE.TEXTFIELD,
		label: 'Text Field',
	},
	{
		value: QUESTION_TYPE.CHECKBOX,
		label: 'Checkbox',
	},
	{
		value: QUESTION_TYPE.AGREEMENT,
		label: 'Agreement',
	},
	{
		value: QUESTION_TYPE.MULTIPLECHOICES,
		label: 'Multiple Choices',
	},
	{
		value: QUESTION_TYPE.INFORMATION,
		label: 'Information',
	}
];
const AdditionalQuestionTypes = [
	{
		value: QUESTION_TYPE.DROPDOWN,
		label: 'Drop Down',
	},
	{
		value: QUESTION_TYPE.CHECKBOX,
		label: 'Checkbox',
	},
	{
		value: QUESTION_TYPE.MULTIPLECHOICES,
		label: 'Multiple Choices',
	}
];

const SortableItem = SortableElement(QuestionItem)

const SortableListContainer = SortableContainer(({ questionsList }: { questionsList: Question[][] }) => (
	<List sx={{width: '100%'}}>
	{questionsList.map((questions, index) => (
		<SortableItem index={index} key={index} questions={questions} questionTypes={QuestionTypes} additionalQuestionTypes={AdditionalQuestionTypes} />
	))}
	</List>
))

const WithDrawal: React.FC<
{
	quickLink: QuickLink
	, updateQuickLinks: (quickLink: QuickLink) => void
	, action: (page: string) => void
	, handleChange: (flag: boolean) => void
	, region: number
}
> = ({quickLink, updateQuickLinks, action, handleChange, region}) => {
	const classes = useStyles;
	
	//	questions state on the page
	const [questions, setQuestions] = useState<Question[]>([]);
	//	Flag State which indicates to show the Question Type Selection Modal (Choose between Default and Custom)
	const [openSelectQuestionType, setOpenSelectQuestionType] = useState(false);
	//	Flag State which indicates to show the leaving confirmation modal
	const [unSaveChangeModal, setUnSaveChangeModal] = useState(null);
	//	Flag State which indicates to show the cancel confirmation modal
	const [cancelModal, setCancelModal] = useState(false);
	//	Flag State which indicates Questions saved Success Message
	const [successAlert, setSuccessAlert] = useState(false);
	//	Flag State which indicates if the Form has values changed. true => Form has values changed. false => No
	const [unsavedChanges, setUnsavedChanges] = useState(false);

	//	Select Questions Query from the Database
	const {data: questionsData, refetch: refetchQuestionData} = useQuery(getQuestionsByRegionQuery, {
		variables: {regionId: region, section: 'quick-link-withdrawal'},
		fetchPolicy: 'network-only',
	});

	//	Insert(Update) Questions Mutation into the Database
	const [saveQuestions] = useMutation(saveQuestionsMutation);
	//	Delete Question Mutation from the Database
	const [deleteQuestion] = useMutation(deleteQuestionMutation);
	const [openAddQuestion, setOpenAddQuestion] = useState('');
	//	The Question Item which is currently editing
	const [currentQuestions, setCurrentQuestions] = useState([]);

	//	Read existing questions from the database and show, Initialize Unsaved flag state to false
	useEffect(() => {
		if(questionsData?.questionsByRegion) {
			if(questionsData.questionsByRegion.length == 0) {
				//  Initial questions
				setQuestions([
					{
						id: -1,
						region_id: region,
						section: 'quick-link-withdrawal',
						type: QUESTION_TYPE.DROPDOWN,
						sequence: 0,
						question: 'Student',
						options: [],
						mainQuestion: true,
						defaultQuestion: false,
						slug: 'student',
						validation: 0,
						required: true,
						additionalQuestion: '',
						response: ''
					},
					{
						id: -2,
						region_id: region,
						section: 'quick-link-withdrawal',
						type: QUESTION_TYPE.CALENDAR,
						sequence: 1,
						question: 'Effective Withdraw Date',
						options: [],
						mainQuestion: true,
						defaultQuestion: false,
						slug: 'effective_withdraw_date',
						validation: 0,
						required: true,
						additionalQuestion: '',
						response: ''
					},
					{
						id: -3,
						region_id: region,
						section: 'quick-link-withdrawal',
						type: QUESTION_TYPE.SIGNATURE,
						sequence: 3,
						question: 'Type full legal parent name and provide a Digital Signature below. Signature (use the mouse to sign)',
						options: [],
						mainQuestion: true,
						defaultQuestion: false,
						slug: 'signature',
						validation: 0,
						required: true,
						additionalQuestion: '',
						response: ''
					},
				]);
			}
			else {
				setQuestions(
					questionsData.questionsByRegion.map((v) => {
						return {
							...v,
							options: JSON.parse(v.options),
							mainQuestion: v.mainQuestion == 1 ? true : false,
							defaultQuestion: v.defaultQuestion == 1 ? true : false,
							required: v.required == 1 ? true : false,
							response: ''
						}
					})
				);
			}
			setUnsavedChanges(false);
		}
	}, [questionsData]);

	//	Check page leaving event
	const history = useHistory();
	useEffect(() => {
		window.onbeforeunload = (e) => {
			//	if there is no changes, just leave the page
			if(!unsavedChanges)	return;
			//	else prevent leaving
			e?.preventDefault();
			return 'Unsaved changes';	//	Legacy method for cross browser support
		};

		const unreg = history.block(() => {
			if(unsavedChanges) {
				return JSON.stringify({
					header: 'Unsaved Changes',
					content: 'Are you sure you want to leave without saving changes?'
				})
			}
			return
		});
		return () => {
			unreg()
			window.onbeforeunload = null
		}
	}, [history, unsavedChanges]);

	//	Remove Success Message after 5 seconds when showed
	useEffect(() => {
		if(successAlert) {
			setTimeout(() => setSuccessAlert(false), 5000);
		}
	}, [successAlert]);

	const onSelectDefaultQuestions = (selected) => {
		const question = defaultQuestions.find(x => x.question == selected);
		const newDefaultQuestion = {
			region_id: region,
			section: 'quick-link-withdrawal',
			type: question.type,
			sequence: 3,
			question: question.question,
			defaultQuestion: true,
			mainQuestion: false,
			validation: question.validation || 0,
			slug: question.slug,
			options: [],
			required: false,
			response: ''
		};
		setCurrentQuestions([newDefaultQuestion])
		setOpenAddQuestion('new');
	}

	return (
		<Grid
			sx={{
				padding: '1rem 2.5rem',
			}}
		>
			<Formik
				initialValues={questions.filter(x => !x.mainQuestion)}
				enableReinitialize={true}
				validate={(values) => {
					if (_.isEqual(values, questions) === unsavedChanges) {
						setUnsavedChanges(!unsavedChanges)
						handleChange(!unsavedChanges);
					}
				}}
				onSubmit={async (vals) => {
					let newquestions = vals.map((v) => v);
					questions.filter(x => !x.mainQuestion).forEach((q) => {
						if (!newquestions.find((v) => v.id === q.id)) {
							deleteQuestion({ variables: { questionId: q.id } })
						}
					});

					let begin = 0;
					questions.filter(x => x.mainQuestion).forEach(question => {
						if(question.type != QUESTION_TYPE.SIGNATURE) {
							newquestions.splice(begin, 0, question);
							begin++;
						}
						else {
							newquestions.push(question);
						}
					});
					for(let i = 0; i < newquestions.length; i++) {
						if(newquestions[i].id < 0)	newquestions[i].id = 0;
						newquestions[i].sequence = i + 1;
					}
					
					const {data} = await saveQuestions({
						variables: {
							questionsInput: newquestions.map((v) => {return {question: {
								id: Number(v.id),
								region_id: v.region_id,
								section: v.section,
								sequence: v.sequence,
								slug: v.slug,
								type: v.type,
								question: v.question,
								validation: v.validation,
								mainQuestion: v.mainQuestion ? 1 : 0,
								defaultQuestion: v.defaultQuestion ? 1 : 0,
								options: JSON.stringify(v.options),
								required: v.required ? 1 : 0,
								additionalQuestion: v.additionalQuestion
							}}}),
						},
					});
					if(data.saveQuestions) {
						refetchQuestionData();
						setSuccessAlert(true);
						setUnsavedChanges(false);
						handleChange(false);
					}
					else {
						console.error(data);
					}
				}}
			>
				{({ values, setValues }) => (
					<Form>
						<Box sx={classes.base}>
							<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%' }}>
								<Typography sx={{ fontWeight: 700, fontSize: 20, ml: 1 }}>Withdraw</Typography>
								<Button
										variant='contained'
										color='secondary'
										disableElevation
										sx={classes.cancelButton}
										onClick={() => {
											if(unsavedChanges)	setCancelModal(true);
											else								action('');
										}}
									>
									Cancel
								</Button>
								<Button variant='contained' disableElevation sx={classes.submitButton} type="submit">
									Save
								</Button>
							</Box>
							<CircleIcon />
							<Stack justifyContent="center" alignItems={"center"} direction="column" sx={{ width: "50%", margin: "auto", mt: 2, ml: 'calc(25% + 60px)' }}>
								<List sx={{width: '100%'}}>
									<QuestionItem questions={[questions[0]]} questionTypes={QuestionTypes} additionalQuestionTypes={AdditionalQuestionTypes} />
									<QuestionItem questions={[questions[1]]} questionTypes={QuestionTypes} additionalQuestionTypes={AdditionalQuestionTypes} />
								</List>
								<SortableListContainer
										questionsList={values.filter(v => v.additionalQuestion == '').map(v => {
											let arr = [v], current = v, child;
											while(child = values.find(x => x.additionalQuestion == current.slug)) {
												arr.push(child);
												current = child;
											}
											console.log(arr);
											return arr;
										})}
										useDragHandle={true}
										onSortEnd={({ oldIndex, newIndex }) => {
											const newData = arrayMove(values, oldIndex, newIndex).map((v, i) => ({
												...v,
												sequence: i + 1,
											}));
											setValues(newData)
										}}
									/>
								<List sx={{width: '100%', pt: 0}}>
									<QuestionItem questions={[questions[questions.length - 1]]} questionTypes={QuestionTypes} additionalQuestionTypes={AdditionalQuestionTypes} />
								</List>
							</Stack>
							<Box sx={{ width: "55%", margin: "auto", mt: 2 }}>
								<Button variant='contained' sx={{...classes.button, width: '100%'}} onClick={() => setOpenSelectQuestionType(true)}>
									<Subtitle size={12} >
										+ Add Question
									</Subtitle>
								</Button>
							</Box>
							<Box sx={{ width: "55%", margin: "auto", mt: 2 }}>
								<Button variant='contained' sx={{...classes.button, width: '100%'}} >
									<Subtitle size={12} >
										Submit Withdrawal Request
									</Subtitle>
								</Button>
							</Box>
						</Box>
						{openAddQuestion === 'new' &&
							<QuestionModal onClose={() => setOpenAddQuestion('')} questions={currentQuestions} questionTypes={QuestionTypes} additionalQuestionTypes={AdditionalQuestionTypes} />}
						{openAddQuestion === 'default' &&
							<DefaultQuestionModal onClose={() => setOpenAddQuestion('')} onCreate={e => onSelectDefaultQuestions(e)} />}
						{openSelectQuestionType &&
							<SelectDefaultCustomQuestionModal
								onClose={() => setOpenSelectQuestionType(false)}
								onCreate={e => {
									setOpenAddQuestion(e);
									if(e === 'new') {
										//	Prototype of a question
										setCurrentQuestions([{
											region_id: region,
											section: 'quick-link-withdrawal',
											type: QUESTION_TYPE.TEXTFIELD,
											sequence: values.length,
											question: '',
											defaultQuestion: false,
											mainQuestion: false,
											additionalQuestion: '',
											validation: 0,
											slug: `meta_${+new Date()}`,
											options: [],
											required: false,
											response: ''
										}]);
									}
									setOpenSelectQuestionType(false);
								}} />}
						{unSaveChangeModal != null &&
							<CustomConfirmModal
								header='Unsaved Changes'
								content='Are you sure you want to leave without saving changes?'
								handleConfirmModalChange={(val: boolean, isOk: boolean) => {
									setUnSaveChangeModal(null);
									if(isOk) {
										setUnsavedChanges(false);
										handleChange(false);
										action('');
									}
								}}
							/>
						}
						{cancelModal &&
							<CustomConfirmModal
								header='Cancel Changes'
								content='Are you sure you want to cancel changes made?'
								handleConfirmModalChange={(val: boolean, isOk: boolean) => {
									setCancelModal(false);
									if(isOk) {
										setUnsavedChanges(false);
										handleChange(false);
										action('');
									}
								}}
							/>
						}
						{successAlert &&
							<Alert
								sx={{
									position: 'absolute',
									bottom: '25px',
									marginBottom: '15px',
									right: '0',
								}}
								onClose={() => setSuccessAlert(false)}
								severity='success'
								>Questions saved successfully.</Alert>
						}
					</Form>
				)}
			</Formik>
		</Grid>
	)
}

export { WithDrawal as default };

