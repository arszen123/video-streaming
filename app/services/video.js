"use strict";
const path = require('path');
const db = require('./db');
const DB_TABLE = 'videos';
const config = require('../config');

function findAll() {
    return db.data(DB_TABLE);
}

function findVideoById(id) {
    return findAll().then(videos => videos.find(video => video.id == id));
}

function createVideo({title, file}) {
    return db.save(DB_TABLE, {title, file});
}

function getVideoPath(video) {
    return _getVideoFilePath(video.file);
}

function _getVideoFilePath(file) {
    return path.join(config.get('MEDIA_PATH'), file);
}

module.exports = {
    findAll,
    findVideoById,
    createVideo,
    getVideoPath,
}