'use strict'

const { gql } = require('apollo-server');

// GrpahQl Schema
const typeDefs = gql`
	type Query {
		"Simple query"
		hello: String!
		customer (id: Int!): Customer
	}
	
	type Customer {
		_id: Int!
		CustomerName: String!
		customerDescription: String
		Address: String
	}
`;

module.exports = typeDefs