import { FunctionComponent } from 'react'


type YearNodeProps = {
    title: string;
    data?: any
}

export type YearNodeTemplateType = FunctionComponent<YearNodeProps>