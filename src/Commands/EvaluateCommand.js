const util = require('util');
const BaseCommand = require('../Structure/BaseCommand');
const uploadToHastebin = require('../Util/uploadToHastebin');
const formatArbitrary = require('../Util/formatArbitrary');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Evaluate extends BaseCommand {
	constructor(parent) {
		super({
			command: 'eval',
			aliases: [
				'run'
			],
			description: 'Runs JavaScript code within the process.',
			category: 'Developers',
			usage: 'eval <code...>',
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

				try {
					let result = await eval(args.join(' '));

					if (typeof result !== 'string') result = util.inspect(result);
					result = formatArbitrary(result);

					if (result.length > 1992) {
						uploadToHastebin(result)
							.then((url) => {
								msg.channel.createMessage(':outbox_tray:   **»**   ' + url).catch(this.handleMessageError);
							})
							.catch((error) => {
								msg.channel.createMessage(':exclamation:   **»**   Failed to upload result to hastebin. `' + error.message + '`').catch(this.handleMessageError);
							});
					} else {
						msg.channel.createMessage('```js\n' + result + '```').catch(this.handleMessageError);
					}
				} catch (e) {
					msg.channel.createMessage('```js\n' + e + '```').catch(this.handleMessageError);
				}
			})
			.catch((error) => {
				handleDatabaseError(error, msg);
			});
	}
}

module.exports = Evaluate;
