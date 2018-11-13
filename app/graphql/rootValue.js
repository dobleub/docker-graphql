'use strict'

var Customer = require('../models/customer')

var rootValue = {
	customer: Customer.find
}

module.exports = rootValue