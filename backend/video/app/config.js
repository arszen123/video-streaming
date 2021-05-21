'use strict';

const nconf = module.exports = require('nconf');
const path = require('path');

nconf.argv()
.env([
    'NODE_ENV',
    'PORT',
    'GCLOUD_PROJECT',
    'GCLOUD_MEDIA_BUCKET',
    'GCLOUD_MEDIA_TEMP_BUCKET',
])
.file({file: path.join(__dirname, 'config.json')})
.defaults({
    PORT: 8080,

    // GCLOUD ENV PARAMS
    GCLOUD_PROJECT: '',
    GCLOUD_MEDIA_BUCKET: '',
    GCLOUD_MEDIA_TEMP_BUCKET: '',
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