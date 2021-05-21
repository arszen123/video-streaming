const {exec} = require('child_process');
const videoUploaderService = require('../services/video-uploader');
const config = require('../config');

const deleteBefore = new Date();
deleteBefore.setDate(deleteBefore.getDate() - 7);

// clean chunks
videoUploaderService.removeBy((row) => new Date(row.created_at) <= deleteBefore).then(() => {
    const tmpPath = config.get('MEDIA_TEMP_PATH');
    exec(`find ${tmpPath} -mtime +7 -exec rm {} \\;`);
})