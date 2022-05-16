import { Grid } from '@mui/material'
import React from 'react'
import { Title } from '../../../../../components/Typography/Title/Title'
import GenderInfo from './GenderInfo'
import LanguagesInfo from './LanguagesInfo'
import OtherInfo from './OtherInfo'
import RaceInfo from './RaceInfo'
import SchoolInfo from './SchoolInfo'
import SecondaryContact from './SecondaryContact'
import VoluntaryIncomeInfo from './VoluntaryIncomeInfo'
import { SYSTEM_01 } from '../../../../../utils/constants'
import SignatureComp from './Signature'
import Info from './Info'

export default function EnrollmentPacketInfo() {
    return (
        <Grid container columnSpacing={5} maxWidth='100%'>
            <Grid item xs={12}>
                <Title color={SYSTEM_01} size='small' fontWeight='700'>
                    Packet Info
                </Title>
            </Grid>
            <Grid item xs={12}>
                <Info />
            </Grid>
            {/* <Grid item md={6} xs={12}>
                <SecondaryContact />
            </Grid>
            <Grid item md={6} xs={12}>
                <SchoolInfo />
                <VoluntaryIncomeInfo />
            </Grid>
            <Grid item md={6} xs={12}>
                <RaceInfo />
            </Grid>
            <Grid item md={6} xs={12}>
                <OtherInfo />
            </Grid>
            <Grid item md={6} xs={12}>
                <LanguagesInfo />
            </Grid> */}
            <Grid item md={6} xs={12}>
                <SignatureComp />
            </Grid>

        </Grid >

    )
}
