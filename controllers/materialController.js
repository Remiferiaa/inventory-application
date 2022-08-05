const Contributor = require('../models/contributor')
const Material = require('../models/material')
const Stage = require('../models/stage')
const {body, validationResult} = require('express-validator')
const async = require('async')

exports.material_list = async (req, res, next) => {
    try {
        const mats = await Material.find().exec()
        res.render('material_list', { title: 'Materials', mats })
    } catch (err) {
        return next(err)
    }
}

exports.material_detail = (req, res, next) => {
    Material
    .findById(req.params.id)
    .populate('dropFrom')
    .populate('addedBy')
    .exec(function(err, mat) {
        if(err) return next(err)
        if(mat === null) {
            const err = new Error('Material not found');
            err.status = 404;
            return next(err);
        }
        res.render('material_detail', {title: mat.name, material: mat})
    })

};


exports.material_createGet = (req, res, next) => {
    async.parallel({
        stages(callback) {
            Stage.find(callback)
        },
        contri(callback) {
            Contributor.find(callback)
        }
    }, function(err, result) {
        if(err) return next(err)
        res.render('material_form', { title: 'New Material', Stages: result.stages, Contributors: result.contri })
    })
}


exports.material_createPost = [
    (req, res, next) => {
        if(!(Array.isArray(req.body.dropFrom))){
            if(typeof req.body.dropFrom ==='undefined')
            req.body.dropFrom = [];
            else
            req.body.dropFrom = [req.body.dropFrom];
        }
        next();
    },

    body('name').trim().isLength({ min: 1 }).escape().withMessage("Name can't be empty"),
    body('usage').trim().isLength({ min: 1 }).escape().withMessage("Usage can't be empty"),
    body('descrip').trim().isLength({ min: 1 }).escape().withMessage("Description can't be empty"),
    body('pic').optional({ checkFalsy: true }).escape(),
    body('addedBy.*').escape(),
    body('dropFrom.*').optional({checkFalsy: true}).escape(),

    (req, res, next) => {
        const errors = validationResult(req)
        const material = new Material({
            name: req.body.name,
            usage: req.body.usage,
            descrip: req.body.descrip,
            pic: req.body.pic,
            dropFrom: req.body.dropFrom,
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
            }, function(err, results) {
                if(err) return next(err)
                for(let i = 0; i<= results.stages.length; i++) {
                    if (material.dropFrom.indexOf(results.dropFrom[i]._id) > -1) {
                        results.dropFrom[i].checked='true';
                    }
                }
                res.render('material_form', { title: 'New Material', material: material, Stages: results.stages, Contributors: results.contri })
                return
            })

        } else {
            Material.findOne({ name: req.body.name }, function (err, result) {
                if (err) {
                    return next(err)
                } if (result) {
                    res.redirect('/material/' + result._id)
                } else {
                    material.save((err) => {
                        if (err) {
                            return next(err)
                        }
                        res.redirect('/material')
                    })
                }
            })
        }
    }
]

exports.material_deleteGet = async (req, res, next) => {
    Material
    .findById(req.params.id)
    .populate('dropFrom')
    .populate('addedBy')
    .exec(function(err, results) {
        if(err) return next(err) 
        if(results === null ) {
            const err = new Error('Material not found')
            err.status = 404
            return next(err)
        }
        res.render('material_delete', { title: 'Delete Material', material: results })
    })
}

exports.material_deletePost = async (req, res, next) => {
    Material.findByIdAndDelete(req.params.id, function (err, result) {
       if (err) { return next(err) }
       res.redirect('/material')
    })
}

exports.material_updateGet = async (req, res, next) => {
    async.parallel({
        material(callback) {
            Material.findById(req.params.id).populate('dropFrom').populate('addedBy').exec(callback)
        },
        stage(callback) {
            Stage.find(callback)
        },
        contributor(callback) {
            Contributor.find(callback)
        }
    }, function(err, results) {
        if(err) return next(err) 
        if(results.material === null ) {
            const err = new Error('Material not found')
            err.status = 404
            return next(err)
        }
        res.render('material_form', { title: 'Update Material', material: results.material, stages: results.stage, contributors: results.contributor })
    })
}

exports.material_updatePost = [
    (req, res, next) => {
        if(!(Array.isArray(req.body.dropFrom))){
            if(typeof req.body.dropFrom ==='undefined')
            req.body.dropFrom = [];
            else
            req.body.dropFrom = [req.body.dropFrom];
        }
        next();
    },
    body('name').trim().isLength({ min: 1 }).escape().withMessage("Name can't be empty"),
    body('usage').trim().isLength({ min: 1 }).escape().withMessage("Usage can't be empty"),
    body('descrip').trim().isLength({ min: 1 }).escape().withMessage("Description can't be empty"),
    body('pic').optional({ checkFalsy: true }).escape(),
    body('addedBy.*').escape(),
    body('dropFrom.*').optional({checkFalsy: true}).escape(),

    (req, res, next) => {
        const errors = validationResult(req)
        const material = new Material({
            name: req.body.name,
            usage: req.body.usage,
            descrip: req.body.descrip,
            pic: req.body.pic,
            dropFrom: req.body.dropFrom,
            addedBy: req.body.addedBy,
            _id: req.params.id
        })
        if (!errors.isEmpty()) {
            async.parallel({
                stages(callback) {
                    Stage.find(callback)
                },
                contri(callback) {
                    Contributor.find(callback)
                }
            }, function(err, results) {
                if(err) return next(err)
                for(let i = 0; i<= results.stages.length; i++) {
                    if (material.dropFrom.indexOf(results.dropFrom[i]._id) > -1) {
                        results.dropFrom[i].checked='true';
                    }
                }
                res.render('material_form', { title: 'Update Material', material: material, Stages: results.stages, Contributors: results.contri })
                return
            })
        } else {
            Material.findOne({ name: req.body.name }, function (err, result) {
                if (err) {
                    return next(err)
                } if (result) {
                    res.redirect('/material/' + material._id) 
                } else {
                    Material.findByIdAndUpdate(req.params.id, material, {}, function(err, result) {
                        if(err) {return next(err)}
                        res.redirect('/material')
                    })
                }
            })
        }
    }
]


