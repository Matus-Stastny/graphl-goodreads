const fetch = require('node-fetch');
const util = require('util');
const parseXML = util.promisify(require('xml2js').parseString);
const { 
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString
} = require('graphql');

const API_KEY = process.env.API_KEY;

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    descritpion: 'This is author',

    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: (xml) => xml.GoodreadsResponse.author[0].name[0],
        },
    })
});

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        descritpion: 'This is cool description',

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