"use strict";
const admin = module.exports = require('firebase-admin');
const config = require('../config');

admin.initializeApp({
    projectId: config.get('GCLOUD_PROJECT'),
})