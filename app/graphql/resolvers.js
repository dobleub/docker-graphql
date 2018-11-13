'use strict'

// Map of functions wich return data from schema
const resolvers = {
	Query: {
		hello: () => 'world'
	}
}

module.exports = resolvers