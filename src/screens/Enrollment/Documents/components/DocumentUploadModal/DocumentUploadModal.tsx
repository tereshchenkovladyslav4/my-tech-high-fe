import { Box, Button, Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { DocumentUploadModalTemplateType } from './types'
import { useStyles } from './styles'
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph';
import { SYSTEM_06 } from '../../../../../utils/constants';
import { DocumentListItem } from '../DocumentList/DocumentListItem';
import { filter, map, remove } from 'lodash';


interface HTMLInputEvent extends Event {
	target: HTMLInputElement & EventTarget & File;
}

export const DocumentUploadModal: DocumentUploadModalTemplateType = ({
	handleModem,
	handleFile,
	limit
}) => {
	const classes = useStyles
	
	const [selectedFiles, setSelectedFiles] = useState([])
	const [validFiles, setValidFiles] = useState<File[]>([])
	const [errorMessage, setErrorMessage] = useState('')

	useEffect(() => {
			let filteredArr = selectedFiles.reduce((acc, current) => {
					const x = acc.find(item => item.name === current.name);
					if (!x) {
						return acc.concat([current]);
					} else {
						return acc;
					}
			}, []);
			setValidFiles([...filteredArr]);
	}, [selectedFiles]);

	const preventDefault = (e: HTMLInputEvent) => {
			e.preventDefault();
	}

	const dragOver = (e:  HTMLInputEvent) => {
			preventDefault(e);
	}

	const dragEnter = (e: HTMLInputEvent) => {
			preventDefault(e);
	}

	const dragLeave = (e: HTMLInputEvent) => {
			preventDefault(e);
	}

	const fileDrop = (e: HTMLInputEvent) => {
			preventDefault(e);
			const files = e.dataTransfer.files;
			console.log(files)
			if (limit && files.length > limit) {
				setErrorMessage(`File submission limited to ${limit} files`);
			}else {
				handleFiles(files);
			}
	}

	const filesSelected = (e: any) => {
		handleFiles(e.target.files)
	}

	const handleFiles = (files: FileList[]) => {
			for(let i = 0; i < files.length; i++) {
					if (validateFile(files[i])) {
							setSelectedFiles(prevArray => [...prevArray, files[i]]);
					} else {
							files[i]['invalid'] = true;
							setErrorMessage('File is to large');
					}
			}
	}

	const validateFile = (file: File) => {
		console.log((file))
		// Get the size of the file by files.item(i).size.
			const validTypes = ['application/pdf', "image/png", "image/jpeg"]
			if(Math.round((file.size/1024)) > 25000){
				return false
			}
			if (validTypes.indexOf(file.type) === -1) {
					return false;
			}
			return true;
	}

	const submitAndClose = () =>  {
		handleFile(validFiles)
		handleModem()
	}

	const deleteFile = (file: File) => {
		setValidFiles(filter(validFiles, (validFile) => validFile !== file))
	}


	const renderFiles = () => map(validFiles, (file) =>	<Box>
		<DocumentListItem file={file as File} closeAction={deleteFile}/>
	</Box>
	)
	return (
		<Modal
			open={true}
			onClose={() => handleModem()}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={classes.modalCard}>
				<Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
					{ validFiles.length > 0
						&& 		<Box
						display='flex'
						flexDirection='column'
					>	
						<Paragraph 
							size='medium' 
							fontWeight='700'
						>
							Uploaded
						</Paragraph>
							{renderFiles()}
					</Box>
					}
				</Box>
				<Box
						display='flex' 
						flexDirection='column' 
						alignItems={'center'}
						onDragOver={dragOver}
						onDragEnter={dragEnter}
						onDragLeave={dragLeave}
						onDrop={fileDrop}
				>
					<UploadFileIcon/>
					<Paragraph 
						size='medium' 
						fontWeight='700'
						sx={classes.dragAndDropText}
					>
						Drag &amp; Drop to Upload
					</Paragraph>
					<Paragraph size='medium' color={SYSTEM_06}> Or</Paragraph>
					<Button 
						sx={classes.uploadButton }
						variant='contained'
					> 
						<label>
							<input 
								type="file"
								style={classes.input}
								onChange={filesSelected}
								multiple
								accept='application/pdf, image/png, image/jpeg'
							/>
							Browse Files
						</label>
					</Button>
					<Paragraph>{ validFiles.length === 0 &&  errorMessage }</Paragraph>
				</Box>
				<Box justifyContent={'space-between'} display='flex' flexDirection={'row'}>
					<Button 
						sx={classes.cancelButton}
						variant='contained'
						onClick={() => handleModem()}
					> 
						Cancel
					</Button>
					{ validFiles.length > 0
						&& <Button 
						sx={classes.finishButton}
						variant='contained'
						onClick={() => submitAndClose()}
						> 
							Finish
						</Button>
					}
				</Box>
			</Box>
		</Modal>
	)
}
