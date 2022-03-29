import { Button, Stack } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle';
import { useStyles } from '../styles';
import SystemUpdateAltOutlinedIcon from '@mui/icons-material/SystemUpdateAltOutlined';
import TextField from '../../../../components/TextField/TextField';
import { DropDown } from '../../../../components/DropDown/DropDown';

const QuickLink: React.FC = () => {
    const classes = useStyles;
    const [title, setTitle] = useState("");
    const [type, setType] = useState(0);
    const [image, setImage] = useState(null);

    const typeArr = [
        {
            label: "Type 1",
            value: 1,
        },
        {
            label: "Type 2",
            value: 2,
        },
        {
            label: "Type 3",
            value: 3,
        },
    ]


    const handleFileInput = (e: any) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setImage({
                name: file.name,
                image: URL.createObjectURL(file),
                file: file
            });
        }
    }
    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            flex={1}
            sx={classes.base}
        >
            <input
                style={{ display: "none" }}
                id="uploadLinkImage"
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => handleFileInput(e)}
            />
            <label htmlFor="uploadLinkImage">
                {!image ?
                    <Stack sx={{ cursor: "pointer" }} direction="column" justifyContent={"center"} alignItems="center">
                        <SystemUpdateAltOutlinedIcon sx={{ transform: 'rotate(180deg)' }} fontSize="large" />
                        <Subtitle size={12} fontWeight="500" >
                            Upload Photo
                        </Subtitle>
                    </Stack>
                    :
                    <img src={image.image} width={314} height={266} style={{ borderTopRightRadius: 10, borderTopLeftRadius: 10, cursor: "pointer" }} />
                }
            </label>
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                width={"65%"}
                marginTop={3}
            >
                <TextField
                    label="Title"
                    placeholder="Entry"
                    fullWidth
                    value={title}
                    onChange={(value) => setTitle(value)}
                    style={classes.input}
                    sx={{ my: 2, width: "65%" }}
                />
                <DropDown
                    dropDownItems={typeArr}
                    placeholder='Type'
                    labelTop
                    setParentValue={(value) => {
                        setType(Number(value));
                    }}
                    size='small'
                    sx={{ my: 2, width: "65%" }}
                />
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
                >
                    Cancel
                </Button>
                <Button variant='contained' disableElevation sx={classes.submitButton}>
                    Save
                </Button>
            </Stack>
        </Stack >
    )

}
export { QuickLink as default };