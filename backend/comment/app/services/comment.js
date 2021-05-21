"use strict";
const config = require('../config');
const { Datastore } = require('@google-cloud/datastore');
const ds = new Datastore({projectId: config.get('GCLOUD_PROJECT')});
const KIND = 'Comment';

/**
 * Create a comment.
 * @param {String} listId 
 * @param {Object} commentDto 
 */
async function create(listId, commentDto) {
    const key = ds.key(KIND);

    const entity = {
        key,
        data: {
            ...commentDto,
            list_id: listId,
        },
    };

    await ds.save(entity);
}

async function findByListId(listId) {
    const query = ds.createQuery(KIND).filter('list_id', listId);

    const [data] = await query.run();
    return data.map(entity => {
        entity.id = entity[ds.KEY].id;
        delete entity[ds.KEY];
        return entity;
    });
}

module.exports = {
    create,
    findByListId,
}