import { Button, Stack } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle';
import { MTHBLUE } from '../../../../utils/constants';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ProgramSettingNode from './ProgramSettingNode/ProgramSettingNode';
import { useStyles } from '../styles';
import { map } from 'lodash'

const ProgramSetting: React.FC = () => {
    const classes = useStyles;
    const [yearsData, setyearsData] = useState([
        {
            id: 1,
            label: "State",
            data: ["Select"]
        },
        {
            id: 2,
            label: "State Logo",
            data: ["Upload"]
        },
        {
            id: 3,
            label: "Program",
            data: ["Select"]
        },
        {
            id: 4,
            label: "State Counties",
            data: ["Import"]
        },
        {
            id: 5,
            label: "School Districts",
            data: ["Import"]
        },
        {
            id: 6,
            label: "Grades",
            data: ["Select"]
        },
        {
            id: 7,
            label: "Birth Date Cut-off",
            data: ["mm/dd/yyyy"]
        },
        {
            id: 8,
            label: "Special Ed",
            data: ["Enabled"]
        },
        {
            id: 9,
            label: "Enrollment Packet",
            data: ["Enabled"]
        },
        {
            id: 10,
            label: "Schedules",
            data: ["Enabled", " ", "|", " ", "# of Periods", " ", "|", " ", "None Periods: 7"]
        },
        {
            id: 11,
            label: "Learning Logs",
            data: ["Enabled"]
        },
        {
            id: 12,
            label: "Reimbursements",
            data: ["Enabled", " ", "|", " ", "Custom-built", " ", "|", " ", "Technology Allowance"]
        },
    ]);

    const renderProgramSettingData = () => {
        return map(yearsData, node => (
            <ProgramSettingNode title={node.label} data={node.data} />
        ))
    }
    return (
        <Box sx={classes.base}>
            <Box sx={{ position: "absolute", right: 20, top: "-9%" }}>
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
                {renderProgramSettingData()}
            </Box>
        </Box>
    )
}

export { ProgramSetting as default };
