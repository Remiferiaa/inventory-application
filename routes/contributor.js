const express = require('express');
const router = express.Router();

const contributor_controller = require('../controllers/contributorController')


router.get('/', contributor_controller.contributor_list)

router.get('/create', contributor_controller.contributor_createGet)

router.get('/create', contributor_controller.contributor_createPost)

router.get('/:id/delete', contributor_controller.contributor_deleteGet)

router.post('/:id/delete', contributor_controller.contributor_deletePost)

router.get('/:id/update', contributor_controller.contributor_updateGet)

router.post('/:id/update', contributor_controller.contributor_updatePost)

router.get('/:id', contributor_controller.contributor_detail)

module.exports = router