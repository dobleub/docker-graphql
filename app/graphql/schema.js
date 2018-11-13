'use strict'

const resolvers = require('./resolvers')
const typeDefs = require('./typeDefs')
var rootValue = require('./rootValue')

module.exports = {
	typeDefs,
	resolvers,
	rootValue
}