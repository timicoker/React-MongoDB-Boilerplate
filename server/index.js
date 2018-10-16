//import { GraphQLServer } from 'graphql-yoga'
// ... or using `require()`
const { GraphQLServer } = require('graphql-yoga')
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/test") //'test' is the name of your database

const Booking = mongoose.model('Schema',{
    date: String,
    booked: Boolean
    /// add or change database models as needed
});

const typeDefs = `
  type Query {
    hello(name: String): String!
    bookings: [Booking]
  }
  type Booking {
      id: ID! 
      date: String!
      booked: Boolean!
  }
  type Mutation {
    createBooking(date: String!): Booking
    updateBooking(id: ID!, complete: Boolean!): Boolean
    removeBooking(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    bookings: () => Booking.find()
  },
  Mutation: {
      createBooking: async (_, { date }) => {
          const booking = new Booking({date, booked: false});
          await booking.save();  // save it to the database
          return booking;
      },
      updateBooking: async (_, {id, booked}) => {
          await Booking.findByIdAndUpdate(id, {booked});
          return true;
      },
      removeBooking: async (_, {id}) => {
          await Booking.findByIdAndRemove(id);
          return true;
      }
  }
}

const server = new GraphQLServer({ typeDefs, resolvers });

mongoose.connection.once("open", function() {
    server.start(() => console.log('Server is running on localhost:4000'));
});