const BaseCommand = require('../Structure/BaseCommand');

class Position extends BaseCommand {
	constructor(parent) {
		super({
			command: 'position',
			aliases: [
				'pos'
			],
			description: 'View the position of a bot in the queue.',
			category: 'Bots',
			usage: 'position <bot ID>',
			hidden: false,
			guildOnly: false
		});

		Object.assign(this, parent);

		this.handleMessageError = parent.handleMessageError;
	}

	async execute(msg, args) {
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a bot mention, bot ID or bot username.').catch(this.handleMessageError);

		const bot = await this.db.getBot(args[0]);

		if (!bot) return msg.channel.createMessage(':exclamation:   **»**   That bot is not listed on our website. Make sure that you use an ID instead of a mention.').catch(this.handleMessageError);

		if (bot.approved) return msg.channel.createMessage(':exclamation:   **»**   Bot ' + bot.username + '#' + bot.discriminator + ' has been approved, and is not in queue').catch(this.handleMessageError);

		const unapprovedBots = await this.db.getAllUnapprovedBots(bot.id);

		const position = unapprovedBots.indexOf(unapprovedBots.filter((boat) => boat.id === bot.id)[0]) + 1;

		const queueLength = await this.db.getAllBotsUnpprovedCount();

		msg.channel.createMessage(':white_check_mark:   **»**   Bot ' + bot.username + '#' + bot.discriminator + ' is currently bot ' + position + '/' + queueLength + ' in queue.').catch(this.handleMessageError);
	}
}

module.exports = Position;
