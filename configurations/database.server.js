const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const turnOnMongoDBServer = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log('Connected to MongoDB database server'))
    .catch((err) => console.log('Failed to connect MongoDb database server'));
};

module.exports = { turnOnMongoDBServer };
