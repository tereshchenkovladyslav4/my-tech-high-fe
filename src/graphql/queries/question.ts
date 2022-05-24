import { gql } from '@apollo/client'

export const getQuestionsByRegionQuery = gql`
	query QuestionsByRegion($regionId: ID!, $section: String!) {
		questionsByRegion(regionId: $regionId, section: $section) {
			id
			region_id
			section
			type
			sequence
			question
			options
			slug
			validation
			mainQuestion
			defaultQuestion
			additionalQuestion
			required
		}
	}
`
