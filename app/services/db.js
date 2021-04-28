'use strict';
const path = require('path');
const fs = require('fs');
const {promisify} = require('util');
const uuid = require('uuid').v4;
const config = require('../config');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

function dbFile(table) {
    return path.join(config.get('DB_PATH'), `db-${table}.json`);
}

async function data(table) {
    if (!fs.existsSync(dbFile(table))) {
        return [];
    }
    const data = await readFile(dbFile(table));
    return JSON.parse(data) || [];
}

async function save(table, value) {
    const dbData = await data(table);
    const entity = {...value, id: uuid()};
    dbData.push(entity);
    await writeFile(dbFile(table), JSON.stringify(dbData));
    return entity;
}

async function remove(table, filter) {
    const dbData = await data(table);
    const revertedFilter = (...args) => !filter.call(null, ...args);
    const newData = dbData.filter(revertedFilter);
    await writeFile(dbFile(table), JSON.stringify(newData));
    return {removed: dbData.length - newData.length};
}

module.exports = {
    data,
    save,
    remove,
}