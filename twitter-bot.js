const Twit = require('twit');

require('dotenv').config();

/* Configure the Twitter API */
const Bot = new Twit({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET,
	timeout_ms: 60 * 1000,
});

var TWITTER_SEARCH_PHRASE = '#Santa_Maria';

console.log('Procurando twitadas...');

/* BotRetweet() : To retweet recent tweets with our query */
function BotRetweet() {
	const stream = Bot.stream('statuses/filter', {
		track: TWITTER_SEARCH_PHRASE,
		language: 'pt'
	});

	stream.on('tweet', tweet => {
		if(isReply(tweet)) {
			console.warn('Tweet is a retweet!');
		} else {
			Bot.post('statuses/retweet/:id', {
				id: tweet.id_str
			}, (error, response) => {
				if (error) {
					console.log('Bot não encontrou nada para retweet, : ' + error);
				} else {
					console.log('retweet executado : ' + response.text);
				}
			});
		}
	});
};

function isReply(tweet) {
	if ( tweet.retweeted_status
	  || tweet.in_reply_to_status_id
	  || tweet.in_reply_to_status_id_str
	  || tweet.in_reply_to_user_id
	  || tweet.in_reply_to_user_id_str
	  || tweet.in_reply_to_screen_name )
	  return true
  }

// Exports
module.exports = {
    Bot,
    BotRetweet,
    isReply,
}