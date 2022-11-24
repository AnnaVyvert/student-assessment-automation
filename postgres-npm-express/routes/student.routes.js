const ROUTER = require('express')
const router = new ROUTER()
const student_controller = require('../controller/student.controller')

router.post('/student', student_controller.create)
router.get('/students', student_controller.get_all)
router.get('/student/group_id/:id', student_controller.get_by_group)
router.get('/student/id/:id', student_controller.get_one)
router.put('/student/:id/:column/:parameter', student_controller.update_parameter)
router.delete('/student/:id', student_controller.del_one)

module.exports = router