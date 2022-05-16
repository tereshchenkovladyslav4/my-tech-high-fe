
import React, {useContext, useEffect, useState} from 'react'
import { Grid, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { DropDown } from '../../../../../components/DropDown/DropDown'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { hispanicOptions, SYSTEM_01 } from '../../../../../utils/constants'
import { countries } from '../../../../../utils/countries'
import { Controller, useFormContext } from 'react-hook-form'
import { gql, useQuery } from '@apollo/client'
import { UserContext } from '../../../../../providers/UserContext/UserProvider'
import { EnrollmentQuestionTab } from '../../../SiteManagement/EnrollmentSetting/EnrollmentQuestions/types'
import PacketQuestionItem from './PacketQuestionItem'
import { PacketModalQuestionsContext } from '../providers'

export default function Info() {
    const questions = useContext(PacketModalQuestionsContext)

    return (
        <>
            {questions?.length > 0 && questions?.map((tab) => {
                return (
                    tab?.groups?.map((group) => 
                        <>
                            <Subtitle color={SYSTEM_01} size='small' fontWeight='700'>
                                {group?.group_name !== 'root' && group?.group_name}
                            </Subtitle>
                            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                {group?.questions?.map((item, index) => (
                                    item.display_admin && <PacketQuestionItem key={index} item={item}/>
                                ))}
                            </Grid>
                        </>
                    ))
            })}
        </>
    )
}
