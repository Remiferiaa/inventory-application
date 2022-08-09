const Contributor = require('../models/contributor')
const Material = require('../models/material')
const Stage = require('../models/stage')
const {body, validationResult} = require('express-validator')


exports.contributor_list = async (req, res, next) => {
    try {
        const contri = await Contributor.find().exec()
        res.render('contributor_list', { title: 'Contributors', contri })
    } catch (err) {
        return next(err)
    }
}

exports.contributor_detail = async (req, res, next) => {
    try {
        const contributor = Contributor.findById(req.params.id).exec()
        const material = Material.find({ 'addedBy': req.params.id }).sort({ 'name': 1 }).populate('addedBy').exec()
        const stage = Stage.find({ 'addedBy': req.params.id }).sort({ 'name': 1 }).populate('addedBy').exec()
        const [contri, mats, levels] = await Promise.all([contributor, material, stage])
        if (contri === null) {
            const err = new Error('Contributor Not Found')
            err.status = 404
            throw err
        }
        res.render('contributor_detail', { title: 'Contributor Detail', contributor: contri, materials: mats, stages: levels })
    } catch (err) {
        return next(err)
    }
};


exports.contributor_createGet = (req, res, next) => {
    res.render('contributor_form', { title: 'New Contributor' })
}

exports.contributor_createPost = [
    body('name').trim().isLength({ min: 1 }).escape().withMessage("Name can't be empty"),

    (req, res, next) => {
        const errors = validationResult(req)
        const contributor = new Contributor({
            name: req.body.name
        })
        if (!errors.isEmpty()) {
            res.render('contributor_form', { title: 'New Contributor', contributor, error: errors.array() })
            return
        } else {
            Contributor.findOne({ name: req.body.name }, function (err, result) {
                if (err) {
                    return next(err)
                } if (result) {
                    res.redirect('/contributor/' + result._id)
                } else {
                    contributor.save((err) => {
                        if (err) {
                            return next(err)
                        }
                        res.redirect('/contributor')
                    })
                }
            })
        }
    }
]

exports.contributor_deleteGet = async (req, res, next) => {
    try {
        const contributor = Contributor.findById(req.params.id).exec()
        const material = Material.find({ 'addedBy': req.params.id }).sort({ 'name': 1 }).exec()
        const stage = Stage.find({ 'addedBy': req.params.id }).sort({ 'name': 1 }).exec()
        const [contri, mats, levels] = await Promise.all([contributor, material, stage])
        if (contri === null) {
            const err = new Error('Contributor Not Found')
            err.status = 404
            throw err
        }
        res.render('contributor_delete', { title: 'Delete Contributor', contributor: contri, materials: mats, stages: levels })
    } catch (err) {
        return next(err)
    }
}

exports.contributor_deletePost = async (req, res, next) => {
    try {
        const contributor = Contributor.findById(req.body.contributorid).exec()
        const material = Material.find({ 'addedBy': req.body.contributorid }).exec()
        const stage = Stage.find({ 'addedBy': req.body.contributorid }).exec()
        const [contri, mats, levels] = await Promise.all([contributor, material, stage])
        if (mats.length > 0 || levels.length > 0) {
            res.render('contributor_delete', { title: 'Delete Contributor', contributor: contri, materials: mats, stages: levels })
        }
        else {
            Contributor.findByIdAndDelete(req.body.contributorid, function (err, result) {
                if (err) { return next(err) }
                res.redirect('/contributor')
            })
        }
    } catch (err) {
        if (err) { return next(err) }
    }
}
exports.contributor_updateGet = async (req, res, next) => {
    try {
        const contributor = Contributor.findById(req.params.id).exec()
        const material = Material.find({ 'addedBy': req.params.id }).exec()
        const stage = Stage.find({ 'addedBy': req.params.id }).exec()
        const [contri, mats, levels] = await Promise.all([contributor, material, stage])
        if (contri === null) {
            const err = new Error('Contributor Not Found')
            err.status = 404
            throw err
        }
        res.render('contributor_form', { title: 'Update Contributor', contributor: contri, materials: mats, stages: levels })
    } catch (err) {
        return next(err)
    }
}

exports.contributor_updatePost = [
    body('name').trim().isLength({ min: 1 }).escape().withMessage("Name can't be empty"),
    
    (req, res, next) => {
        const errors = validationResult(req)
        const contributor = new Contributor({
            name: req.body.name,
            _id: req.params.id
        })
        if (!errors.isEmpty()) {
            res.render('contributor_form', { title: 'Update Contributor', contributor, error: errors.array() })
            return
        } else {
            Contributor.findOne({ name: req.body.name }, function (err, result) {
                if (err) {
                    return next(err)
                } if (result) {
                    res.redirect('/contributor/' + contributor._id)
                } else {
                    Contributor.findByIdAndUpdate(req.params.id, contributor, {}, function(err, result) {
                        if(err) {return next(err)}
                        res.redirect('/contributor')
                    })
                }
            })
        }
    }
]


