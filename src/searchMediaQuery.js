import gql from 'graphql-tag';

export default gql`
	query mediaSearchQuery($name: String!, $type: MediaType!) {
		Media(search: $name, type: $type) {
			title {
				userPreferred
			}
			siteUrl
			averageScore
			episodes
			chapters
		}
	}
`;
