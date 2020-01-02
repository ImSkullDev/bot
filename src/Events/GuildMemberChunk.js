const Event = require('../Structure/Event');

class GuildMemberChunkEvent extends Event {
	constructor(parent) {
		super('guildMemberChunk');

		Object.assign(this, parent);
	}

	run(guild, members) {
		const avatars = {};

		members.forEach((member) => {
			avatars[member.id] = member.avatar || null;
		});

		this.redis.setAvatarMany(avatars);
	}
}

module.exports = GuildMemberChunkEvent;