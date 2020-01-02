const dateformat = require('dateformat');
const BaseCommand = require('../Structure/BaseCommand');
const resolveUser = require('../Util/resolveUser');

class BotInformation extends BaseCommand {
	constructor(parent) {
		super({
			command: 'bot-info',
			aliases: [
				'botinfo',
				'bot-information',
				'botinformation'
			],
			description: 'Gets detailed information about a bot on the site.',
			category: 'Bots',
			usage: 'bot-info <bot>',
			hidden: false,
			guildOnly: false
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

				const library = await this.db.getLibrary(bot.library);

				msg.channel.createMessage({
					embed: {
						title: 'Bot Information',
						color: this.embedColor,
						thumbnail: {
							url: 'https://botlist.space/avatar/' + bot.id + '.' + (bot.avatar && bot.avatar.startsWith('a_') ? 'gif' : 'png')
						},
						description: ':white_small_square: **Name**: ' + bot.username + '#' + bot.discriminator + '\n:white_small_square: **ID**: ' + bot.id + '\n:white_small_square: **Description**: ' + bot.short_description + '\n:white_small_square: **Server Count**: ' + (bot.server_count ? (bot.shards ? (bot.shards.length.toLocaleString() + ' shards, ' + bot.server_count.toLocaleString() + ' servers') : bot.server_count.toLocaleString()) : 'N/A') + '\n:white_small_square: **Owners**: ' + bot.owners.map((owner) => '<@' + owner + '>').join(', ') + '\n:white_small_square: **Library**: ' + library.name + '\n:white_small_square: **Prefix**: ' + bot.prefix + '\n:white_small_square: **Date Added**: ' + dateformat(bot.created_at, 'mm/dd/yyyy hh:MM:ss TT (HH:MM:ss)')
					}
				});
			})
			.catch(() => {
				msg.channel.createMessage(':exclamation:   **»**   Unable to find any bots by that query.').catch(this.handleMessageError);
			});
	}
}

module.exports = BotInformation;