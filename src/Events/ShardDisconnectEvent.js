const Logger = require('../Util/Logger');
const Event = require('../Structure/Event');

class ShardDisconnectEvent extends Event {
	constructor(parent) {
		super('shardDisconnect');

		Object.assign(this, parent);
	}

	run(error, id) {
		Logger.info('Shard ' + id + ' disconnected: ' + error + '. Reconnecting..');
	}
}

module.exports = ShardDisconnectEvent;