"use strict";
const path = require('path');
const db = require('./db');
const DB_TABLE = 'chunks';
const config = require('../config');

/**
 * Create new video upload record.
 */
function create() {
    const data = {
        created_at: new Date(),
    };
    return db.save(DB_TABLE, data);
}

function findAll() {
    return db.data(DB_TABLE);
}

function findById(id) {
    return findAll().then(chunks => chunks.find(data => data.id == id));
}

function getVideoPath(video) {
    return path.join(config.get('MEDIA_TEMP_PATH'), `${video.id}.mp4`);
}

function remove(id) {
    return removeBy(row => row.id === id);
}

function removeBy(filter) {
    return db.remove(DB_TABLE, filter);
}

module.exports = {
    findAll,
    findById,
    create,
    getVideoPath,
    remove,
    removeBy
}