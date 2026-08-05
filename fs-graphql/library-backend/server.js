require("dotenv").config();

const jwt = require("jsonwebtoken");

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v4: uuid } = require("uuid");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const User = require("./models/user");

const startServer = (port) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  startStandaloneServer(server, {
    listen: { port: 4000 },

    context: async ({ req }) => {
      console.log("req:", !!req);
      console.log("request:", !!req);

      console.log("req headers:", req?.headers);
      console.log("request headers:", req?.headers);
      //HEADERS
      //old
      const auth = req?.headers.authorization;
      // const auth = req?.headers.get("authorization");
      console.log("Authorization:", auth);
      //If the header starts with "Bearer "
      if (auth && auth.startsWith("Bearer ")) {
        //Extract the token
        const decodedToken = jwt.verify(
          auth.substring(7),
          process.env.JWT_SECRET,
        );
        //Find the user
        const currentUser = await User.findById(decodedToken.id);
        //Return
        return { currentUser };
      }

      return {};
    },
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
};

module.exports = startServer;
