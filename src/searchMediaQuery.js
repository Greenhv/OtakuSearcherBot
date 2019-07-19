const gql = require('graphql-tag');

const query = gql`
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

module.exports = query;
