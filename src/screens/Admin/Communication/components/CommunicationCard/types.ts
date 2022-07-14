import { FunctionComponent } from "react"

type CommunicationCardProps = {
	title: string,
	link: string,
	img: string,
}

export type CommunicationCardTemplateType = FunctionComponent<CommunicationCardProps>