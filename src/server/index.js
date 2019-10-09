require('dotenv').config();
const mongoose = require('mongoose');

const mongoOptions = {  useNewUrlParser: true ,  useUnifiedTopology: true };
const hapi = require('hapi');

const server =hapi.server({ port: 4000, host: 'localhost'});
console.log('ENV VARIABLES ', process.env.DB_USER)
mongoose.connect( `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds333238.mlab.com:33238/scores_nfl`,  mongoOptions );
mongoose.connection.once('open', () => {
    console.log('connected to db!');
});
const init = async () => {
 server.route( [
    {
        method: 'GET',
        path:'/',
        handler: function(reques, reply){
            return '<h1>My home Route</h1>'
        }
    },
     {
         method: 'POST',
         path: '/api/v1/matches',
         handler: ( req, reply ) => {
            console.log('Post matches into server');
            const { teams, id, weekId } = req.payload;
            const matches = new Matches({
                teams, id, weekId
            });
            return matches.save();
         }
     }
  ] );

  await server.start();
  console.log('Server running @ ---->',server.info.uri );
}

init();