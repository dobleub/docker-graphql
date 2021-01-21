'use strict';

const { mergeSchemas } = require('apollo-server');
// Custom schemas
const BookSchema = require('./book');
const TaskSchema = require('./task');

const superSchema = mergeSchemas({
	schemas: [
		BookSchema,
		TaskSchema
	]
});


module.exports = superSchema;