'use strict'

const fs = require('fs')
const http = require('http')
const dotenv = require('dotenv')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const schema = require('./graphql/schema')

// Creating app
dotenv.load()
const app = express()
// Configurations
const port = process.env.PORT || 4000
const app_url = process.env.APP_URL

// Creating server
const server = http.createServer(app)
const apollo = new ApolloServer(schema)
apollo.applyMiddleware({app, path:'/api'})

// Add subscription support
apollo.installSubscriptionHandlers(server)

server.listen({ port: port }, () =>
  console.log('ϕ Server ready at', `http://${app_url}:${port}${apollo.graphqlPath}`)
)