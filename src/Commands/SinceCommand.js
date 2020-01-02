const BaseCommand = require('../Structure/BaseCommand');
const humanizeDuration = require('humanize-duration');

class Since extends BaseCommand {
	constructor(parent) {
		super({
			command: 'since',
			aliases: [],
			description: 'Gets the amount of time since you joined the server.',
			category: 'Information',
			usage: 'since',
			hidden: false
		});

		Object.assign(this, parent);

		this.handleMessageError = parent.handleMessageError;
	}

	execute(msg) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   You cannot use this command in a direct message.').catch(this.handleMessageError);
		msg.channel.createMessage(humanizeDuration(Date.now() - msg.member.joinedAt, { round: true })).catch(this.handleMessageError);
	}
}

module.exports = Since;