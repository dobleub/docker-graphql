'use strict'

// Errors code
module.exports = {
	get: (type, error) => {
		let msg = ''
		if (typeof(type.error) != null) {
			msg = this.type.error.code + ': ' + this.type.error.msg;
		} else {
			msg = 'Unknowk error';
		}
		return msg;
	},
	db: {
		NOT_CONNECTED: {code: '0x000', msg: 'Batabase not connected'},
		NOT_FOUND: {code: '0x001', msg: 'Error getting data'}
	}
}