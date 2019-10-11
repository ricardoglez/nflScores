require('dotenv').config();
const mongoose = require('mongoose');
const Path = require('path');
const Matches = require('./models/Matches');
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const hapi = require('hapi');
const Inert = require('inert');
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds333238.mlab.com:33238/scores_nfl`, mongoOptions);
mongoose.connection.once('open', () => {
    console.log('connected to db!');
});


const init = async() => {


    const server = hapi.server({
        routes: {
            files: {
                relativeTo: Path.join(__dirname, '../../dist')
            }
        },
        port: 4000,
        host: 'localhost'
    });

    console.log(__dirname)

    await server.register(Inert);

    server.route([
        {
            method: 'GET',
            path: '/{param*}',
            handler: {
                directory: {
                    path: '.',
                    redirectToSlash: true
                }
            }
        },
        {
            config: {
                cors: {
                    origin: ['*'],
                    additionalHeaders: ['cache-control', 'x-requested-with']
                }
            },
            method: 'GET',
            path: '/api/v1/matches',
            handler: function(req, reply) {
                 
                return Matches.find()
            }
        },
        {
            method: 'POST',
            path: '/api/v1/matches',
            handler: (req, reply) => {
                try{
                    console.log('Post matches into server');
                    const { matches, weekId } = req.payload;
                    console.log('matches', matches)
                    console.log('weekId', weekId)
                    const storeMatches = new Matches({
                        matches,
                        weekId
                    });
                    return storeMatches.save();
                }
                catch {
                    return new Error( 'Something went wrong with the request' )
                }
                
            }
        }
    ]);

    await server.start();
    console.log('Server running @ ---->', server.info.uri);
}

init();