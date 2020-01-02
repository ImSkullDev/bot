const MessageHandler = require('../Structure/MessageHandler');
const Logger = require('../Util/Logger');

class CommandHandler extends MessageHandler {
	constructor(parent) {
		super(1);

		Object.assign(this, parent);
	}

	execute(msg, next) {
		if (!msg.content.startsWith(msg.prefix)) return next();

		const command = msg.content.split(' ')[0].replace(msg.prefix, '').toLowerCase();
		const commands = this.commands.filter((c) => c.command === command || c.aliases.includes(command));
		const args = msg.content.split(' ').slice(1);

		if (commands.length > 0) {
			if (!msg.channel.guild && (typeof commands[0].guildOnly === 'function' ? commands[0].guildOnly(msg, args) : commands[0].guildOnly)) return msg.channel.createMessage(':no_entry_sign:   **»**   This command cannot be used in a direct message.').catch(this.handleMessageError);

			try {
				commands[0].execute(msg, args);
			} catch (e) {
				msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.').catch(this.handleMessageError);
				Logger.error('Failed to run command.', e);
			}
		}
	}
}

module.exports = CommandHandler;