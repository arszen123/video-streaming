"use strict";
const config = require('../config');
const {Datastore} = require('@google-cloud/datastore');
const ds = new Datastore({projectId: config.get('GCLOUD_PROJECT')});
const KIND = 'Video';

function setEntityId(obj) {
    obj.id = obj[ds.KEY].id;
    delete obj[ds.KEY];
    return obj;
}

/**
 * @typedef {Object} Video
 * @property {number} id
 * @property {string} title
 * @property {string} file
 */

/**
 * @returns {Promise<Video[]>}
 */
function findAll() {
    return ds.createQuery(KIND).run().then(([data]) => data.map(setEntityId));
}

/**
 * @param {number} id 
 * @returns {Promise<Video>}
 */
async function findById(id) {
    const key = ds.key([KIND, Number.parseInt(id)]);
    const [res] = await ds.get(key);
    if (res) {
        return setEntityId(res);
    }
    throw new Error('Video not found!');
}

/**
 * 
 * @param {Object} param
 * @param {string} param.title
 * @param {string} param.file 
 * @returns {Promise<Video>}
 */
async function create({title, file}) {
    const key = ds.key(KIND);
    const data = {
        title,
        file,
    };
    const entity = {
        key,
        data
    };
    await ds.save(entity);
    return {...data, id: key.id};
}

/**
 * @param {Video} video 
 * @returns {string}
 */
function getVideoPath(video) {
    const option = getVideoPathOption(video);
    return `gs://${option.bucket}/${option.file}`;
}

/**
 * @param {Video} video 
 * @returns 
 */
function getVideoPathOption(video) {
    return {
        bucket: config.get('GCLOUD_MEDIA_BUCKET'),
        file: video.file,
    }
}

module.exports = {
    findAll,
    findById,
    create,
    getVideoPath,
    getVideoPathOption,
}