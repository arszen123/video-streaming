'use strict';

const nconf = module.exports = require('nconf');
const path = require('path');

nconf.argv()
.env([
    'NODE_ENV',
    'APP_PORT',
    'DB_PATH',
    'MEDIA_PATH',
    'MEDIA_TEMP_PATH',
])
.file({file: path.join(__dirname, 'config.json')})
.defaults({
    APP_PORT: 8080,
    DB_PATH: path.join(__dirname, 'data', 'db'),
    MEDIA_PATH: path.join(__dirname, 'data', 'media'),
    MEDIA_TEMP_PATH: path.join(__dirname, 'data', 'media-tmp'),
});