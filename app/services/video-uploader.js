"use strict";

const config = require('../config');
const {Datastore} = require('@google-cloud/datastore');
const ds = new Datastore({projectId: config.get('GCLOUD_PROJECT')});
const KIND = 'Chunk';

function setEntityId(obj) {
    obj.id = obj[ds.KEY].id;
    delete obj[ds.KEY];
    return obj;
}

/**
 * @typedef {Object} Chunk
 * @property {number} id
 * @property {Date} created_at
 */

/**
 * Create new video upload record.
 * @returns {Promise<Chunk>} entity
 */
async function create() {
    const key = ds.key(KIND);
    const data = {
        created_at: new Date(),
    };
    const entity = {
        key,
        data
    };
    await ds.save(entity);
    return {...data, id: key.id};
}

/**
 * @returns {Promise<Chunk[]>}
 */
function findAll() {
    return ds.createQuery(KIND).run().then(([data]) => data.map(setEntityId));
}

/**
 * @param {number} id 
 * @returns {Promise<Chunk>}
 */
async function findById(id) {
    const key = ds.key([KIND, Number.parseInt(id)]);
    const [res] = await ds.get(key);
    if (res) {
        return setEntityId(res); 
    }
    throw new Error('Chunk not found!');
}

/**
 * @param {Chunk} video 
 * @returns {string}
 */
function getVideoPath(video) {
    const option = getVideoPathOption(video);
    return `gs://${option.bucket}/${option.file}`;
}

/**
 * @param {Chunk} video
 */
 function getVideoPathOption(video) {
    return {
        bucket: config.get('GCLOUD_MEDIA_TEMP_BUCKET'),
        file: `${video.id}.mp4`,
    }
}

/**
 * @param {number} id
 */
function remove(id) {
    const key = ds.key([KIND, Number.parseInt(id)]);
    return ds.delete(key);
}

function removeBy(filter) {
    throw new Error('Not implemented!');
}

module.exports = {
    findAll,
    findById,
    create,
    getVideoPath,
    remove,
    removeBy,
    getVideoPathOption,
}