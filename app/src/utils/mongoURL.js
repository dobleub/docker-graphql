'use strict';

const dotenv = require('dotenv');
dotenv.config();

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const db = process.env.DB_DATA;
const dbAuth = process.env.DB_AUTH;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const mechanism = process.env.DB_AUTH_MECHANISM;

const mongoURL = `mongodb://${user}:${password}@${host}:${port}/${db}?authSource=${dbAuth}&authMechanism=${mechanism}`;

module.exports = mongoURL;