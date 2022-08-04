const Contributor = require('../models/contributor')
const Material = require('../models/material')
const Stage = require('../models/stage')
const {body, validationResult} = require('express-validator')


export const contributor_list = async (req, res, next) => {
    try {
        const contri = await Contributor.find().exec()
        res.render('contributor_list', { contri })
    } catch (err) {
        return next(err)
    }
}

export const contributor_detail = async (req, res, next) => {
    try {
        const contributor = Contributor.findById(req.params.id).exec()
        const material = Material.find({ 'addedBy': req.params.id }).sort({ 'name': 1 }).exec()
        const stage = Stage.find({ 'addedBy': req.params.id }).sort({ 'name': 1 }).exec()
        const [contri, mats, levels] = await Promise.all([contributor(), material(), stage()])
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


export function contributor_createGet(req, res, next) {
    res.render('contributor_form', { title: 'New Contributor' })
}

export const contributor_createPost = [
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
                    res.redirect(result.url)
                } else {
                    contributor.save((err) => {
                        if (err) {
                            return next(err)
                        }
                        res.redirect('/')
                    })
                }
            })
        }
    }
]

export const contributor_deleteGet = async (req, res, next) => {
    try {
        const contributor = Contributor.findById(req.params.id).exec()
        const material = Material.find({ 'addedBy': req.params.id }).sort({ 'name': 1 }).exec()
        const stage = Stage.find({ 'addedBy': req.params.id }).sort({ 'name': 1 }).exec()
        const [contri, mats, levels] = await Promise.all([contributor(), material(), stage()])
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

export const contributor_deletePost = async (req, res, next) => {
    try {
        const contributor = Contributor.findById(req.params.id).exec()
        const material = Material.find({ 'addedBy': req.params.id }).exec()
        const stage = Stage.find({ 'addedBy': req.params.id }).exec()
        const [contri, mats, levels] = await Promise.all([contributor(), material(), stage()])
        if (results.mats > 0 || results.levels > 0) {
            res.render('contributor_delete', { title: 'Delete Contributor', contributor: contri, materials: mats, stages: levels })
        }
        else {
            Contributor.findByIdAndDelete(req.params.id, function (err, result) {
                if (err) { return next(err) }
                else res.redirect('/')
            })
        }
    } catch (err) {
        if (err) { return next(err) }
    }
}
export const contributor_updateGet = async (req, res, next) => {
    try {
        const contributor = Contributor.findById(req.params.id).exec()
        const material = Material.find({ 'addedBy': req.params.id }).exec()
        const stage = Stage.find({ 'addedBy': req.params.id }).exec()
        const [contri, mats, levels] = await Promise.all([contributor(), material(), stage()])
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

export const contributor_updatePost = [
    body('name').trim().isLength({ min: 1 }).escape().withMessage("Name can't be empty"),

    (req, res, next) => {
        const errors = validationResult(req)
        const contributor = new Contributor({
            name: req.body.name
        })
        if (!errors.isEmpty()) {
            res.render('contributor_form', { title: 'Update Contributor', contributor, error: errors.array() })
            return
        } else {
            Contributor.findOne({ name: req.body.name }, function (err, result) {
                if (err) {
                    return next(err)
                } if (result) {
                    res.redirect(result.url)
                } else {
                    Contributor.findByIdAndUpdate(req.params.id, contributor, {}, function(err, result) {
                        if(err) {return next(err)}
                        res.redirect('/')
                    })
                }
            })
        }
    }
]


