const Job = require('../Structure/Job');

class UpdateUsers extends Job {
	constructor(parent) {
		super('Update Bots', '0 * * * *', true);

		this.id = 3;

		Object.assign(this, parent);

		this.users = [];
		this.index = 0;
	}

	async execute() {
		this.index = 0;
		this.users = [];

		const bots = await this.db.getAllBots();
		this.users.push(...bots);

		this.check();
	}

	async check() {
		if (this.index >= this.users.length) return;

		const user = this.client.users.get(this.users[this.index].id);

		if (user) {
			await this.db.updateBot(user.id, {
				username: user.username,
				discriminator: user.discriminator,
				avatar: user.avatar
			});

			if (user.avatar !== this.users[this.index].avatar) {
				this.redis.setAvatar(user.id, user.avatar);
			}
		}

		this.next();
	}

	next() {
		this.index++;

		setTimeout(() => this.check(), 100);
	}
}

module.exports = UpdateUsers;