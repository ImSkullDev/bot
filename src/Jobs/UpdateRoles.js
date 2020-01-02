const Job = require('../Structure/Job');

class UpdateRoles extends Job {
	constructor(parent) {
		super('Update Roles', '@daily');

		this.id = 2;

		Object.assign(this, parent);

		this.users = [];
		this.index = 0;

		this.updateBotRoles = parent.updateBotRoles;
		this.updateUserRoles = parent.updateUserRoles;
	}

	async execute() {
		this.index = 0;
		this.users = [];

		const users = await this.db.getAllUsers();
		let bots = await this.db.getAllBots();

		bots = bots.map((bot) => {
			bot.bot = true;

			return bot;
		});

		this.users.push(...users);
		this.users.push(...bots);

		this.check();
	}

	check() {
		if (this.index >= this.users.length) return;

		const user = this.users[this.index];

		this[user.bot ? 'updateBotRoles' : 'updateUserRoles'](user.id);

		this.index++;
		setTimeout(() => this.check(), 100);
	}
}

module.exports = UpdateRoles;