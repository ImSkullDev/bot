const BaseCommand = require('../Structure/BaseCommand');

const emotes = {
	Information: ':newspaper:',
	Bots: ':robot:'
};

class Help extends BaseCommand {
	constructor(parent) {
		super({
			command: 'help',
			aliases: [
				'cmds',
				'commands'
			],
			description: 'Gets a list of commands sent to your channel.',
			category: 'Information',
			usage: 'help',
			hidden: false
		});

		Object.assign(this, parent);

		this.handleMessageError = parent.handleMessageError;
	}

	execute(msg) {
		let help = '';
		const categories = {};

		this.commands.filter((command) => !command.hidden).forEach((command) => {
			if (!(command.category in categories)) categories[command.category] = [];

			categories[command.category].push(command.command);
		});

		for (const category in categories) {
			help += '\n\n' + (category in emotes ? emotes[category] : ':question:') + '   **' + category + '**:   ' + categories[category].map((command) => '`' + command + '`').join(', ');
		}

		msg.channel.createMessage({
			embed: {
				title: 'Command List',
				color: this.embedColor,
				description: 'To use any of the commands below, use `' + msg.prefix + '<command>`. For example, `' + msg.prefix + 'prefix`.' + help
			}
		});
	}
}

module.exports = Help;