require('dotenv').config();

require('./config/config');
require('./db/connection');

const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(volleyball);

function notFound(req, res, next){
    res.status(404);
    const error = new Error('Not Found - '+ req.originalUrl);
    next(error);
}

function errorHandler(err,req, res, next){
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        stack: err.stack
    });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, ()=>console.log(`Server started on port: ${port}`));