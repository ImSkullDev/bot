const Logger = require('../Util/Logger');
const Event = require('../Structure/Event');

class UnknownEvent extends Event {
	constructor(parent) {
		super('unknown');

		Object.assign(this, parent);
	}

	run(payload, shard) {
		/* if (['WEBHOOKS_UPDATE', 'GIFT_CODE_UPDATE'].some((event) => payload.t === event)) return;

		Logger.info('Shard  ' + shard + ' received an unknown payload:', payload); */
	}
}

module.exports = UnknownEvent;
