var express = require('express');
var router = express.Router();
const Todo = require('../models/todo')

/* GET home page. */
router.get('/', function (req, res, next) {
    Todo.find({}).then((data) => {
        res.status(200).json({
            error: false,
            data
        })
    }).catch(() => {
        res.status(500).json({
            error: true,
            message: err
        })
    })
});

router.post('/', function (req, res, next) {
    Todo.create({ task: req.body.task }).then((data) => {
        res.status(201).json({
            error: false,
            data
        })
    }).catch(() => {
        res.status(500).json({
            error: true,
            message: err
        })
    })
});

router.put('/:id', function (req, res, next) {
    Todo.findByIdAndUpdate(req.params.id,
        {
            task: req.body.task,
            complete: JSON.parse(req.body.complete)
        },
        {
            new: true
        })
        .then((data) => {
            res.status(201).json({
                error: false,
                data
            })
        }).catch(() => {
            res.status(500).json({
                error: true,
                message: err
            })
        })
});

router.delete('/:id', function (req, res, next) {
    Todo.findByIdAndRemove(req.params.id)
        .then((data) => {
            res.status(201).json({
                error: false,
                data
            })
        }).catch(() => {
            res.status(500).json({
                error: true,
                message: err
            })
        })
});

module.exports = router;
