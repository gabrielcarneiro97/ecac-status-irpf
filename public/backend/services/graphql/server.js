const { ApolloServer } = require('apollo-server');
const path = require('path');
const fs = require('fs');

const resolvers = require('./resolvers');

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.gql'), 'utf8');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      // check connection for metadata
      return connection.context;
    }
    // check from req
    const token = req.headers.authorization || '';

    return { token };
  },
});

module.exports = server;
