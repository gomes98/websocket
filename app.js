const express = require('express');
const path = require('path');

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

app.use(helmet());

app.use(express.json());

app.use(morgan('dev'));

app.post('/login', (req, res, next) => {
    res.json({ token: '123456' });
});

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

module.exports = app