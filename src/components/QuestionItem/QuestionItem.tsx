import { Box, Button, Checkbox, IconButton, outlinedInputClasses, Radio, TextField } from '@mui/material'
import { useFormikContext } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { Subtitle } from '../Typography/Subtitle/Subtitle'
import DehazeIcon from '@mui/icons-material/Dehaze'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EditIcon from '@mui/icons-material/Edit'
import { SortableHandle } from 'react-sortable-hoc'
import { Question, QUESTION_TYPE } from './QuestionItemProps'
import AddNewQuestionModal from './AddNewQuestion'
import { SYSTEM_05, SYSTEM_07 } from '../../utils/constants'
import { DropDown } from '../DropDown/DropDown'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import SignaturePad from 'react-signature-pad-wrapper';
import CustomConfirmModal from '../CustomConfirmModal/CustomConfirmModal'

const DragHandle = SortableHandle(() => (
	<IconButton>
		<DehazeIcon />
	</IconButton>
))

export default function QuestionItem({
	question,
}: {
	question?: Question
}) {
	//	Formik values context
	const { values, setValues } = useFormikContext<Question[]>();

	//	Flag State which indicates to show/hide Delete confirmation dialog
	const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
	//	Flag State which indicates to show/hide edit dialog
	const [showEditDialog, setShowEditDialog] = useState(false);

	return (
		<>
			<Box display='flex' mt='20px' alignItems='center' justifyContent='left'>
				<Box flex='1' paddingTop='10px' maxWidth={'80%'}>
					<Item question={question} />
				</Box>
				{!question?.mainQuestion && (
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
			{showEditDialog && <AddNewQuestionModal onClose={() => setShowEditDialog(false)} editItem={question} />}
			{showDeleteDialog && (
				<CustomConfirmModal
					header="Delete Question" 
					content="Are you sure you want to delete this question?"
					handleConfirmModalChange={(val: boolean, isOk: boolean) => {
						setShowDeleteDialog(false);
						if(isOk) {
							setValues(values.filter((i) => i.id !== question.id))
						}
					}}
				/>
			)}
		</>
	)
}
function Item({ question: q }: { question: Question }) {
	const isAdmin = true;
	const signature = useRef(null);

	if(isAdmin) {
		switch (q?.type) {
			case QUESTION_TYPE.DROPDOWN:
				return (
					<DropDown
						sx={{
							marginTop: '10px',
							maxWidth: '100%',
							borderColor: '',
							[`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
								borderColor: SYSTEM_07,
							},
						}}
						labelTop
						dropDownItems={q.options || []}
						placeholder={q.question}
						setParentValue={function (value: any, val: any): void {}}
						alternate={true}
						size='small'
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
							},
						}}
						InputLabelProps={{
							style: { color: SYSTEM_05 },
						}}
						label={q.question}
						variant='outlined'
						value={q.response}
						onChange={function(value: any): void {}}
						focused
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
								<Checkbox checked={o.value === +q.response} onClick={function(value: any): void {}} />
								<Subtitle size='small' sx={{wordWrap: 'break-word',maxWidth: '90%',textAlign: 'start',}}>{o.label}</Subtitle>
							</Box>
						))}
					</Box>
				);
			case QUESTION_TYPE.AGREEMENT:
				//console.log(q);
				return (
					<Box display='flex' alignItems='center'>
						<Checkbox
							checked={q.response === 'true'}
							onChange={function(e: any): void {}}
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
								<Radio checked={false} />
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
						onChange={function(e: any): void {}}
						focused
						type="date"
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
						<Box sx={{ height: 1, width: "100%", border: "1px solid #000", mb: 0.5 }} />
						<Button onClick={function(e: any): void {if(signature.current) {signature.current.clear();}}}>
								<Subtitle size={12} >
										Reset
								</Subtitle>
						</Button>
				</Box>
				);
			default:
				break;
		}
	} else {
		switch(q.type) {
			case QUESTION_TYPE.SIGNATURE:
				/*return (
					<Box sx={{ width: "50%", margin: "auto", mt: 2 }}>
						<TextField
								placeholder="Entry"
								fullWidth
								value={schoolAddress}
								onChange={(value) => setSchoolAddress(value)}
								style={{ p: 0, pb: 1, ...classes.input }}
								size="medium"
								sx={{ my: 2, background: "#fff" }}
						/>
						<Subtitle size={12} sx={{ px: 5 }}>
								Type full legal parent name and provide a Digital Signature below.
								Signature (use the mouse to sign)
						</Subtitle>
						<SignaturePad
								options={{ minWidth: 1, maxWidth: 1, }}
								width={500}
								height={100}
								ref={signatureRef}
						/>
						<Box sx={{ height: 1, width: "100%", border: "1px solid #000", mb: 0.5 }} />
						<Button onClick={resetSignature}>
								<Subtitle size={12} >
										Reset
								</Subtitle>
						</Button>
				</Box>
				);*/
			default:
				break;
		}
	}
	//const { values, errors, touched } = useFormikContext<Question[]>();

	//const index = values.find((i) => i.id === q.id)?.id;

	//function onChange(value: string) {
	//	console.log('onChange', value);
		// setValues(values.map((v) => (v.id === q.id ? { ...v, response: value } : v)))
	//}
	/*if (q.type === QUESTION_TYPE.DROPDOWN) {
		if(isAdmin) {
			return (
				<DropDown
					sx={{
						marginTop: '10px',
						maxWidth: '100%',
						borderColor: errors[index] ? 'red' : '',
						[`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
							borderColor: SYSTEM_07,
						},
					}}
					labelTop
					dropDownItems={q.options || []}
					placeholder={q.question}
					setParentValue={(v) => onChange(v as string)}
					alternate={true}
					size='small'
					error={{
						error: !!touched[index] && !!errors[index],
						errorMsg: !!touched[index] && !!errors[index] ? 'This field is required' : '',
					}}
				/>
			)
		}
	} else if (q.type === QUESTION_TYPE.TEXTFIELD) {
		return (
			<TextField
				size='small'
				sx={{
					marginTop: '10px',
					minWidth: '100%',
					maxWidth: '100%',
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
				onChange={(v) => onChange(v.currentTarget.value)}
				focused
				error={!!touched[index] && !!errors[index]}
				helperText={errors[index]}
			/>
		)
	} else if (q.type === QUESTION_TYPE.CHECKBOX) {
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
						<Checkbox checked={o.value === +q.response} onClick={() => onChange(o.value + '')} />
						<Subtitle size='small' sx={{wordWrap: 'break-word',maxWidth: '90%',textAlign: 'start',}}>{o.label}</Subtitle>
					</Box>
				))}
			</Box>
		)
	} else if (q.type === QUESTION_TYPE.AGREEMENT) {
		return (
			<Box display='flex' alignItems='center'>
				<Checkbox
					checked={q.response === 'true'}
					onChange={(e) => onChange(e.currentTarget.checked ? 'true' : 'false')}
				/>
				<Subtitle size='small' color={SYSTEM_05} sx={{wordWrap: 'break-word',maxWidth: '90%',textAlign: 'start',}}>
					{q.question}
				</Subtitle>
			</Box>
		)
	} else if (q.type === QUESTION_TYPE.MULTIPLECHOICES) {
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
						<Radio checked={false} />
						<Subtitle size='small' sx={{wordWrap: 'break-word', maxWidth: '90%', textAlign: 'start'}}>{o.label}</Subtitle>
					</Box>
				))}
			</Box>
		)
	}
	else if (q.type === QUESTION_TYPE.CALENDAR) {
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
				onChange={(v) => onChange(v.currentTarget.value)}
				focused
				type="date"
				error={!!touched[index] && !!errors[index]}
				helperText={errors[index]}
			/>
		)
	}
	else if (q.type === QUESTION_TYPE.INFORMATION) {
		return (
			<Paragraph size='large'>
					<p dangerouslySetInnerHTML={{ __html: q.question }}></p>
			</Paragraph>
		)
	}*/

	return null
}
