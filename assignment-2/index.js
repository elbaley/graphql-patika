import { customAlphabet } from "nanoid";
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-";
const nanoid = customAlphabet(alphabet, 19);
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer, gql } from "apollo-server";
import fakeDb from "./data.json" assert { type: "json" };
const typeDefs = gql`
  # Types
  type Event {
    id: ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location_id: ID!
    user_id: ID!
    users: [User!]
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

  # Inputs
  type DeleteCountOutput {
    count: Int!
  }
  # User Inputs
  input AddUserInput {
    username: String!
    email: String!
  }
  input UpdateUserInput {
    username: String
    email: String
  }
  # Event Inputs
  input AddEventInput {
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location_id: ID!
    user_id: ID!
  }
  input UpdateEventInput {
    title: String
    desc: String
    date: String
    from: String
    to: String
    location_id: ID
    user_id: ID
  }
  # Location Inputs
  input AddLocationInput {
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
  }
  input UpdateLocationInput {
    name: String
    desc: String
    lat: Float
    lng: Float
  }
  # Participant Inputs
  input AddParticipantInput {
    user_id: ID!
    event_id: ID!
  }
  input UpdateParticipantInput {
    user_id: ID
    event_id: ID
  }
  type Query {
    # Events
    events: [Event!]
    event(id: ID!): Event
    # Locations
    locations: [Location!]
    location(id: ID!): Location!
    # Users
    users: [User!]
    user(id: ID!): User!
    # Participants
    participants: [Participant!]
    participant(id: ID!): Participant!
  }

  # Mutations
  type Mutation {
    # User Mutations
    addUser(data: AddUserInput!): User!
    updateUser(id: ID!, data: UpdateUserInput!): User!
    deleteUser(id: ID!): User!
    deleteAllUsers: DeleteCountOutput!

    # Event Mutations
    addEvent(data: AddEventInput!): Event!
    updateEvent(id: ID!, data: UpdateEventInput!): Event!
    deleteEvent(id: ID!): Event!
    deleteAllEvents: DeleteCountOutput!

    # Location Mutations
    addLocation(data: AddLocationInput!): Location!
    updateLocation(id: ID!, data: UpdateLocationInput!): Location
    deleteLocation(id: ID!): Location
    deleteAllLocations: DeleteCountOutput!

    # Participant Mutations
    addParticipant(data: AddParticipantInput!): Participant!
    updateParticipant(id: ID!, data: UpdateParticipantInput!): Participant!
    deleteParticipant(id: ID!): Participant!
    deleteAllParticipants: DeleteCountOutput!
  }
`;

const resolvers = {
  Query: {
    // Events
    events: () => fakeDb.events,
    event: (_, args) => {
      const event = fakeDb.events.find(
        (event) =>
          event.id === (parseInt(args.id) ? parseInt(args.id) : args.id)
      );

      if (!event) {
        throw new Error("Event not found!");
      }
      return event;
    },

    // Locations
    locations: () => fakeDb.locations,
    location: (_, args) => {
      const location = fakeDb.locations.find(
        (location) =>
          location.id === (parseInt(args.id) ? parseInt(args.id) : args.id)
      );

      if (!location) {
        throw new Error("Location not found!");
      }
      return location;
    },

    //Users
    users: () => fakeDb.users,
    user: (_, args) => {
      const user = fakeDb.users.find((user) => user.id === parseInt(args.id));
      if (!user) {
        throw new Error("User not found!");
      }
      return user;
    },

    //Participants
    participants: () => fakeDb.participants,
    participant: (_, args) =>
      fakeDb.participants.find(
        (participant) => participant.id === parseInt(args.id)
      ),
  },
  Mutation: {
    // User Mutations
    addUser: (_, { data }) => {
      const newUser = { id: nanoid(), ...data };
      fakeDb.users.push(newUser);
      return newUser;
    },
    updateUser: (_, { id, data }) => {
      const userIndex = fakeDb.users.findIndex(
        (user) => user.id === parseInt(id)
      );
      if (userIndex === -1) {
        throw new Error("User not found!");
      }
      fakeDb.users[userIndex] = {
        ...fakeDb.users[userIndex],
        ...data,
      };
      return fakeDb.users[userIndex];
    },
    deleteUser: (_, { id }) => {
      const userIndex = fakeDb.users.findIndex(
        (user) => user.id === parseInt(id)
      );
      if (userIndex === -1) {
        throw new Error("User not found!");
      }
      const deletedUser = fakeDb.users[userIndex];
      fakeDb.users.splice(userIndex, 1);

      return deletedUser;
    },
    deleteAllUsers: () => {
      const usersLength = fakeDb.users.length;
      fakeDb.users.splice(0, usersLength);

      return {
        count: usersLength,
      };
    },
    // Event Mutations
    addEvent: (_, { data }) => {
      const newEvent = {
        id: nanoid(),
        ...data,
        location_id: parseInt(data.location_id),
      };
      fakeDb.events.push(newEvent);
      return newEvent;
    },
    updateEvent: (_, { id, data }) => {
      const eventIndex = fakeDb.events.findIndex(
        (event) => event.id === (parseInt(id) ? parseInt(id) : id)
      );
      if (eventIndex === -1) {
        throw new Error("Event not found!");
      }
      fakeDb.events[eventIndex] = {
        ...fakeDb.events[eventIndex],
        ...data,
      };
      return fakeDb.events[eventIndex];
    },
    deleteEvent: (_, { id }) => {
      const eventIndex = fakeDb.events.findIndex(
        (event) => event.id === (parseInt(id) ? parseInt(id) : id)
      );
      if (eventIndex === -1) {
        throw new Error("Event not found!");
      }
      const deletedEvent = fakeDb.events[eventIndex];
      fakeDb.events.splice(eventIndex, 1);

      return deletedEvent;
    },
    deleteAllEvents: () => {
      const eventsLength = fakeDb.users.length;
      fakeDb.events.splice(0, eventsLength);

      return {
        count: eventsLength,
      };
    },

    // Location Mutations
    addLocation: (_, { data }) => {
      const newLocation = {
        id: nanoid(),
        ...data,
      };
      fakeDb.locations.push(newLocation);
      return newLocation;
    },
    updateLocation: (_, { id, data }) => {
      const locationIndex = fakeDb.locations.findIndex(
        (event) => event.id === (parseInt(id) ? parseInt(id) : id)
      );
      if (locationIndex === -1) {
        throw new Error("Location not found!");
      }
      fakeDb.locations[locationIndex] = {
        ...fakeDb.locations[locationIndex],
        ...data,
      };
      return fakeDb.locations[locationIndex];
    },
    deleteLocation: (_, { id }) => {
      const locationIndex = fakeDb.locations.findIndex(
        (location) => location.id === (parseInt(id) ? parseInt(id) : id)
      );
      if (locationIndex === -1) {
        throw new Error("Location not found!");
      }
      const deleteLocation = fakeDb.locations[locationIndex];
      fakeDb.locations.splice(locationIndex, 1);

      return deleteLocation;
    },
    deleteAllLocations: () => {
      const locationsLength = fakeDb.locations.length;
      fakeDb.locations.splice(0, locationsLength);

      return {
        count: locationsLength,
      };
    },
    // Participant Mutations
    addParticipant: (_, { data }) => {
      const newParticipant = {
        id: nanoid(),
        ...data,
      };
      fakeDb.participants.push(newParticipant);
      return newParticipant;
    },
    updateParticipant: (_, { id, data }) => {
      const participantIndex = fakeDb.participants.findIndex(
        (event) => event.id === (parseInt(id) ? parseInt(id) : id)
      );
      if (participantIndex === -1) {
        throw new Error("Participant not found!");
      }
      fakeDb.participants[participantIndex] = {
        ...fakeDb.participants[participantIndex],
        ...data,
      };
      return fakeDb.participants[participantIndex];
    },
    deleteParticipant: (_, { id }) => {
      const participantIndex = fakeDb.participants.findIndex(
        (participant) => participant.id === (parseInt(id) ? parseInt(id) : id)
      );
      if (participantIndex === -1) {
        throw new Error("Participant not found!");
      }
      const deletedParticipant = fakeDb.participants[participantIndex];
      fakeDb.participants.splice(participantIndex, 1);

      return deletedParticipant;
    },
    deleteAllParticipants: () => {
      const participantsLength = fakeDb.participants.length;
      fakeDb.participants.splice(0, participantsLength);

      return {
        count: participantsLength,
      };
    },
  },
  User: {
    events: (parent) =>
      fakeDb.events.filter((event) => event.user_id === parseInt(parent.id)),
  },
  Event: {
    users: (parent) =>
      fakeDb.users.filter((user) => user.id === parseInt(parent.user_id)),
    location: (parent) =>
      fakeDb.locations.find((location) => location.id === parent.location_id),
    participants: (parent) =>
      fakeDb.participants.filter(
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
