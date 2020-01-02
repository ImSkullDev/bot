const Job = require('../Structure/Job');

class UpdateUsers extends Job {
	constructor(parent) {
		super('Update Users', '@daily');

		this.id = 1;

		Object.assign(this, parent);

		this.users = [];
		this.index = 0;
	}

	async execute() {
		this.index = 0;
		this.users = [];

		const users = await this.db.getAllUsers();
		const bots = await this.db.getAllBots();

		this.users.push(...users);
		this.users.push(...bots);

		this.check();
	}

	async check() {
		if (this.index >= this.users.length) return;

		const user = this.client.users.get(this.users[this.index].id);

		if (user) {
			if (user.bot) {
				await this.db.updateBot(user.id, {
					username: user.username,
					discriminator: user.discriminator,
					avatar: user.avatar
				});

				if (user.avatar !== this.users[this.index].avatar) {
					this.redis.setAvatar(user.id, user.avatar);
				}
			} else {
				await this.db.updateUser(user.id, {
					username: user.username,
					discriminator: user.discriminator,
					avatar: user.avatar
				});

				if (user.avatar !== this.users[this.index].avatar) {
					this.redis.setAvatar(user.id, user.avatar);
				}
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