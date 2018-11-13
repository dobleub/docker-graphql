'use strict'

var fs = require('fs');
var MongoClient = require('mongodb');
const assert = require('assert');
const dotenv = require('dotenv');
dotenv.load();

// Profile
const usr = encodeURIComponent(process.env.DB_USERNAME);
const pwd = encodeURIComponent(process.env.DB_PASSWORD);
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const dbString = process.env.DB_AUTH_DB;
// Connection URL
const url = `mongodb://${usr}:${pwd}@${host}:${port}/?authMechanism=SCRAM-SHA-1&authSource=${dbString}`;

var connection = (operation) => {
    MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
        if (!err) {
            var db = client.db(dbString);
            operation(db, () => {
                client.close()
            })
        } else {
            operation(null);
        }
    });
}  

module.exports = {
    match: (table, query, callback) => {
        connection((db) => {
            db.collection(table).aggregate([
                {'$match': query}
            ], (err, cursor) => {
                if (!err) {
                    cursor.toArray((err, items) => {
                        if (items.length >= 1) {
                            callback(items)
                        } else {
                            callback(null)
                        }
                    })
                } else {
                    callback(null)
                }
            })
        });
    }
}
