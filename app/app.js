"use strict";

const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const HttpError = require('./errors/http-error');

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', 'app/views');

app.use(require('cors')());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static('app/public'));

app.use((req, res, next) => {
    res.throw = e => errorHandler(e, req, res);
    next();
})

app.use(require('./controllers'));
app.use(require('./api/video'));

app.all('*', (req, res) => {
    throw new HttpError(404, 'Resource not found!');
})

app.use((err, req, res, next) => {
    errorHandler(err, req, res);
});

module.exports = app;

function errorHandler(err, req, res) {
    const errorData = {code: 500, message: 'Internal server error!'};
    if (err instanceof HttpError) {
        errorData.code = err.code;
        errorData.message = err.message;
    }
    console.error({
        path: req.path,
        ...errorData,
        originalMessage: err.message
    });
    res.status(errorData.code).json(errorData);
}