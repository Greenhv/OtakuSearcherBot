import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import 'regenerator-runtime/runtime';
import ApolloClient from 'apollo-boost';
import { getMedia, sendMessage } from './helper';

const app = express();
const port = 3000;
const client = new ApolloClient({ uri: 'https://graphql.anilist.co' });

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get('/', (req, res) => res.send('Hellow world'));

//This is the route the API will call
app.post('/new-message', function(req, res) {
  const { message } = req.body

  if (!message || !message.text) {
    return res.end()
  }

	const media = getMedia(message.text); 

	console.log(media);
	if (media) {
		sendMessage(media, client, message.chat.id, res);
	}

	return res.end()
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
