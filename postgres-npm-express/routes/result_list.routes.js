const ROUTER = require('express')
const router = new ROUTER()
const result_list_controller = require('../controller/result_list.controller')

router.post('/result_list', result_list_controller.create)
router.get('/result_list', result_list_controller.get_all)
router.get('/result_list/id/:id', result_list_controller.get_one)
router.get('/result_list/final', result_list_controller.get_final_list)

router.get('/result_list/max_marks', result_list_controller.get_marks)
router.get('/result_list/marks/:subject_id/:group_id', result_list_controller.get_marks_by_group_subject)
router.put('/result_list/:id/:column/:parameter', result_list_controller.update_parameter)
router.delete('/result_list/:id', result_list_controller.del_one)

module.exports = router