"use strict";
const router = new (require('express').Router)();
const videoService = require('../services/video');
const videoUploaderService = require('../services/video-uploader');
const HttpError = require('../errors/http-error');
const bucket = require('../services/bucket');

router.get('/', (req, res) => {
    videoService.findAll().then(videos => {
        res.render('pages/index', {videos});
    })
})

router.get('/video/:id', (req, res) => {
    const {id} = req.params;
    videoService.findById(id).then(video => {
        if (!video) {
            res.redirect('/');
            return;
        }
        res.render('pages/video', {video});
    }).catch(e => {
        res.throw(new HttpError(404, 'Video not found!', e));
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
        const oldPath = videoUploaderService.getVideoPathOption(uploadedVideo);
        const file = oldPath.file;
        const video = await videoService.create({title, file});
        const newPath = videoService.getVideoPathOption(video);
        await bucket.getFile(oldPath).moveByOption(newPath);
    }).then(() => {
        res.redirect('/');
    }).catch(e => {
        res.throw(new HttpError(400, 'Error', e));
    })
})

module.exports = router;