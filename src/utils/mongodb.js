require('dotenv').config();

const { MongoClient } = require('mongodb');
const options = { useNewUrlParser: true, useUnifiedTopology: true };
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.jieo9.mongodb.net/test?retryWrites=true&w=majority`;

let client
let clientPromise

if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME ) {
  console.error(process.env);
  console.error(uri);
  throw new Error('Please add your DB details to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
module.exports = clientPromise;