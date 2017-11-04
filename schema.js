const fetch = require('node-fetch');
const util = require('util');
const parseXML = util.promisify(require('xml2js').parseString);
const { 
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} = require('graphql');

const API_KEY = process.env.API_KEY;

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This is cool book description',

    fields: () => ({
        title: {
            type: GraphQLString,
            resolve: (xml) => xml.title[0],
        },
        isbn: {
            type: GraphQLString,
            resolve: (xml) => xml.isbn[0],
        },
        averateRating: {
            type: GraphQLString,
            resolve: (xml) => xml.average_rating[0],
        },
        link: {
            type: GraphQLString,
            resolve: (xml) => xml.link[0],
        },
        description: {
            type: GraphQLString,
            resolve: (xml) => xml.description[0],
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This is author',

    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: (xml) => xml.GoodreadsResponse.author[0].name[0],
        },
        gender: {
            type: GraphQLString,
            resolve: (xml) => xml.GoodreadsResponse.author[0].gender[0],
        },
        books: {
            type: new GraphQLList(BookType),
            resolve: (xml) => xml.GoodreadsResponse.author[0].books[0].book,
        }
    })
});



module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: 'This is cool description',

        fields: () => ({
            author: {
                type: AuthorType,
                args: {
                    id: { type: GraphQLInt }
                },
                resolve: (root, args) => fetch(`https://www.goodreads.com/author/show/${args.id}?format=xml&key=${API_KEY}`)
                    .then(res => res.text())
                    .then(parseXML),
             },
        })
    })
});

