'use strict'

const table = 'DBEnvyLoad_customers'
const assert = require('assert')
var deasync = require('deasync')
const code = require('../config/errors')
const db = require('../config/db')

const Customer = {
	find: (args) => {
		var id = args.id

		var data = null
		db.match(table, {"_id": id}, (items) => {
			if (items.length >= 1) {
				data = items[0]
			}
		});

		while (data == null) {
			deasync.runLoopOnce()
		}

		return data;
	}
}

module.exports = Customer