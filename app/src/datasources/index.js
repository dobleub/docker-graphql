'use strict';

const TaskDS = require('./task');

const dataSources = {
	TaskDS: new TaskDS(),
};

module.exports = dataSources;