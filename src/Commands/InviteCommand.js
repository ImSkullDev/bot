const BaseCommand = require('../Structure/BaseCommand');

class Invite extends BaseCommand {
	constructor(parent) {
		super({
			command: 'invite',
			aliases: [
				'inv'
			],
			description: 'Get the invite to get botlist.space added to your server.',
			category: 'Information',
			usage: 'invite',
			hidden: false,
			guildOnly: false
		});

		Object.assign(this, parent);

		this.handleMessageError = parent.handleMessageError;
	}

	execute(msg) {
		msg.channel.createMessage(':inbox_tray:   **»**   You can\'t invite this bot because it is only for this server. You could instead invite the bot for serverlist.space to get your server listed there by using this link: <https://serverlist.space/bot>.').catch(this.handleMessageError);
	}
}

module.exports = Invite;