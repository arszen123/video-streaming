"use strict";
const router = new (require('express').Router)();
const videoService = require('../services/video');
const videoUploaderService = require('../services/video-uploader');
const path = require('path');
const fs = require('fs');
const util = require('util');
const HttpError = require('../errors/http-error');
const moveFile = util.promisify(fs.rename);

router.get('/', (req, res) => {
    videoService.findAll().then(videos => {
        res.render('pages/index', {videos});
    })
})

router.get('/video/:id', (req, res) => {
    const {id} = req.params;
    videoService.findVideoById(id).then(video => {
        if (!video) {
            res.redirect('/');
            return;
        }
        res.render('pages/video', {video});
    })
})

router.get('/upload', (req, res) => {
    res.render('pages/upload', {title: ''})
})

router.post('/upload', (req, res) => {
    const {title, videoId} = req.body;
    if (!videoId) {
        res.render('pages/upload', {title});
        return;
    }
    videoUploaderService.findById(videoId).then(async uploadedVideo => {
        const oldPath = videoUploaderService.getVideoPath(uploadedVideo);
        const file = path.basename(oldPath);
        const video = await videoService.createVideo({title, file});
        const newPath = videoService.getVideoPath(video);
        await moveFile(oldPath, newPath);
        await videoUploaderService.remove(videoId);
    }).then(() => {
        res.redirect('/');
    }).catch(() => {
        res.throw(new HttpError(400, 'Error'));
    })
})

module.exports = router;