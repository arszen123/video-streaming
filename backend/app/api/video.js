"use strict";
const HttpError = require('../errors/http-error');
const Router = require('express').Router;
const router = new Router();
const videoService = require('../services/video');
const videoUploaderService = require('../services/video-uploader');
const multer = require('multer')();
const {getFile} = require('../services/bucket');
const {authMiddleware} = require('../services/auth');

const CHUNK_SIZE = (10 ** 6); // 1MB;

router.get('/api/videos', (req, res) => {
    videoService.findAll().then(videos => {
        res.json(videos);
    });
});

router.post(
    '/api/videos',
    authMiddleware,
    (req, res) => {
        const {title, videoId} = req.body;
        if (!videoId) {
            throw new HttpError(400, '"videoId" is required');
        }
        videoUploaderService.findById(videoId)
            .then(async uploadedVideo => {
                const oldPath =
                    videoUploaderService.getVideoPathOption(uploadedVideo);
                const file = oldPath.file;
                const video = await videoService.create({title, file});
                const newPath = videoService.getVideoPathOption(video);
                await getFile(oldPath).moveByOption(newPath);
                return video;
            }).then(({file, ...video}) => {
                res.json(video);
            }).catch(e => {
                res.throw(new HttpError(400, 'Error', e));
            })
    }
);

router.get('/api/videos/:id', (req, res) => {
    const {id} = req.params;
    videoService.findById(id).then(({file, ...video}) => {
        res.json(video);
    }).catch(e => {
        res.throw(new HttpError(404, 'Video not Found!', e));
    })
});

router.get('/api/videos/:id/stream', (req, res) => {
    const {id} = req.params;
    const {range} = req.headers;
    if (typeof range === 'undefined') {
        throw new HttpError(400, 'Header "Range" is required!');
    }
    videoService.findById(id).then(async video => {
        const filePathOption = videoService.getVideoPathOption(video);
        const file = await getFile(filePathOption);
        const fileSize = await file.size();
        const {start, end} = getRangeFromHeader(range, fileSize);
        const fileStream = file.createReadStream({start, end});
        res.writeHeader(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Type': 'video/mp4',
            'Content-Length': (end - start) + 1,
        });
        fileStream.pipe(res);
    }).catch(e => {
        res.throw(new HttpError(404, 'Video not found!',e));
    });
});

/**
 * Assume the chunks are uploaded sequentialy in order.
 */
router.post(
    '/api/upload-chunk',
    authMiddleware,
    multer.single('chunk'),
    (req, res) => {
        const {videoId} = req.body;
        const {file} = req;
        let video = null;
        if (videoId) {
            video = videoUploaderService.findById(videoId);
        } else {
            video = videoUploaderService.create();
        }
        video.then(async video => {
            const filePathOption = 
                videoUploaderService.getVideoPathOption(video)
            const storedFile = getFile(filePathOption);
            if (videoId) {
                await storedFile.append(file.buffer);
            } else {
                await storedFile.save(file.buffer, {
                    resumable: false,
                    metadata: {contentType: 'video/mp4'}
                });
            }
            res.json({
                success: true,
                videoId: video.id,
            })
        }).catch(e => {
            if (videoId) {
                res.throw(new HttpError(404, 'Video not found!',e));
                return;
            }
            res.throw(new HttpError(400, 'Error', e));
        });
    }
);

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