const Job = require('../Structure/Job');

class PruneLowUptime extends Job {
	constructor(parent) {
		super('Prune Low Uptime', '@monthly');

		this.id = 0;

		Object.assign(this, parent);

		this.bots = [];
		this.index = 0;
		this.siteModerator = { username: 'botlist.space', discriminator: '8900' };

		this.handleDeletedBot = parent.handleDeletedBot;
		this.handleCertificationRemovedBot = parent.handleCertificationRemovedBot;
	}

	async execute() {
		this.index = 0;
		this.bots = [];

		const result = await this.db.getAllBotsWithUptime();

		this.bots.push(...result);

		this.index = 0;
		this.nextBot();
	}

	async nextBot() {
		if (this.index >= this.bots.length) return;

		const bot = this.bots[this.index];
		const uptime = bot.uptime.online / bot.uptime.total;

		bot.owners = await this.db.getUsers(bot.owners);

		await this.db.deleteUptime(bot.id);

		if (!bot || bot.created_at > Date.now() - (1000 * 60 * 60 * 24 * 31)) {
			this.index++;
			return this.nextBot();
		}

		if (bot.certified && uptime < 0.95 && uptime >= 0.85) {
			this.handleCertificationRemovedBot(this.siteModerator, bot, 'Bot uptime was lower than certification program required uptime of 95%, this bot\'s uptime was ' + (uptime * 100).toFixed(1) + '%');

			await this.db.updateBot(bot.id, { certified: false, vanity: bot.owners[0].donationTier > 1 ? bot.vanity : null, background: bot.owners[0].donationTier > 1 ? bot.background : null });

			this.index++;
			this.nextBot();
		} else if (uptime < 0.85) {
			this.handleDeletedBot(this.siteModerator, bot, 'Bot uptime was lower than 85%, this bot\'s uptime was ' + (uptime * 100).toFixed(1) + '%');

			await this.db.deleteBot(bot.id);

			this.index++;
			this.nextBot();
		} else {
			this.index++;
			this.nextBot();
		}
	}
}

module.exports = PruneLowUptime;