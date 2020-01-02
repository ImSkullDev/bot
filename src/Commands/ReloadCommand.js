const fs = require('fs').promises;
const util = require('util');
const path = require('path');
const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Reload extends BaseCommand {
	constructor(parent) {
		super({
			command: 'reload',
			aliases: [
				'rel'
			],
			description: 'Reloads a command from file.',
			category: 'Developers',
			usage: 'reload <command>|all',
			hidden: true,
			guildOnly: false
		});

		Object.assign(this, parent);

		this.handleMessageError = parent.handleMessageError;
	}

	async execute(msg, args) {
		const user = await this.db.getUser(msg.author.id);

		if (!user || !user.developer) return msg.channel.createMessage(':no_entry_sign:   **»**   You do not have permission to execute this command.').catch(this.handleMessageError);

		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a command name, or `all`.').catch(this.handleMessageError);

		if (args[0].toLowerCase() === 'all') {
			const files = await fs.readdir(__dirname);

			for (let i = 0; i < files.length; i++) {
				try {
					delete require.cache[path.join(__dirname, files[i])];

					const Command = require(path.join(__dirname, files[i]));
					const command = new Command(this);
					command.file = path.join(__dirname, files[i]);
					this.commands.delete(command.command);
					this.commands.set(command.command, command);

					if (i === files.length - 1) {
						msg.channel.createMessage(':arrows_counterclockwise:   **»**   Successfully reloaded ' + files.length + ' commands.').catch(this.handleMessageError);
					}
				} catch (e) {
					msg.channel.createMessage(':exclamation:   **»**   An error occured while trying to reload module.\n```js\n' + util.inspect(e) + '```').catch(this.handleMessageError);
				}
			}
		} else {
			const commands = this.commands.filter((command) => command.command.toLowerCase() === args[0].toLowerCase() || command.aliases.includes(args[0].toLowerCase()));

			if (commands.length < 1) return msg.channel.createMessage(':exclamation:   **»**   Unable to find any commands by that name.').catch(this.handleMessageError);

			try {
				delete require.cache[commands[0].file];

				const Command = require(commands[0].file);
				const command = new Command(this);
				command.file = commands[0].file;

				this.commands.delete(command.command);
				this.commands.set(command.command, command);

				msg.channel.createMessage(':arrows_counterclockwise:   **»**   Command `' + command.command + '` has been reloaded.').catch(this.handleMessageError);
			} catch (e) {
				msg.channel.createMessage(':exclamation:   **»**   An error occured while trying to reload command.\n```js\n' + util.inspect(e) + '```').catch(this.handleMessageError);
			}
		}
	}
}

module.exports = Reload;