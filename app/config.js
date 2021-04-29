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
    'GCLOUD_PROJECT',
    'GCLOUD_MEDIA_BUCKET',
    'GCLOUD_MEDIA_TEMP_BUCKET',
])
.file({file: path.join(__dirname, 'config.json')})
.defaults({
    APP_PORT: 8080,
    MEDIA_PATH: path.join(__dirname, 'data', 'media'),
    MEDIA_TEMP_PATH: path.join(__dirname, 'data', 'media-tmp'),

    // GCLOUD ENV PARAMS
    GCLOUD_PROJECT: '',
    GCLOUD_MEDIA_BUCKET: '',
    GCLOUD_MEDIA_TEMP_BUCKET: ''
});

[
    'GCLOUD_PROJECT',
    'GCLOUD_MEDIA_BUCKET',
    'GCLOUD_MEDIA_TEMP_BUCKET'
].forEach(v => checkRequire(v));

function checkRequire(key) {
    if (!nconf.get(key)) {
        throw new Error(`"${key}" not set`)
    }
}