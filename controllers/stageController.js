require('dotenv').config()
const Contributor = require('../models/contributor')
const Material = require('../models/material')
const Stage = require('../models/stage')
const { body, validationResult } = require('express-validator')
const async = require('async')

exports.stage_list = async (req, res, next) => {
    try {
        const stage = await Stage.find().exec()
        res.render('stage_list', { title: 'Stages', stage })
    } catch (err) {
        return next(err)
    }
}

exports.stage_detail = (req, res, next) => {
    async.parallel({
        stage(callback) {
            Stage.findById(req.params.id).populate('addedBy').exec(callback)
        },
        material(callback) {
            Material.find({ 'dropFrom': req.params.id }).exec(callback)
        }
    }, function (err, results) {
        if (err) return next(err)
        if (results.stage === null) {
            const err = new Error('Stage not found');
            err.status = 404;
            return next(err);
        }
        res.render('stage_detail', { title: results.stage.name, stage: results.stage, material: results.material })
    })
};


exports.stage_createGet = (req, res, next) => {
    async.parallel({
        stages(callback) {
            Stage.find(callback)
        },
        contri(callback) {
            Contributor.find(callback)
        }
    }, function (err, result) {
        if (err) return next(err)
        res.render('stage_form', { title: 'New Stage', stages: result.stages, contributors: result.contri })
    })
}


exports.stage_createPost = [

    body('name').trim().isLength({ min: 1 }).withMessage("Name can't be empty"),
    body('descrip').trim().isLength({ min: 1 }).withMessage("Description can't be empty"),
    body('sanity').trim().isLength({ min: 1 }).withMessage("Sanity field can't be empty").isNumeric().withMessage('Sanity field must be number'),
    body('pic').optional({ checkFalsy: true }),
    body('addedBy.*').escape(),

    (req, res, next) => {
        const errors = validationResult(req)
        const stage = new Stage({
            name: req.body.name,
            descrip: req.body.descrip,
            sanity: req.body.sanity,
            pic: req.body.pic,
            addedBy: req.body.addedBy
        })
        if (!errors.isEmpty()) {
            async.parallel({
                stages(callback) {
                    Stage.find(callback)
                },
                contri(callback) {
                    Contributor.find(callback)
                }
            }, function (err, results) {
                if (err) return next(err)
                res.render('stage_form', { title: 'New Stage', stages: results.stages, contributors: results.contri, error: errors.array() })
                return
            })
        } else {
            Stage.findOne({ name: req.body.name }, function (err, result) {
                if (err) {
                    return next(err)
                } if (result) {
                    res.redirect('/stage/' + result._id)
                } else {
                    stage.save((err) => {
                        if (err) {
                            return next(err)
                        }
                        res.redirect('/stage')
                    })
                }
            })
        }
    }
]

exports.stage_deleteGet = (req, res, next) => {
    Stage
        .findById(req.params.id)
        .populate('addedBy')
        .exec(function (err, results) {
            if (err) return next(err)
            if (results === null) {
                const err = new Error('Stage not found')
                err.status = 404
                return next(err)
            }
            res.render('stage_delete', { title: 'Delete Stage', stage: results })
        })
}

exports.stage_deletePost = [
    body('pw').trim().isLength({ min: 1 }).escape().withMessage("Password can't be empty").equals(process.env.pw).withMessage('Wrong Password'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            Stage
                .findById(req.params.id)
                .populate('addedBy')
                .exec(function (err, results) {
                    if (err) return next(err)
                    if (results === null) {
                        const err = new Error('Stage not found')
                        err.status = 404
                        return next(err)
                    }
                    res.render('stage_delete', { title: 'Delete Stage', stage: results, error: errors.array() })
                })
        }
        else {
            Stage.findByIdAndDelete(req.body.stageid, function (err, result) {
                if (err) { return next(err) }
                res.redirect('/stage/')
            })
        }
    }
]

exports.stage_updateGet = (req, res, next) => {
    async.parallel({
        stage(callback) {
            Stage.findById(req.params.id).populate('addedBy').exec(callback)
        },
        contributor(callback) {
            Contributor.find(callback)
        }
    }, function (err, results) {
        if (err) return next(err)
        if (results.stage === null) {
            const err = new Error('Stage not found')
            err.status = 404
            return next(err)
        }
        res.render('stage_form', { title: 'Update Stage', stage: results.stage, contributors: results.contributor, pw: true })
    })
}

exports.stage_updatePost = [

    body('name').trim().isLength({ min: 1 }).withMessage("Name can't be empty"),
    body('descrip').trim().isLength({ min: 1 }).withMessage("Description can't be empty"),
    body('sanity').trim().isLength({ min: 1 }).withMessage("Sanity field can't be empty").isNumeric().withMessage('Sanity field must be number'),
    body('pic').optional({ checkFalsy: true }),
    body('addedBy.*').escape(),
    body('pw').trim().isLength({ min: 1 }).escape().withMessage("Password can't be empty").equals(process.env.pw).withMessage('Wrong Password'),

    (req, res, next) => {
        const errors = validationResult(req)
        const stage = new Stage({
            name: req.body.name,
            descrip: req.body.descrip,
            sanity: req.body.sanity,
            pic: req.body.pic,
            addedBy: req.body.addedBy,
            _id: req.params.id
        })
        if (!errors.isEmpty()) {
            async.parallel({
                stages(callback) {
                    Stage.findById(req.params.id).populate('addedBy').exec(callback)
                },
                contri(callback) {
                    Contributor.find(callback)
                }
            }, function (err, results) {
                if (err) return next(err)
                res.render('stage_form', { title: 'Update Stage', stage: stage, contributors: results.contri, pw: true, error: errors.array() })
                return
            })
        } else {
            Stage.findOne({ name: req.body.name }, function (err, result) {
                if (err) {
                    return next(err)
                } if (result && result._id.toString() != stage._id) {
                    res.redirect('/stage/' + result._id)
                } else {
                    Stage.findByIdAndUpdate(req.params.id, stage, {}, function (err, result) {
                        if (err) { return next(err) }
                        res.redirect('/stage')
                    })
                }
            })
        }
    }
]


