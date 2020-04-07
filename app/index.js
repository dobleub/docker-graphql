'use strict';

const http = require('http');
const { execute, parse } = require('graphql');
const { compileQuery } = require('graphql-jit');
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
const cache = {};
const httpServer = http.createServer((req, res) => {
	let payload = '';

	req.on('data', (chunk) => {
		payload += chunk.toString();
	});

	req.on('end', async () => {
		const { query } = JSON.parse(payload);

		cache[query] = cache[query] || compileQuery(superSchema, parse(query));
		
		const result = await cache[query].query({}, { dataSources });
		res.end(JSON.stringify(result));
	});
});

// The `listen` method launches a web server.
httpServer.listen(PORT, () => {
	console.log(`🚀 Server ready at http://localhost:${PORT}${PATH}`);
});

process.on('SIGINT', () => {
	Mongoose.connection.close(() => {
		process.exit(0);
	});
});