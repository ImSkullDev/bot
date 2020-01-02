const Logger = require('../Util/Logger');
const Event = require('../Structure/Event');

class WarnEvent extends Event {
	constructor(parent) {
		super('warn');

		Object.assign(this, parent);
	}

	run(warning) {
		if (warning.toString().includes('Unhandled MESSAGE_CREATE type')) return;

		Logger.warn('Client emitted warnings:', warning);
	}
}

module.exports = WarnEvent;