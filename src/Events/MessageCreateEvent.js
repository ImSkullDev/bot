const Event = require('../Structure/Event');

class MessageCreateEvent extends Event {
	constructor(parent) {
		super('messageCreate');

		Object.assign(this, parent);
	}

	run(msg) {
		// if (process.env.NODE_ENV !== 'production') return;

		let index = -1;

		const next = () => {
			index++;
			if (this.messageHandlers.length === index) return;
			this.messageHandlers[index].execute(msg, next);
		};

		next();
	}
}

module.exports = MessageCreateEvent;