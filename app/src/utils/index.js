'use strict';

const isset = (obj) => {
	var exists = false;
	if (typeof obj !== 'undefined') {
		exists = true;
	}
	return exists;
}

module.exports = {
	isset
}