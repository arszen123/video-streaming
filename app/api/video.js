"use strict";
const HttpError = require('../errors/http-error');
const Router = require('express').Router;
const {Readable} = require('stream');
const router = new Router();
const videoService = require('../services/video');
const videoUploaderService = require('../services/video-uploader');
const multer = require('multer')();
const fs = require('fs');

const CHUNK_SIZE = (10 ** 6); // 1MB;
router.get('/api/video/:id', (req, res) => {
    const {id} = req.params;
    const {range} = req.headers;
    if (typeof range === 'undefined') {
        throw new HttpError(400, 'Header "Range" is required!');
    }
    videoService.findVideoById(id).then(video => {
        const filePath = videoService.getVideoPath(video);
        const fileSize = fs.statSync(filePath).size;
        const {start, end} = getRangeFromHeader(range, fileSize);
        const fileStream = fs.createReadStream(filePath, {start, end})
        res.writeHeader(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Type': 'video/mp4',
            'Content-Length': (end - start) + 1,
        });
        fileStream.pipe(res);
    }).catch(e => {
        res.throw(new HttpError(404, 'Video not found!'));
    });
});

/**
 * Assume the chunks are uploaded sequentialy in order.
 */
router.post('/api/video/upload', multer.single('chunk'), (req, res) => {
    const {videoId} = req.body;
    const {file} = req;
    let video = null;
    if (videoId) {
        video = videoUploaderService.findById(videoId);
    } else {
        video = videoUploaderService.create();
    }
    video.then(video => {
        const filePath = videoUploaderService.getVideoPath(video)
        const readable = new Readable();
        const ws = fs.createWriteStream(filePath, {flags: 'a'});
        readable.push(file.buffer);
        readable.push(null);
        readable.pipe(ws);
        res.json({
            success: true,
            videoId: video.id,
        })
    }).catch(() => {
        if (videoId) {
            res.throw(new HttpError(404, 'Video not found!'));
            return;
        }
        res.throw(new HttpError(400, 'Error'));
    });
});

function getRangeFromHeader(range, maxSize) {
    const [start, end, size] = range.replace(/bytes(=| )/, '')
        .split(/[-\/]/)
        .map(r => Number.parseInt(r));
    return {
        start: start || 0,
        end: Math.min(
            Number.isNaN(end) ? start + CHUNK_SIZE : end,
            maxSize - 1
        ),
        size
    };
}

module.exports = router;