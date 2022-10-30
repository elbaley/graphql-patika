const { ApolloServer, gql } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const data = require("./data.json");

const typeDefs = gql`
  type Event {
    id: ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location_id: ID!
    user_id: ID!
    users: [User!]!
    location: Location!
    participants: [Participant!]
  }

  type Location {
    id: ID!
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
  }
  type User {
    id: ID!
    username: String!
    email: String!
    events: [Event!]
  }

  type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
  }

  type Query {
    events: [Event!]
    event(id: ID!): Event

    locations: [Location!]
    location(id: ID!): Location!

    users: [User!]
    user(id: ID!): User!

    participants: [Participant!]
    participant(id: ID!): Participant!
  }
`;

const resolvers = {
  Query: {
    events: () => data.events,
    event: (_, args) =>
      data.events.find((event) => event.id === parseInt(args.id)),
    locations: () => data.locations,
    users: () => data.users,
    user: (_, args) => {
      return data.users.find((user) => user.id === parseInt(args.id));
    },
    participants: () => data.participants,
    participant: (_, args) =>
      data.participants.find(
        (participant) => participant.id === parseInt(args.id)
      ),
    location: (_, args) =>
      data.locations.find((location) => location.id === parseInt(args.id)),
  },
  User: {
    events: (parent) =>
      data.events.filter((event) => event.user_id === parseInt(parent.id)),
  },
  Event: {
    users: (parent) => data.users.filter((user) => user.id === parent.user_id),
    location: (parent) =>
      data.locations.find((location) => location.id === parent.location_id),
    participants: (parent) =>
      data.participants.filter(
        (participant) => participant.event_id === parent.id
      ),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
});

server.listen().then(({ url }) => {
  console.log(`🚀  Apollo server ready at ${url}`);
});
