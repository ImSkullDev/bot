const config = require('../config');
const MessageHandler = require('../Structure/MessageHandler');

class MessageFilter extends MessageHandler {
	constructor(parent) {
		super(0);

		Object.assign(this, parent);
	}

	execute(msg, next) {
		if (!this.client.ready || !msg.author || msg.author.bot || config.dev) return;
		msg.prefix = config.bot.prefix;
		next();
	}
}

module.exports = MessageFilter;