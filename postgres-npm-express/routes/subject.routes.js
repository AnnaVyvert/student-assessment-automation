const ROUTER = require('express')
const router = new ROUTER()
const subject_controller = require('../controller/subject.controller')

router.post('/subject', subject_controller.create)
router.get('/subjects', subject_controller.get_all)
router.get('/subject/:id', subject_controller.get_one)
router.put('/subject/:id/:column/:parameter', subject_controller.update_parameter)
router.delete('/subject/:id', subject_controller.del_one)

module.exports = router