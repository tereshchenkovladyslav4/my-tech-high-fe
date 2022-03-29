import { Box, Typography } from '@mui/material';
import React from 'react';

import MainImage from '../../../../assets/icons/circle-icon/main.png';
import DotImage from '../../../../assets/icons/circle-icon/dot.png';
import Ellipse from '../../../../assets/icons/circle-icon/ellipse.png';
import EllipseBottom from '../../../../assets/icons/circle-icon/ellipse-bottom.png';



const CircleIcon: React.FC = () => {
    return (
        <Box sx={{ position: "relative" }}>
            <img src={MainImage} style={{ position: "relative" }} />
            <img src={Ellipse} style={{ position: "absolute", top: "49%", left: "0%", width: "100%", }} />
            <img src={EllipseBottom} style={{ position: "absolute", top: "279px", right: "0%", }} />
            <img src={DotImage} style={{ position: "absolute", top: "45%", left: "50%" }} />
            <img src={DotImage} style={{ position: "absolute", top: "48%", left: "53.4%" }} />
            <img src={DotImage} style={{ position: "absolute", top: "50%", left: "54.5%" }} />
        </Box>
    )
}

export { CircleIcon as default };

