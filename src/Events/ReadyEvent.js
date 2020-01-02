const Logger = require('../Util/Logger');
const config = require('../config');
const Event = require('../Structure/Event');

class ReadyEvent extends Event {
	constructor(parent) {
		super('ready');

		Object.assign(this, parent);
	}

	run() {
		Logger.info('Successfully logged in as ' + this.client.user.username + '.');

		this.client.editStatus('online', {
			name: 'with botlist.space',
			type: 0
		});

		this.client.guild = this.client.guilds.get(config.discord.guildID);
		this.client.siteLogs = this.client.guild.channels.get(config.discord.channels.siteLogs);
		this.client.upvoteLogs = this.client.guild.channels.get(config.discord.channels.upvoteLogs);

		this.redis.uploadAvatars();
		this.redis.uploadStatuses();

		this.uptimeTracker.start();

		for (let i = 0; i < this.jobs.length; i++) {
			if (this.jobs[i].autoStart) {
				this.jobs[i].execute();
			}
		}
	}
}

module.exports = ReadyEvent;