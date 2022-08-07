const express = require('express');
const router = express.Router();

const stage_controller = require('../controllers/stageController')


router.get('/', stage_controller.stage_list)

router.get('/create', stage_controller.stage_createGet)

router.post('/create', stage_controller.stage_createPost)

router.get('/:id/delete', stage_controller.stage_deleteGet)

router.post('/:id/delete', stage_controller.stage_deletePost)

router.get('/:id/update', stage_controller.stage_updateGet)

router.post('/:id/update', stage_controller.stage_updatePost)

router.get('/:id', stage_controller.stage_detail)

module.exports = router