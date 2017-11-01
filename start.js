const express = require('express');
const graphqlHTTP = require('express-graphql')
const app = express();
require('dotenv').config();

const schema = require('./schema');

app.use('/grapqhl', graphqlHTTP({
    schema,
    graphiql: true,
}))

app.listen(process.env.PORT)

console.log(`App is running on port ${process.env.PORT}`);