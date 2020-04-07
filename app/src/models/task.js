'use strict'

const Mongoose = require('mongoose');

const TaskSchema = Mongoose.Schema({
	title: String,
	description: String,
	owner: String,
	priority: {
		type: String,
		default: 'low'	
	},
	status: {
		type: Boolean,
		default: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	},
	deletedAt: Date
	/*author: { 
		type: Mongoose.Schema.Types.ObjectId, 
		ref: 'Author'
	},*/
});

const Task = Mongoose.model('Task', TaskSchema);

module.exports = Task;