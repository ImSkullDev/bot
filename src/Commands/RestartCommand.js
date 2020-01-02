const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Restart extends BaseCommand {
	constructor(parent) {
		super({
			command: 'restart',
			aliases: [
				'res'
			],
			description: 'Restarts the bot.',
			category: 'Developers',
			usage: 'restart',
			hidden: true,
			guildOnly: false
		});

		Object.assign(this, parent);

		this.handleMessageError = parent.handleMessageError;
	}

	execute(msg) {
		this.db.getUser(msg.author.id)
			.then(async (user) => {
				if (!user || !user.developer) return msg.channel.createMessage(':no_entry_sign:   **»**   You do not have permission to execute this command.').catch(this.handleMessageError);

				msg.channel.createMessage(':arrows_counterclockwise:   **»**   Restarting the PM2 process...').then(() => {
					process.exit();
				}).catch(this.handleMessageError);
			})
			.catch((error) => {
				handleDatabaseError(error, msg);
			});
	}
}

module.exports = Restart;
