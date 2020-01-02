const Event = require('../Structure/Event');

class PresenceUpdateEvent extends Event {
	constructor(parent) {
		super('presenceUpdate');

		Object.assign(this, parent);
	}

	run(member) {
		this.redis.setStatus(member.id, member.status || 'offline');
	}
}

module.exports = PresenceUpdateEvent;