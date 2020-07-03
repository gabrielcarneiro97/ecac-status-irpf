const { GraphQLServer, PubSub } = require('graphql-yoga');
const path = require('path');
const fs = require('fs');

const resolvers = require('./resolvers');

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.gql'), 'utf8');

const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });

module.exports = server;
