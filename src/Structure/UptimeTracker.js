class UptimeTracker {
	constructor(parent) {
		Object.assign(this, parent);

		this.users = [];
		this.index = 0;
		this.isRunning = false;
		this.findInterval = null;

		this.inServer = parent.inServer;
		this.getStatus = parent.getStatus;
	}

	start() {
		this.isRunning = true;

		this.findUsers();
		this.nextUser();

		this.findInterval = setInterval(() => {
			this.findUsers();
		}, 1000 * 5);
	}

	stop() {
		this.isRunning = false;
		clearInterval(this.findInterval);
	}

	async nextUser() {
		if (!this.isRunning) return;

		this.index = (this.index + 1) % this.users.length;

		const user = this.users[this.index];

		if (user) {
			user.status = this.getStatus(user.id) || 'offline';

			const uptime = await this.db.getUptime(user.id);

			const status = user.status !== 'offline' ? 1 : 0;

			if (uptime) {
				await this.db.updateUptime(user.id, { total: uptime.total + 1, online: uptime.online + status });
			} else {
				await this.db.insertUptime({ id: user.id, total: 1, online: status, startedAt: Date.now() });
			}
		}

		setTimeout(() => this.nextUser(), 200);
	}

	findUsers() {
		this.users = this.client.guild.members.filter((member) => member.bot);
	}
}

module.exports = UptimeTracker;