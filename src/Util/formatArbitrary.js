const config = require('../config');

module.exports = (data) => {
	data = data.replace(new RegExp(config.bot.token, 'g'), '-- SENSITIVE INFORMATION --');
	// data = data.replace(new RegExp(config.mongo.password, 'g'), '-- SENSITIVE INFORMATION --');
	// data = data.replace(new RegExp(config.mongo.host, 'g'), '-- SENSITIVE INFORMATION --');
	data = data.replace(new RegExp(config.redis.password, 'g'), '-- SENSITIVE INFORMATION --');

	return data;
};
