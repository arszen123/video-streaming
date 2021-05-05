"use strict";

const express = require('express');
const app = express();
const HttpError = require('./errors/http-error');

app.use(require('cors')());
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.use((req, res, next) => {
    res.throw = e => errorHandler(e, req, res);
    next();
})

app.use(require('./api/video'));

app.all('*', (req, res) => {
    throw new HttpError(404, 'Resource not found!');
})

app.use((err, req, res, next) => {
    errorHandler(err, req, res);
});

function errorHandler(err, req, res) {
    const errorData = {code: 500, message: 'Internal server error!'};
    let originalMessage = err.message;
    if (err instanceof HttpError) {
        errorData.code = err.code;
        errorData.message = err.message;
        originalMessage = err.previousErrorMessage;
    }
    console.error({
        path: req.path,
        ...errorData,
        originalMessage,
    });
    res.status(errorData.code).json(errorData);
}

module.exports = app;