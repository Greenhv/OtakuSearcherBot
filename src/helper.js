require('cross-fetch/polyfill');
require('core-js/stable');
require('regenerator-runtime/runtime');

const axios = require('axios');
const searchMediaQuery = require('./searchMediaQuery');

const animeSeparators = ['<', '>'];
const mangaSeparators = ['[', ']'];
const mediaTypes = { anime: 'ANIME', manga: 'MANGA' };

const getName = (message, [startIndex, endIndex]) => message.substr(startIndex + 1, endIndex - startIndex - 1);

const getStatAndEndIndexes = (message, [firstSeparator, secondSeparator]) => {
	const startIndex = message.indexOf(firstSeparator);
	const endIndex = message.indexOf(secondSeparator, startIndex);

	return [startIndex, endIndex];
}

const getMedia = message => {
	const isAnime = message.indexOf('<') >= 0;
	const isManga = message.indexOf('[') >= 0;
	const mediaType = isAnime ? mediaTypes.anime : isManga ? mediaTypes.manga : '';
	const mediaSeparators = isAnime ? animeSeparators : isManga ? mangaSeparators : [];
	const mediaIndexes = mediaSeparators.length ? getStatAndEndIndexes(message, mediaSeparators) : [];
	const mediaName = mediaSeparators.length ? getName(message, mediaIndexes) : '';
	
	return mediaName ? { name: mediaName, type: mediaType } : null;
};

const sendMessage = async (media, client, chatId, res) => {
	try {
		const mediaData = await client.query({
			query: searchMediaQuery,
			variables: {
				name: media.name,
				type: media.type,
			},
		});
		const searchResult = mediaData.data.Media;
		const { title: { userPreferred }, siteUrl, averageScore, episodes, chapters } = searchResult;

		const message = `[${searchResult.title.userPreferred}](${siteUrl})
		*Episodes*: ${episodes || chapters} 
		*Score*: ${averageScore}/100
		`;

		await axios.post(
			`https://api.telegram.org/bot${process.env.TELEGRAM_KEY}/sendMessage`,
			{
				parse_mode: 'Markdown',
				chat_id: chatId,
				text: message,
			}
		);

		res.end('ok');
	} catch (e) {
		console.log('Error :', e);
		res.end('Error :' + e);
	}
};

module.exports = {
	getMedia,
	sendMessage,
};
