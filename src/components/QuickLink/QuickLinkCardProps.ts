export enum QUICKLINK_TYPE {
	WITHDRAWAL = 0,
	WEBSITE_LINK,
	FORM,
	PDF_TO_SIGN
};

export interface QuickLink {
	id: number;
	region_id: number;
	title: string;
	subtitle: string;
	image_url: string;
	type: QUICKLINK_TYPE;
	sequence: number;
	reserved: string;
	flag: number;
}

export interface QuickLinkCardProps {
	item: QuickLink
	action: boolean
	onAction?: (evt_type: string) => void
	background?: string
}
