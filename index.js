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

app.listen(port, ()=>console.log(`Server started on port: ${port}`));