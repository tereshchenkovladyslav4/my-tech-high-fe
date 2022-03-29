import { Button, Stack } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle';
import { MTHBLUE } from '../../../../utils/constants';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import YearNode from './YearNode/YearNode';
import { useStyles } from '../styles';
import { map } from 'lodash'

const Years: React.FC = () => {
    const classes = useStyles;
    const [yearsData, setyearsData] = useState([
        {
            id: 1,
            label: "School Year",
            data: ["Open", "Select", " ", "Close", "Select"]
        },
        {
            id: 2,
            label: "Applications",
            data: ["Open", "Select", " ", "Close", "Select"]
        },
        {
            id: 3,
            label: "Mid-Year ",
            data: ["Select"]
        },
        {
            id: 4,
            label: "Schedule Builder",
            data: ["Open", "Select", " ", "Close", "Select"]
        },
        {
            id: 5,
            label: "Direct Orders",
            data: ["Tech", "Select", " ", "Custom-Built", "Select"]
        },
        {
            id: 6,
            label: "Reimbursement",
            data: ["Tech", "Select", " ", "Custom-Built", "Select"]
        },
        {
            id: 7,
            label: "2nd Semester Start",
            data: ["Select"]
        },
        {
            id: 8,
            label: "2nd Semester Schedule",
            data: ["Open", "Select", " ", "Close", "Select"]
        },
        {
            id: 9,
            label: "Intent to Re-enroll",
            data: ["Open", "Select", " ", "Close", "Select", "Withdraw", "No Response", "Select"]
        },
        {
            id: 10,
            label: "Learning Logs Close",
            data: ["Select"]
        },
    ]);

    const renderYearData = () => {
        return map(yearsData, node => (
            <YearNode title={node.label} data={node.data} />
        ))
    }
    return (
        <Box sx={classes.base}>
            <Box sx={{ position: "absolute", right: 20, top: "-10%" }}>
                <Button variant='contained' disableElevation sx={classes.submitButton}>
                    Save
                </Button>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
                <Subtitle size={12} fontWeight="600" color={MTHBLUE} >
                    2020 - 2021
                </Subtitle>
                <ExpandMoreIcon fontSize="small" />
            </Stack>
            <Box sx={{ mt: 1 }}>
                {renderYearData()}
            </Box>
        </Box>
    )
}

export { Years as default };
