const express = require('express');
const router = express.Router();

const material_controller = require('../controllers/materialController')


router.get('/', material_controller.material_list)

router.get('/create', material_controller.material_createGet)

router.post('/create', material_controller.material_createPost)

router.get('/:id/delete', material_controller.material_deleteGet)

router.post('/:id/delete', material_controller.material_deletePost)

router.get('/:id/update', material_controller.material_updateGet)

router.post('/:id/update', material_controller.material_updatePost)

router.get('/:id', material_controller.material_detail)

module.exports = router