const { GraphQLServer } = require('graphql-yoga');
const path = require('path');
const fs = require('fs');

const resolvers = require('./resolvers');

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.gql'), 'utf8');

const server = new GraphQLServer({ typeDefs, resolvers });

module.exports = server;
