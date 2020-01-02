module.exports = (bot, query, guild, noGuessing) => {
	return new Promise((resolve, reject) => {
		if (/^\d+$/.test(query)) {
			const user = guild.members.get(query);
			if (user) return resolve(user);
		} else if (/^<@!?(\d+)>$/.test(query)) {
			const match = query.match(/^<@!?(\d+)>$/);
			const user = guild.members.get(match[1]);
			if (user) return resolve(user);
		} else if (/^(.+)#(\d{4})$/.test(query)) {
			const match = query.match(/^(.+)#(\d{4})$/);
			const users = guild.members.filter((user) => user.user.username === match[1] && Number(user.user.discriminator) === Number(match[2]));
			if (users.length > 0) return resolve(users[0]);
		} else if (!noGuessing) {
			const users = guild.members.filter((user) => user.user.username.toLowerCase().includes(query.toLowerCase()));
			if (users.length > 0) return resolve(users[0]);
		}
		reject();
	});
};