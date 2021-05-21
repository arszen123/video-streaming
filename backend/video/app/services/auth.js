"use strict";
const admin = require('./firebase-admin');
const HttpError = require('../errors/http-error');

function authMiddleware(req, res, next) {
    admin.auth()
    .verifyIdToken(getToken(req))
    .then(decodedToken => {
        const user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
        };
        req.user = user;
        next();
    }).catch(() => {
        next(new HttpError(401, 'Unauthorized!'));
    })
}

function getToken(req) {
    const {authorization} = req.headers;
    if (!authorization) {
        return '';
    }
    const token = authorization.replace(/Bearer /, '');
    return token;
}

module.exports = {
    authMiddleware,
}