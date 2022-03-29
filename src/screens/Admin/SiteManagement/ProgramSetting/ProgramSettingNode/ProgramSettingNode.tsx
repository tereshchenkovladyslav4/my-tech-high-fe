import { Stack, Typography } from '@mui/material';
import { map } from 'lodash';
import React from 'react';
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle';
import { MTHBLUE } from '../../../../../utils/constants';
import { ProgramSettingTemplateType } from '../types';

const ProgramSetting: ProgramSettingTemplateType = ({ title, data }) => {
    return (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ my: 2 }}>
            <Subtitle size={16} fontWeight="600" textAlign="left" sx={{ minWidth: 180 }}  >
                {title}
            </Subtitle>
            <Typography>|</Typography>
            <Stack direction="row" sx={{ ml: 1.5 }} alignItems="center">
                {
                    map(data, d => (
                        <Subtitle color={MTHBLUE} size={16} fontWeight="600" textAlign="left" sx={{ mx: 1.2, minWidth: d === " " ? 15 : "auto" }}  >
                            {d}
                        </Subtitle>
                    ))
                }
            </Stack>
        </Stack>
    )
}

export { ProgramSetting as default };

