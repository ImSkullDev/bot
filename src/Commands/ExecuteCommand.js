const child_process = require('child_process');
const BaseCommand = require('../Structure/BaseCommand');
const uploadToHastebin = require('../Util/uploadToHastebin');
const formatArbitrary = require('../Util/formatArbitrary');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Execute extends BaseCommand {
	constructor(parent) {
		super({
			command: 'exec',
			aliases: [
				'bash'
			],
			description: 'Executes command in the host console.',
			category: 'Developers',
			usage: 'exec <command...>',
			hidden: true,
			guildOnly: false
		});

		Object.assign(this, parent);

		this.handleMessageError = parent.handleMessageError;
	}

	execute(msg, args) {
		this.db.getUser(msg.author.id)
			.then(async (user) => {
				if (!user || !user.developer) return msg.channel.createMessage(':no_entry_sign:   **»**   You do not have permission to execute this command.').catch(this.handleMessageError);

				child_process.exec(args.join(' '), (error, stdout, stderr) => {
					const result = formatArbitrary(stderr || stdout);

					if (result.length > 1992) {
						uploadToHastebin(result).then((url) => {
							msg.channel.createMessage(':outbox_tray:   **»**   ' + url).catch(this.handleMessageError);
						}).catch((error) => {
							msg.channel.createMessage(':exclamation:   **»**   Failed to upload result to hastebin. `' + error.message + '`').catch(this.handleMessageError);
						});
					} else {
						msg.channel.createMessage('```bash\n' + result + '```').catch(this.handleMessageError);
					}
				});
			})
			.catch((error) => {
				handleDatabaseError(error, msg);
			});
	}
}

module.exports = Execute;