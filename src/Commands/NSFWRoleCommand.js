const BaseCommand = require('../Structure/BaseCommand');
const config = require('../config');

class Donate extends BaseCommand {
	constructor(parent) {
		super({
			command: 'nsfw',
			aliases: [
				'no-nsfw',
				'nsfw-role'
			],
			description: 'Toggles access to the NSFW channels in this server.',
			category: 'Information',
			usage: 'nsfw',
			hidden: false,
			guildOnly: true
		});

		Object.assign(this, parent);

		this.handleMessageError = parent.handleMessageError;
	}

	execute(msg) {
		if (msg.member.roles.includes(config.discord.roles.noNSFW)) {
			msg.member.removeRole(config.discord.roles.noNSFW)
				.then(() => {
					msg.channel.createMessage(':inbox_tray:   **»**  You now have access to all NSFW channels.').catch(this.handleMessageError);
				})
				.catch(() => {
					msg.channel.createMessage(':x:   **»**  Failed to remove the role from you.').catch(this.handleMessageError);
				});
		} else {
			msg.member.addRole(config.discord.roles.noNSFW)
				.then(() => {
					msg.channel.createMessage(':outbox_tray:   **»**  You no longer have access to any of the NSFW channels.').catch(this.handleMessageError);
				})
				.catch(() => {
					msg.channel.createMessage(':x:   **»**  Failed to add the role to you.').catch(this.handleMessageError);
				});
		}
	}
}

module.exports = Donate;