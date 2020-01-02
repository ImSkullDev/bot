const snekfetch = require('snekfetch');
const dateformat = require('dateformat');
const formatSize = require('./formatSize');

module.exports = (message) => {
	return new Promise((resolve, reject) => {
		snekfetch.post('https://h.mayo.pw/documents').send('// ' + dateformat(Date.now(), 'mm/dd/yyyy hh:MM:ss TT') + '\n// ' + message.length + ' characters\n// ' + formatSize(message.length) + '\n\n' + message)
			.then((result) => {
				resolve('https://h.mayo.pw/' + result.body.key + '.js');
			})
			.catch((error) => {
				reject(error);
			});
	});
};