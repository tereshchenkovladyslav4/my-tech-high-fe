import { FunctionComponent } from "react"

type ParentLinkCardProps = {
	title: string,
	link: string,
	img: string,
}

export type ParentLinkCardTemplateType = FunctionComponent<ParentLinkCardProps>