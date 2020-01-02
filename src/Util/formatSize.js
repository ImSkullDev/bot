module.exports = (bytes) => {
	const kb = bytes / 1024;
	const mb = kb / 1024;
	const gb = mb / 1024;
	if (kb < 1024) return kb.toFixed(1).toLocaleString() + ' KB';
	if (kb > 1024 && mb < 1024) return mb.toFixed(1).toLocaleString() + ' MB';
	return gb.toFixed(1).toLocaleString() + ' GB';
};