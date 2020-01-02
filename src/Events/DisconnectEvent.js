const Event = require('../Structure/Event');
const Logger = require('../Util/Logger');

class DisconnectEvent extends Event {
	constructor(parent) {
		super('disconnect');

		Object.assign(this, parent);
	}

	run(error) {
		Logger.error('Client disconnected: ' + error + '. Reconnecting...');
	}
}

module.exports = DisconnectEvent;