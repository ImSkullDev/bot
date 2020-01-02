const Event = require('../Structure/Event');

class UserUpdateEvent extends Event {
	constructor(parent) {
		super('userUpdate');

		Object.assign(this, parent);
	}

	async run(user) {
		if (!user) return;

		this.redis.setAvatar(user.id, user.avatar || null);

		if (user.bot) return;

		const userDocument = await this.db.getUser(user.id);

		if (!userDocument) return;

		await this.db.updateUser(user.id, {
			username: user.username,
			discriminator: user.discriminator,
			avatar: user.avatar
		});
	}
}

module.exports = UserUpdateEvent;