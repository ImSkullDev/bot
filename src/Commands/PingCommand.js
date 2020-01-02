const BaseCommand = require('../Structure/BaseCommand');

class Ping extends BaseCommand {
	constructor(parent) {
		super({
			command: 'ping',
			aliases: [],
			description: 'Check how long it takes to send a message.',
			category: 'Information',
			usage: 'ping',
			hidden: false,
			guildOnly: false
		});

		Object.assign(this, parent);

		this.handleMessageError = parent.handleMessageError;
	}

	execute(msg) {
		msg.channel.createMessage(':ping_pong:   **»**   Pinging...').then((m) => {
			m.edit(':ping_pong:   **»**   Pong! `' + (Date.now() - m.timestamp) + 'ms`').catch(this.handleMessageError);
		}).catch(this.handleMessageError);
	}
}

module.exports = Ping;