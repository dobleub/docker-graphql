'use strict';

const http = require('http');
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { RedisCache } = require('apollo-server-cache-redis');
const Mongoose = require('mongoose');
const dotenv = require('dotenv');
// Custom imports
const mongoURL = require('./src/utils/mongoURL');
const superSchema = require('./src/schemas');
const dataSources = require('./src/datasources');

// Defining types
dotenv.config();

Mongoose.set('debug', true);
Mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true}, function (err) {
	if (err) throw err;
	console.info(`Successfully connected to DB in ${process.env.DB_HOST}`);
});

const PORT = process.env.APP_PORT || 4000;
const PATH = process.env.APP_URI || '/graphql';
const SUBS_PATH = process.env.APP_WS_URI;

// Setting up Server
const app = express();
const httpServer = http.createServer(app);

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ 
	schema: superSchema,
	dataSources,
	context: ({req, res, connection}) => {
		if (connection) {
			return connection.context;
		} else {
			const token = req.headers.authorization || "";
			return token;
		}
		//console.log('On context');
	},
	subscriptions: { 
		// path: `${SUBS_PATH}${PATH}`,
		onConnect: (connectionParams, websocket, context) => {
			console.log('🚀 Subscriptions already connected');
		},
		onDisconnect: (websocket, context) => {
			console.log('🚀 Subscriptions disconnected');
		}
	},
	cache: new RedisCache({
		password: '8QyugR2j7dHvn7L2me8YENxfA',
		host: 'redis_server',
		port: 6379,
		db: 3,
	}),
	trace: true
});

server.applyMiddleware({ app, path: PATH });
server.installSubscriptionHandlers(httpServer);

// The `listen` method launches a web server.
//app.listen({ port: PORT }, () => {
httpServer.listen(PORT, () => {
	console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
	console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});

process.on('SIGINT', () => {
	Mongoose.connection.close(() => {
		process.exit(0);
	});
});