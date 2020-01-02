module.exports = (duration) => {
	const seconds = Math.floor((duration / 1000) % 60);
	const minutes = Math.floor((duration / 1000 / 60) % 60);
	const hours = Math.floor(duration / 1000 / 60 / 60);
	return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};