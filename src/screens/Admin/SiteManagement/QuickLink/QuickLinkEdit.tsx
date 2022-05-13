import { Avatar, Button, Stack, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useStyles } from '../styles';
import { DropDown } from '../../../../components/DropDown/DropDown';
import { QuickLink, QUICKLINK_TYPE } from '../../../../components/QuickLinkCard/QuickLinkCardProps';
import { useFormik } from 'formik';
import * as yup from 'yup'
import { DocumentUploadModal } from '../EnrollmentSetting/EnrollmentQuestions/Documents/components/DocumentUploadModal/DocumentUploadModal';
import { createQuickLinkMutation, updateQuickLinkMutation } from '../../../../graphql/mutation/quick-link';
import { useMutation } from '@apollo/client';
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'

const QuickLinkEdit: React.FC<{quickLink: QuickLink, updateQuickLinks: (quickLink: QuickLink) => void, backAction: () => void, moveToReserved: (quickLink: QuickLink) => void}> = ({quickLink, updateQuickLinks, backAction, moveToReserved}) => {
    const classes = useStyles;

    const typeArr = [
        {
            label: "Website Link",
            value: QUICKLINK_TYPE.WEBSITE_LINK,
        },
        {
            label: "Form",
            value: QUICKLINK_TYPE.FORM,
        },
        {
            label: "PDF to Sign",
            value: QUICKLINK_TYPE.PDF_TO_SIGN,
        },
    ];

    const [submitCreate, {data: createData}] = useMutation(createQuickLinkMutation);
    const [submitUpdate, {data: updateData}] = useMutation(updateQuickLinkMutation);

    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [file, setFile] = useState<undefined | File>();
    const [image, setImage] = useState('');

    const onSave = () => {
        if(file) {
            var bodyFormData = new FormData()
            bodyFormData.append('file', file[0]);
            bodyFormData.append('region', 'UT');
            bodyFormData.append('year', '2022');

            return fetch(import.meta.env.SNOWPACK_PUBLIC_S3_UPLOAD, {
                method: 'POST',
                body: bodyFormData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('JWT')}`
                }
            }).then(async(res) => {
                return res.json()
                    .then(({data}) => {
                        handleSubmit(data);
                    }).catch(err => {
                        onSubmitFailed(err);
                    });
            }).catch(err => {
                onSubmitFailed(err);
            })
        } else {
            handleSubmit(null);
        }
    }

    const onSubmitSuccess = (id: number) => {
        //  Update the quick links of the home page
        quickLink = {
            ...quickLink,
            id: id,
            title: formik.values.title,
            subtitle: formik.values.subtitle,
            type: formik.values.type,
            image_url: formik.values.image_url,
            reserved: quickLink.reserved
        };
        updateQuickLinks(quickLink);

        switch(quickLink.type) {
        case QUICKLINK_TYPE.WITHDRAWAL:
            backAction();
            break;
        case QUICKLINK_TYPE.WEBSITE_LINK:
        case QUICKLINK_TYPE.FORM:
        case QUICKLINK_TYPE.PDF_TO_SIGN:
            moveToReserved(quickLink);
        default:
            break;
        }
    };

    const onSubmitFailed = (err) => {
        console.log(err);
    };

    const onRemovePhoto = () => {
        setFile(undefined);
        setImage('');
    }

    const validationSchema = yup.object({
        title: yup
            .string()
            .required('Title is required.')
            .nullable(),
        subtitle: yup
            .string()
            .nullable(),
        type: yup
            .number()
            .nullable()
    })

    const formik = useFormik({
        initialValues: {
            title: quickLink.id == 0 ? '' : quickLink.title,
            subtitle: quickLink.id == 0 ? '' : quickLink.subtitle,
            type: quickLink.type || typeArr[0].value,
            image_url: quickLink.image_url
        },
        validationSchema: validationSchema,
        onSubmit: async() => {
            await onSave();
        }
    });

    const convertToBlob = (file) => {
        const fileUrl = URL.createObjectURL(file[0]);
        return fileUrl;
    }

    const handleSubmit = (img: any) => {
        if(quickLink.id == 0) {
            submitCreate({
                variables: {
                    quickLinkInput: {
                        quickLink: {
                            ...quickLink,
                            title: formik.values.title,
                            subtitle: formik.values.subtitle,
                            type: formik.values.type,
                            image_url: img ? img.key : quickLink.image_url
                        }
                    }
                }
            }).then(async({data}) => {
                if(img) formik.values.image_url = img.key;
                onSubmitSuccess(data.createQuickLink.id);
            }).catch(err => {
                onSubmitFailed(err?.message);
            })
        }
        else {
            submitUpdate({
                variables: {
                    quickLinkInput: {
                        quickLink: {
                            ...quickLink,
                            title: formik.values.title,
                            subtitle: formik.values.subtitle,
                            type: formik.values.type,
                            image_url: img ? img.key : quickLink.image_url
                        }
                    }
                }
            }).then(async(res) => {
                if(img) formik.values.image_url = img.key;
                onSubmitSuccess(quickLink.id);
            }).catch(err => {
                onSubmitFailed(err?.message);
            })
        }
    }

    useEffect(() => {
        const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/';
        setImage(file ? convertToBlob(file) : (formik.values.image_url ? s3URL + formik.values.image_url : ''));
    }, [file, formik.values.image_url]);

    const Image = () => (
        <Box display='flex' flexDirection='column' justifyContent={'center'} sx={{ height: 167, width: 167 }} marginTop={3}>
            {image != '' ? (
                <>
                    <Avatar
                        src={image}
                        variant='square'
                        sx={{ height: '100%', width: '100%'}}
                    />
                    <Box onClick={onRemovePhoto} sx={{ cursor: 'pointer' }}>
                        <Paragraph size='medium' fontWeight='500' textAlign='center' color='#4145FF'>
                            Remove Profile Picture
                        </Paragraph>
                    </Box>
                </>
            ) : (
                <Box
                    display='flex'
                    flexDirection='column'
                    justifyContent={'center'}
                    sx={{ backgroundColor: '#FAFAFA', alignItems: 'center', cursor: 'pointer', height: '100%', width: '100%' }} onClick={() => setImageModalOpen(true)}
                >
                    <SystemUpdateAltIcon />
                    <Paragraph size='medium' fontWeight='500'>
                        Upload Photo
                    </Paragraph>
                </Box>
            )}
        </Box>
    )

    return (
    <form onSubmit={formik.handleSubmit} style={{height: '100%'}}>
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            flex={1}
            sx={classes.base}
        >
            <Box
                display='flex'
                flexDirection='row'
                justifyContent={'left'}
                marginTop={2}
                sx={{ alignItems: 'left', height: '100%', width: '100%' }}
            >
                <Typography sx={{ fontWeight: 700, fontSize: 20, ml: 1 }}>{quickLink.id == 0 ? 'New Quick Link' : 'Edit Quick Link'}</Typography>
            </Box>
            {Image()}
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                width={"65%"}
                marginTop={3}
            >
                <TextField
                    name='title'
                    label="Title"
                    placeholder="Entry"
                    fullWidth
                    value={formik.values.title}
                    onChange={(e) => {
                        formik.handleChange(e);
                    }}
                    style={classes.input}
                    sx={{ my: 2, width: "65%" }}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                />
                <TextField
                    name='subtitle'
                    label="Subtitle"
                    placeholder="Entry"
                    fullWidth
                    value={formik.values.subtitle}
                    onChange={(e) => {
                        formik.handleChange(e);
                    }}
                    style={classes.input}
                    sx={{ my: 2, width: "65%" }}
                />
                {quickLink.type != QUICKLINK_TYPE.WITHDRAWAL &&
                    <DropDown
                        dropDownItems={typeArr}
                        placeholder='Type'
                        labelTop
                        setParentValue={(value) => {
                            formik.values.type = Number(value);
                        }}
                        size='small'
                        defaultValue={quickLink.type || typeArr[0].value}
                        sx={{ my: 2, width: "65%" }}
                    />
                }
            </Stack>
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={8}
                marginTop={3}
            >
                <Button
                    variant='contained'
                    color='secondary'
                    disableElevation
                    sx={classes.cancelButton}
                    onClick={backAction}
                >
                    Cancel
                </Button>
                <Button variant='contained' disableElevation sx={classes.submitButton} type='submit'>
                    Save
                </Button>
            </Stack>
            {imageModalOpen && (
                <DocumentUploadModal handleModem={() => setImageModalOpen(!imageModalOpen)} handleFile={(fileName: File) => setFile(fileName)} limit={1} />
            )}
        </Stack >
    </form>)
}
export { QuickLinkEdit as default };
