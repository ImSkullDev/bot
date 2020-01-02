module.exports = (bot, query, guild) => {
	return new Promise((resolve, reject) => {
		if (/^\d+$/.test(query)) {
			const role = guild.roles.get(query);
			if (role) return resolve(role);
		} else if (/^<@&(\d+)>$/.test(query)) {
			const match = query.match(/^<@&(\d+)>$/);
			const role = guild.roles.get(match[1]);
			if (role) return resolve(role);
		} else {
			const roles = guild.roles.filter((role) => role.name.toLowerCase().includes(query.toLowerCase()));
			if (roles.length > 0) return resolve(roles[0]);
		}
		reject();
	});
};