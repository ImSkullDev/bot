const Event = require('../Structure/Event');

class GuildMemberAddEvent extends Event {
	constructor(parent) {
		super('guildMemberAdd');

		Object.assign(this, parent);
	}

	async run(guild, member) {
		if (member.bot) {
			const bot = await this.db.getBot(member.id);

			if (!bot) return;

			this.updateBotRoles(bot.id);

			bot.owners.forEach((id) => {
				this.updateUserRoles(id);
			});
		} else {
			this.updateUserRoles(member.id);
		}

		this.redis.setAvatar(member.id, member.avatar || null);
	}
}

module.exports = GuildMemberAddEvent;