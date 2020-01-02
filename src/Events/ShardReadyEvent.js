const Logger = require('../Util/Logger');
const Event = require('../Structure/Event');

class ShardReadyEvent extends Event {
	constructor(parent) {
		super('shardReady');

		Object.assign(this, parent);
	}

	run(id) {
		Logger.info('Shard ' + id + ' successfully connected.');
	}
}

module.exports = ShardReadyEvent;