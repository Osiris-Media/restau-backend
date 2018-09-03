const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);

mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error'));
db.on('open', function(){
    console.log('Connected to the database...');
})