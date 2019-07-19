const express = require('express');
const bodyParser = require('body-parser');
const { ApolloClient } = require('apollo-client');
const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { onError } = require('apollo-link-error');
const { getMedia, sendMessage } = require('./helper');

const app = express();
const port = 3000;

const httpLink = createHttpLink({ uri: 'https://graphql.anilist.co' });
const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		graphQLErrors.map(({ message, locations, path }) =>
			console.error(
				`[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
					locations
				)}, Path: ${path}`
			)
		);
	}

	if (networkError) console.error(`[Network error]: ${networkError}`);
});
const link = errorLink.concat(httpLink);
const client = new ApolloClient({
	link,
	cache: new InMemoryCache(),
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

//This is the route the API will call
app.post('/new-message', async function(req, res) {
  const { message } = req.body

  if (!message || !message.text) {
    return res.end()
  }

	const media = getMedia(message.text); 

	if (!!media) {
		await sendMessage(media, client, message.chat.id, res);
	}

	return res.end()
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
