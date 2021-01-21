'use strict';

const { makeExecutableSchema, PubSub } = require('apollo-server');

const pubsub = new PubSub();
const TASK_ADDED = 'TASK_ADDED';

const typeDefs = `
	type Subscription {
		taskAdded: Task
	}

	type Task {
		id: String
		title: String
		description: String
		owner: String
		priority: String
		createdAt: String
		updatedAt: String
	}

	type Query {
		tasks(data: InputTask): [Task]
	}
	type Mutation {
		newTask(data: InputTask): Task
		modTask(data: InputTask): Task
		delTask(id: String!): Task
	}

	input InputTask {
		id: String
		title: String
		description: String
		owner: String
		priority: String
		status: Boolean
	}
`;

const resolvers = {
	Subscription: {
		taskAdded: {
			subscribe: () => pubsub.asyncIterator([TASK_ADDED]),
		},
	},
	Query: {
		tasks: async (_, { data }, { dataSources }) => {
			const tasks = await dataSources.TaskDS.find(data || {});
			return tasks;
		},
	},
	Mutation: {
		newTask: (_, { data }, { dataSources }) => {
			pubsub.publish(TASK_ADDED, { taskAdded: data });
			return dataSources.TaskDS.create(data);
		},
		delTask: (_, data, { dataSources }) => {
			return dataSources.TaskDS.delete(data);
		},
		modTask: (_, { data }, { dataSources }) => {
			return dataSources.TaskDS.update(data);
		}
	}
};

const TaskSchema = makeExecutableSchema({
  typeDefs, 
  resolvers
});


module.exports = TaskSchema;