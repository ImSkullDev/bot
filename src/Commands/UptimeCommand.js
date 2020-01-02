const BaseCommand = require('../Structure/BaseCommand');
const resolveUser = require('../Util/resolveUser');

class Uptime extends BaseCommand {
	constructor(parent) {
		super({
			command: 'uptime',
			aliases: [],
			description: 'Check how long a bot has been online for.',
			category: 'Information',
			usage: 'uptime <bot>',
			hidden: false
		});

		Object.assign(this, parent);

		this.handleMessageError = parent.handleMessageError;
	}

	execute(msg, args) {
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a bot mention, bot ID or bot username.').catch(this.handleMessageError);

		resolveUser(this.client, args.join(' '))
			.then(async (user) => {
				if (!user.bot) return msg.channel.createMessage(':exclamation:   **»**   That user is not a bot.').catch(this.handleMessageError);

				const bot = await this.db.getBot(user.id);

				if (!bot) return msg.channel.createMessage(':exclamation:   **»**   Bot ' + user.username + '#' + user.discriminator + ' is not listed on the site.').catch(this.handleMessageError);

				const uptime = await this.db.getUptime(bot.id);

				if (uptime) {
					const online = (uptime.online / uptime.total) * 100;

					msg.channel.createMessage(':alarm_clock:   **»**   ' + bot.username + '#' + bot.discriminator + ' has been online for ' + online.toFixed(1) + '% of the time, and has been checked ' + uptime.total + ' times.');
				} else {
					msg.channel.createMessage(':exclamation:   **»**   I don\'t have any uptime information on this bot.');
				}
			})
			.catch(() => {
				msg.channel.createMessage(':exclamation:   **»**   Unable to find any bots by that query.').catch(this.handleMessageError);
			});
	}
}

module.exports = Uptime;