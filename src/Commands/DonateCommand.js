const BaseCommand = require('../Structure/BaseCommand');

class Donate extends BaseCommand {
	constructor(parent) {
		super({
			command: 'donate',
			aliases: [
				'patreon'
			],
			description: 'Gets the Patreon link to support the developers.',
			category: 'Information',
			usage: 'donate',
			hidden: false,
			guildOnly: false
		});

		Object.assign(this, parent);

		this.handleMessageError = parent.handleMessageError;
	}

	execute(msg) {
		msg.channel.createMessage(':dollar:   **»**  https://patreon.com/botlist.space').catch(this.handleMessageError);
	}
}

module.exports = Donate;