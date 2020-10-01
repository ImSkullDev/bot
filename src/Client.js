const Eris = require('eris');
const fs = require('fs').promises;
const path = require('path');
const Collection = require('./Structure/Collection');
const MessageCollector = require('./Structure/MessageCollector');
const config = require('./config');
const Logger = require('./Util/Logger');
const UptimeTracker = require('./Structure/UptimeTracker');
const Database = require('./Structure/Database');
const Redis = require('./Structure/Redis');

MessageCollector(Eris);

class Client {
	constructor(parent) {
		Object.assign(this, parent);

		this.client = new Eris(config.bot.token, config.bot.clientOptions);
		this.db = new Database(this);
		this.uptimeTracker = new UptimeTracker(this);
		this.redis = new Redis(this);

		this.redis.on('data', (data) => {
			if (!(data.function in this) || typeof this[data.function] !== 'function') return Logger.error('IPC asked to run \'' + data.function + '\' but it does not exist');

			this[data.function](...data.arguments);
		});

		this.setup();
	}

	setup() {
		this.embedColor = 3066993;
		this.commands = new Collection();
		this.messageHandlers = [];
		this.jobs = [];

		this.loadDatabase();
	}

	async loadDatabase() {
		await this.db.connect();

		this.loadCommands(path.join(__dirname, 'Commands'));
	}

	async loadCommands(dir) {
		const commands = await fs.readdir(dir);

		for (let i = 0; i < commands.length; i++) {
			const Command = require(path.join(dir, commands[i]));
			const command = new Command(this);
			command.file = path.join(dir, commands[i]);
			this.commands.set(command.command, command);

			if (i + 1 === commands.length) {
				Logger.info('Loaded ' + commands.length + ' commands.');

				this.loadEvents(path.join(__dirname, 'Events'));
			}
		}
	}

	async loadEvents(dir) {
		const events = await fs.readdir(dir);

		for (let i = 0; i < events.length; i++) {
			const Event = require(path.join(dir, events[i]));
			const event = new Event(this);

			this.client.on(event.event, event.run.bind(this));

			if (i + 1 === events.length) {
				Logger.info('Loaded ' + events.length + ' events.');

				this.loadMessageHandlers(path.join(__dirname, 'MessageHandlers'));
			}
		}
	}

	async loadMessageHandlers(dir) {
		const messageHandlers = await fs.readdir(dir);

		for (let i = 0; i < messageHandlers.length; i++) {
			const Handler = require(path.join(dir, messageHandlers[i]));
			this.messageHandlers.push(new Handler(this));

			if (i + 1 === messageHandlers.length) {
				this.messageHandlers = this.messageHandlers.sort((a, b) => {
					if (a.position > b.position) return 1;
					if (b.position > a.position) return -1;
					return 0;
				});

				Logger.info('Loaded ' + messageHandlers.length + ' message handlers.');

				this.loadJobs(path.join(__dirname, 'Jobs'));
			}
		}
	}

	async loadJobs(dir) {
		const jobs = await fs.readdir(dir);

		for (let i = 0; i < jobs.length; i++) {
			const Job = require(path.join(dir, jobs[i]));
			const job = new Job(this);
			this.jobs.push(job);

			if (i + 1 === jobs.length) {
				Logger.info('Loaded ' + jobs.length + ' jobs.');

				this.connect();
			}
		}
	}

	connect() {
		this.client.connect();
	}

	handleAddedBot(user, bot) {
		this.log('<:botAdded:484479891832569868> **' + user.username + '#' + user.discriminator + '** added bot **' + bot.username + '#' + bot.discriminator + ' (<@&' + config.discord.roles.staff + '>)**\n<https://botlist.space/bot/' + bot.id + '/>');
	}

	handleApprovedBot(user, bot) {
		this.updateBotRoles(bot.id);

		for (let i = 0; i < bot.owners.length; i++) {
			this.updateUserRoles(bot.owners[i]);
		}

		this.log('<:botApproved:484479891677380609> **' + user.username + '#' + user.discriminator + '** approved bot **' + bot.username + '#' + bot.discriminator + '**\n<https://botlist.space/bot/' + bot.id + '/>');
	}

	handleDeclinedBot(user, bot, reason) {
		this.client.guild.kickMember(bot.id, reason);
		this.log('<:botDeclined:484479892088684544> **' + user.username + '#' + user.discriminator + '** declined bot **' + bot.username + '#' + bot.discriminator + '**\n**Reason**: `' + reason.slice(0, 240).replace(/`/g, '\'') + '`');
	}

	handleEditedBot(user, bot) {
		this.log('<:botEdited:484479892226834433> **' + user.username + '#' + user.discriminator + '** edited bot **' + bot.username + '#' + bot.discriminator + '**\n<https://botlist.space/bot/' + bot.id + '/>');
	}

	handleDeletedBot(user, bot, reason) {
		this.client.guild.kickMember(bot.id, reason);

		bot.owners.forEach((ownerID) => {
			this.updateUserRoles(ownerID);
		});

		this.log('<:botDeleted:484479892071776256> **' + user.username + '#' + user.discriminator + '** deleted bot **' + bot.username + '#' + bot.discriminator + '**' + (reason && reason !== '' ? '\n**Reason**: `' + reason.replace(/`/g, '\'').slice(0, 240) + '`' : ''));
	}

	handleBannedUser(moderator, user, reason) {
		this.log('<:botDeleted:484479892071776256> **' + moderator.username + '#' + moderator.discriminator + '** banned user **' + user.username + '#' + user.discriminator + '**' + (reason && reason !== '' ? '\n**Reason**: `' + reason.replace(/`/g, '\'').slice(0, 240) + '`' : ''));
	}

	handleUnbannedUser(moderator, user) {
		this.log('<:botAdded:484479891832569868> **' + moderator.username + '#' + moderator.discriminator + '** unbanned user **' + user.username + '#' + user.discriminator + '**');
	}

	async handleCertificationAcceptedBot(moderator, bot) {
		this.log('<:botApproved:484479891677380609> **' + moderator.username + '#' + moderator.discriminator + '** accepted certification for bot **' + bot.username + '#' + bot.discriminator + '**');

		this.updateBotRoles(bot.id);

		bot.owners.forEach((owner) => {
			this.updateUserRoles(owner);

			const member = this.client.guild.members.get(owner);

			if (member) {
				member.user.getDMChannel().then((channel) => {
					channel.createMessage('Your certification requests for the bot `' + bot.username + '#' + bot.discriminator + '` has been accepted, and your bot is now certified. You will automatically receive your Certified Developer role in the support server, alongside some other perks.').catch(this.handleMessageError);
				});
			}
		});
	}

	async handleCertificationDeclinedBot(moderator, bot, reason) {
		this.log('<:botDeclined:484479892088684544> **' + moderator.username + '#' + moderator.discriminator + '** declined certification for bot **' + bot.username + '#' + bot.discriminator + '**' + (reason && reason !== '' ? '\n**Reason**: `' + reason.replace(/`/g, '\'').slice(0, 240) + '`' : ''));

		this.updateBotRoles(bot.id);

		bot.owners.forEach((ownerID) => {
			const member = this.client.guild.members.get(ownerID);

			this.updateUserRoles(ownerID);

			if (member) {
				member.user.getDMChannel().then((channel) => {
					channel.createMessage('Your certification requests for the bot `' + bot.username + '#' + bot.discriminator + '` has sadly been declined, meaning it did not follow the strict guidelines put in place for the certification program. If you have fixed these problems, you can re-submit when possible.').catch(this.handleMessageError);
				});
			}
		});
	}

	handleCertificationRemovedBot(moderator, bot, reason) {
		this.log('<:botDeleted:484479892071776256> **' + moderator.username + '#' + moderator.discriminator + '** removed certification from bot **' + bot.username + '#' + bot.discriminator + '**' + (reason && reason !== '' ? '\n**Reason**: `' + reason.replace(/`/g, '\'').slice(0, 240) + '`' : ''));
	}

	async handleBotTransferred(user, bot, newOwner) {
		this.log('<:botTransferred:540275364056924191> **' + user.username + '#' + user.discriminator + '** transferred bot **' + bot.username + '#' + bot.discriminator + '** to **' + newOwner.username + '#' + newOwner.discriminator + '**');

		const newBot = await this.db.getBot(bot.id);

		bot.owners.forEach((owner) => {
			this.updateUserRoles(owner);
		});

		newBot.owners.forEach((owner) => {
			this.updateUserRoles(owner);
		});
	}

	handleCertificationApplication(user, bot) {
		this.log('<:botAdded:484479891832569868> **' + user.username + '#' + user.discriminator + '** applied for certification on bot **' + bot.username + '#' + bot.discriminator + '** (<@&' + config.discord.roles.certificationTeam + '>)');
	}

	getStatus(id) {
		return this.inServer(id) ? this.client.guild.members.get(id).status : 'offline';
	}

	handleMessageError(error) {
		if ('code' in error && (error.code === 50006 || error.code === 50007 || error.code === 50013)) return;

		Logger.error(error);
	}

	getAvatar(userID) {
		return this.client.guild.members.has(userID) ? this.client.guild.members.get(userID).avatar : null;
	}

	async updateUserRoles(id) {
		const user = await this.db.getUser(id);
		if (!user) return;

		const bots = await this.db.getApprovedBotsByOwner(id);
		const servers = await this.db.getServersByOwner(id);

		const isCertified = bots.some((bot) => bot.certified) || servers.some((server) => server.certified);

		let updatedRoles = false;

		if (isCertified) {
			this.client.addGuildMemberRole(config.discord.guildID, id, config.discord.roles.certified, 'User owns a certified bot/server');

			updatedRoles = true;
		} else if (!isCertified) {
			this.client.removeGuildMemberRole(config.discord.guildID, id, config.discord.roles.certified, 'User does not have any certified bots/servers');

			updatedRoles = true;
		}

		if (bots.length > 0) {
			this.client.addGuildMemberRole(config.discord.guildID, id, config.discord.roles.botDeveloper, 'User owns a bot listed');

			updatedRoles = true;
		} else if (bots.length < 1) {
			this.client.removeGuildMemberRole(config.discord.guildID, id, config.discord.roles.botDeveloper, 'User does not own any listed bots');

			updatedRoles = true;
		}

		if (servers.length > 0) {
			this.client.addGuildMemberRole(config.discord.guildID, id, config.discord.roles.serverOwner, 'User owns a server listed');

			updatedRoles = true;
		} else if (servers.length < 1) {
			this.client.removeGuildMemberRole(config.discord.guildID, id, config.discord.roles.serverOwner, 'User does not own any listed servers');

			updatedRoles = true;
		}

		return updatedRoles;
	}

	async updateBotRoles(id) {
		const bot = await this.db.getBot(id);
		if (!bot) return false;

		let updatedRoles = false;

		if (bot.approved) {
			this.client.removeGuildMemberRole(config.discord.guildID, id, config.discord.roles.pendingVerification, 'Bot has been approved');

			updatedRoles = true;
		} else if (!bot.approved) {
			this.client.addGuildMemberRole(config.discord.guildID, id, config.discord.roles.pendingVerification, 'Bot has not been approved yet');

			updatedRoles = true;
		}

		if (bot.approved) {
			this.client.addGuildMemberRole(config.discord.guildID, id, config.discord.roles.bot, 'Bot has been approved');

			updatedRoles = true;
		} else if (!bot.approved) {
			this.client.removeGuildMemberRole(config.discord.guildID, id, config.discord.roles.bot, 'Bot has not been approved yet');

			updatedRoles = true;
		}

		if (bot.certified) {
			this.client.addGuildMemberRole(config.discord.guildID, id, config.discord.roles.certified, 'Bot has been certified');

			updatedRoles = true;
		} else if (!bot.certified) {
			this.client.removeGuildMemberRole(config.discord.guildID, id, config.discord.roles.certified, 'Bot is not certified');

			updatedRoles = true;
		}

		return updatedRoles;
	}

	inServer(id) {
		return this.client.guild.members.has(id);
	}

	log(message) {
		this.client.siteLogs.createMessage(message).catch(this.handleMessageError);
	}
}

module.exports = Client;
