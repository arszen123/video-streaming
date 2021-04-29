'use strict';
const {Storage} = require('@google-cloud/storage');
const config = require('../config');
const storage = new Storage({projectId: config.get('GCLOUD_PROJECT')});
const path = require('path');
const uuid = require('uuid').v4;

function getFile(filePathOption) {
    const bucket = storage.bucket(filePathOption.bucket);
    const file = bucket.file(filePathOption.file);
    file.size = async function () {
        if ((await this.exists())) {
            const [metadata] = await this.getMetadata();
            return metadata.size;
        }
        return 0;
    }
    file.append = async function (buffer) {
        // immutable, so need a little workaround
        const bucket = this.bucket;
        const tmpFileName = uuid();
        const tmpFile = bucket.file(tmpFileName);
        await tmpFile.save(buffer);
        await bucket.combine([this, tmpFile], this);
        await tmpFile.delete({ignoreNotFound: true});
    }
    file.moveByOption = function (filePathOption) {
        const prefix = filePathOption.bucket ? 'gs://' : '';
        return this.move(prefix + path.join(filePathOption.bucket, filePathOption.file))
    }
    return file;
}


module.exports = {
    getFile
}