"use strict";

const Router = require('express').Router;
const CommentService = require('../services/comment');
const { authMiddleware } = require('../services/auth');
const router = module.exports = new Router();

router.get(
    '/api/comment-lists/:listId', 
    (req, res) => {
        const {listId} = req.params;
        CommentService.findByListId(listId).then(data => {
            res.json(data);
        }).catch(err => {
            res.throw(err);
        })
    }
);

router.post(
    '/api/comment-lists/:listId/comments',
    authMiddleware,
    (req, res) => {
        const {listId} = req.params;
        const comment = req.body;
        comment.uid = req.user.uid;
        CommentService.create(listId, comment).then(() => {
            res.json({
                success: true,
            });
        }).catch(err => {
            res.throw(err);
        })
    }
);

