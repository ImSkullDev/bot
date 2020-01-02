const Event = require('../Structure/Event');
const Logger = require('../Util/Logger');

class ErrorEvent extends Event {
	constructor(parent) {
		super('error');

		Object.assign(this, parent);
	}

	run(...errors) {
		Logger.error('Client emitted errors:', ...errors);
	}
}

module.exports = ErrorEvent;