import { gql } from '@apollo/client'

export const getQuickLinksByRegionQuery = gql`
	query GetQuickLinksByRegion($regionId: ID!) {
		getQuickLinksByRegion(regionId: $regionId) {
			id
			region_id
			title
			subtitle
			image_url
			type
	  	sequence
			reserved
	  	flag
		}
	}
`
