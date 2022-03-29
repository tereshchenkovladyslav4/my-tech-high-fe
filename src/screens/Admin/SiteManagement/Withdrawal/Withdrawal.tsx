import { Box, Button, Stack } from '@mui/material';
import React, { LegacyRef, useRef, useState } from 'react';
import SignaturePad from 'react-signature-pad-wrapper';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DehazeIcon from '@mui/icons-material/Dehaze'
import { DropDown } from '../../../../components/DropDown/DropDown';
import TextField from '../../../../components/TextField/TextField';
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle';
import CircleIcon from './CircleIcon';
import { useStyles } from '../styles';
import { RenderOptionTemplateType } from './types';


const WithDrawal: React.FC = () => {
    const classes = useStyles;
    const [student, setStudent] = useState<number>(0);
    const [reason, setReason] = useState<number>(0);
    const [effectiveWithdrawDate, setEffectiveWithdrawDate] = useState("");
    const [publicSchoolname, setPublicSchoolname] = useState("");
    const [schoolAddress, setSchoolAddress] = useState("");
    const signatureRef = useRef(null)

    const resetSignature = () => {
        if (signatureRef.current) {
            signatureRef.current.clear()
        }
    }
    const students = [
        {
            label: "Student 1",
            value: 1,
        },
        {
            label: "Student 2",
            value: 2,
        },
        {
            label: "Student 3",
            value: 3,
        },
    ]
    const reasonForWithdraw = [
        {
            label: "Reason 1",
            value: 1,
        },
        {
            label: "Reason 2",
            value: 2,
        },
        {
            label: "Reason 3",
            value: 3,
        },
    ]

    const RenderWithOptions: RenderOptionTemplateType = ({ top }) => {
        return (
            <Box sx={{ position: "absolute", right: "-25%", top: `${top || 40}%` }}>
                <Stack direction="row" alignItems={"center"} spacing={2}>
                    <DehazeIcon htmlColor="#A3A3A4" />
                    <EditIcon htmlColor="#A3A3A4" />
                    <DeleteForeverOutlinedIcon htmlColor="#A3A3A4" />
                </Stack>
            </Box>
        )
    }


    return (
        <Box sx={classes.base}>
            <Box sx={{ position: "absolute", right: 20, top: "-5%" }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}>
                    <Button
                        variant='contained'
                        color='secondary'
                        disableElevation
                        sx={classes.cancelButton}
                    >
                        Cancel
                    </Button>
                    <Button variant='contained' disableElevation sx={classes.submitButton}>
                        Submit
                    </Button>
                </Box>
            </Box>
            <CircleIcon />
            <Stack justifyContent="center" alignItems={"center"} direction="column" sx={{ width: "50%", margin: "auto", mt: 2 }}>
                <DropDown
                    dropDownItems={students}
                    placeholder='Student'
                    labelTop
                    setParentValue={(value) => {
                        setStudent(Number(value));
                    }}
                    size='small'
                    sx={{ width: "100%" }}
                />
                <Box position="relative" width="100%">
                    <DropDown
                        dropDownItems={reasonForWithdraw}
                        placeholder='Reason for Withdraw'
                        labelTop
                        setParentValue={(value) => {
                            setReason(Number(value));
                        }}
                        size='small'
                        sx={{ width: "100%", mt: 2 }}
                    />
                    <RenderWithOptions />
                </Box>
                <Box position="relative" width="100%">
                    <TextField
                        label="Effective Withdraw Date"
                        fullWidth
                        value={effectiveWithdrawDate}
                        onChange={(value) => setEffectiveWithdrawDate(value)}
                        style={classes.input}
                        sx={{ my: 2 }}
                    />
                    <RenderWithOptions />
                </Box>
                <Box position="relative" width="100%">
                    <TextField
                        label="New Public School Name"
                        fullWidth
                        value={publicSchoolname}
                        onChange={(value) => setPublicSchoolname(value)}
                        style={classes.input}
                        sx={{ my: 2 }}
                    />
                    <RenderWithOptions />
                </Box>
                <Box position="relative" width="100%">
                    <TextField
                        label="School Address"
                        fullWidth
                        value={schoolAddress}
                        onChange={(value) => setSchoolAddress(value)}
                        style={classes.input}
                        sx={{ my: 2 }}
                    />
                    <RenderWithOptions />
                </Box>
            </Stack>
            <Box sx={{ width: "55%", margin: "auto", mt: 2 }}>
                <Button variant='contained' sx={classes.button} >
                    <Subtitle size={12} >
                        + Add Question
                    </Subtitle>
                </Button>
            </Box>
            <Box sx={{ width: "50%", margin: "auto", mt: 2 }}>
                <Box position="relative" width="100%" sx={{ mt: 3 }}>
                    <Subtitle size={12} >
                        I (parent/guardian) verify my intent to withdraw my student:
                    </Subtitle>
                    <RenderWithOptions top={25} />
                </Box>
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
            <Box sx={{ width: "55%", margin: "auto", mt: 2 }}>
                <Button variant='contained' sx={classes.button} >
                    <Subtitle size={12} >
                        Submit Withdrawal Request
                    </Subtitle>
                </Button>
            </Box>
        </Box>
    )
}

export { WithDrawal as default };

