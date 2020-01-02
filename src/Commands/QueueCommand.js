const BaseCommand = require('../Structure/BaseCommand');

class Queue extends BaseCommand {
	constructor(parent) {
		super({
			command: 'queue',
			aliases: [],
			description: 'Gets the amount of bots in the queue.',
			category: 'Information',
			usage: 'queue',
			hidden: false
		});

		Object.assign(this, parent);

		this.handleMessageError = parent.handleMessageError;
	}

	async execute(msg) {
		const queueSize = await this.db.getAllBotsUnpprovedCount();

		if (queueSize > 0) {
			msg.channel.createMessage(':crystal_ball:   **»**   There are currently ' + queueSize + ' bot' + (queueSize !== 1 ? 's' : '') + ' in the queue.');
		} else {
			msg.channel.createMessage(':crystal_ball:   **»**   There are currently no bots in the queue.');
		}
	}
}

module.exports = Queue;