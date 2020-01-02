const Logger = require('../Util/Logger');

module.exports = (error, msg) => {
	Logger.error(error);
	if (msg) msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.').catch(this.handleMessageError);
};