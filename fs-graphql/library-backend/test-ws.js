const { createClient } = require("graphql-ws");
const WebSocket = require("ws");

const client = createClient({
  url: "ws://127.0.0.1:4000/graphql",
  webSocketImpl: WebSocket,
});

client.subscribe(
  {
    query: `
      subscription {
        bookAdded {
          title
          published
          author {
            name
          }
          genres
          id
        }
      }
    `,
  },
  {
    next: (data) => {
      console.log("RECEIVED:");
      console.dir(data, { depth: null });
    },

    error: (error) => {
      console.error("SUBSCRIPTION ERROR:");
      console.error(error);
    },

    complete: () => {
      console.log("COMPLETE");
    },
  },
);

console.log("Subscription client started");
