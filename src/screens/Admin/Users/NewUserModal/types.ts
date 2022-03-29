import { FunctionComponent } from "react"

type WarningModalProps = {
	title: string
	subtitle: string
	handleModem: () => void,
}

export type WarningModalTemplateType = FunctionComponent<WarningModalProps>

type NewModalProps = {
	visible: boolean,
	handleModem: () => void
}



export type NewModalTemplateType = FunctionComponent<NewModalProps>
