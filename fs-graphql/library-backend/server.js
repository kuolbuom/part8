require("dotenv").config();

const jwt = require("jsonwebtoken");
const http = require("http");

const { ApolloServer } = require("@apollo/server");
// const { startStandaloneServer } = require("@apollo/server/standalone");
const { expressMiddleware } = require("@as-integrations/express5");
const { v4: uuid } = require("uuid");

const express = require("express");
const cors = require("cors");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const User = require("./models/user");

const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/use/ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const startServer = async (port) => {
  const app = express();

  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  // WebSocket server for GraphQL subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  wsServer.on("listening", () => {
    console.log("WebSocket server is listening");
  });

  wsServer.on("connection", () => {
    console.log("WebSocket client connected");
  });

  wsServer.on("error", (error) => {
    console.error("WebSocket server error:", error);
  });

  useServer(
    {
      schema,

      context: async (ctx) => {
        console.log("WebSocket connection established");

        return {};
      },
    },
    wsServer,
  );

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/graphql",
    // cors(),
    cors({
      origin: "http://localhost:5173",
    }),
    express.json(),
    expressMiddleware(server, {
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
    }),
  );

  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`Server ready at http://127.0.0.1:${port}/graphql`);
    // console.log(`Subscriptions ready at ws://127.0.0.1:${port}/graphql`);
  });

  // startStandaloneServer(server, {
  //   listen: { port },

  // }).then(({ url }) => {
  //   console.log(`Server ready at ${url}`);
  // });
};

module.exports = startServer;
