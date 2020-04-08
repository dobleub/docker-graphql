'use strict'

const { DataSource } = require('apollo-datasource');
const Task = require('../models/task');
const { isset } = require('../utils');

class TaskDS extends DataSource {
	constructor(data) {
		super();
		this.data = data;
	}
	initialize(config) {
		this.context = config.context;
	}

	async find(data) {
		var match = {};
		if (isset(data.id)) {
			match._id = data.id;
		} else {
			if (isset(data.status)) {
				match.status = data.status;
			} else {
				match.status = true;
			}
		}
		if (isset(data.title)) {
			match.title = new RegExp(data.title, 'i');
		}
		if (isset(data.description)) {
			match.description = new RegExp(data.description, 'i');
		}
		if (isset(data.priority)) {
			match.priority = new RegExp(data.priority, 'i');
		}
		if (isset(data.owner)) {
			match.owner = new RegExp(data.owner, 'i');
		}
		return await Task.find(match).sort({_id: -1});
	}

	async create(data) {
		var newTask = new Task(data);
		await newTask.save();
		if (isset(newTask._id)) {
			newTask.id = newTask._id;
		}
		return newTask;
	}

	async delete(data) {
		if (isset(data.id)) {
			return Task.findOne({_id: data.id, status: true})
				.then(async (task) => {
					const tmpTask = task;
					if (task) {
						// task.remove();
						task.status = false;
						task.deletedAt = new Date();
						await task.save();
						tmpTask.id = task._id;
					}
					return tmpTask;
				});
		} else {
			return null;
		}
	}

	async update(data) {
		if (isset(data.id)) {
			return Task.findOne({_id: data.id})
				.then(async (task) => {
					if (task) {
						if (isset(data.title)) {
							task.title = data.title;
						}
						if (isset(data.description)) {
							task.description = data.description;
						}
						if (isset(data.owner)) {
							task.owner = data.owner;
						}
						if (isset(data.priority)) {
							task.priority = data.priority;
						}
						if (isset(data.status)) {
							task.status = data.status;
						}
						task.updatedAt = new Date();
						await task.save();
						task.id = task._id;
					}
					return task;
				});
		} else {
			return null;
		}
	}
}

module.exports = TaskDS;