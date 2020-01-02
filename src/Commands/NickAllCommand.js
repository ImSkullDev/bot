const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Execute extends BaseCommand {
	constructor(parent) {
		super({
			command: 'nick-all',
			aliases: [
				'nick'
			],
			description: 'Nicknames everyone in the server.',
			category: 'Developers',
			usage: 'nick-all <"none" | nickname...>',
			hidden: true,
			guildOnly: false
		});

		Object.assign(this, parent);

		this.users = [];
		this.index = 0;
		this.nick = '';
		this.running = false;

		this.handleMessageError = parent.handleMessageError;
	}

	execute(msg, args) {
		this.db.getUser(msg.author.id)
			.then(async (user) => {
				if (!user || !user.developer) return msg.channel.createMessage(':no_entry_sign:   **»**   You do not have permission to execute this command.').catch(this.handleMessageError);

				if (args.length < 1) return msg.channel.createMessage(':no_entry_sign:   **»**   You must provide either `none` or a nickname.');

				if (this.running) return msg.channel.createMessage(':x:   **»**   The nick-all command is already running.');

				if (args[0].toLowerCase() === 'none') {
					this.nick = '';
				} else {
					this.nick = args.join(' ');
				}

				this.index = 0;
				this.users = [...msg.channel.guild.members.values()].filter((member) => this.nick === '' || this.nick !== member.nick);
				this.running = true;
				this.nextUser(msg);
			})
			.catch((error) => {
				handleDatabaseError(error, msg);
			});
	}

	nextUser(msg) {
		const member = this.users[this.index];

		if (member) {
			member.edit({ nick: this.nick })
				.then(() => {
					this.index++;
					setTimeout(() => this.nextUser(msg), 750);
				})
				.catch(() => {
					this.index++;
					setTimeout(() => this.nextUser(msg), 750);
				});
		} else {
			this.running = false;
			msg.channel.createMessage(':white_check_mark:   **»**   All done! <@' + msg.author.id + '>');
		}
	}
}

module.exports = Execute;