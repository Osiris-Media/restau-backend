var env = process.env.NODE_ENV || 'development';

var config = require('./config.json');
var conf = config[env];

//Add environment configuration values to the process.env
Object.keys(conf).forEach(key => process.env[key] = conf[key]);