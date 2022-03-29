import { FunctionComponent } from "react"

type AdminEnrolmentCardProps = {
	title: string,
	link: string,
	img: string,
}

export type AdminEnrollmentCardTemplateType = FunctionComponent<AdminEnrolmentCardProps>