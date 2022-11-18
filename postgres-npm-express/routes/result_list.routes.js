const ROUTER = require('express')
const router = new ROUTER()
const result_list_controller = require('../controller/result_list.controller')

router.post('/result_list', result_list_controller.create_result_list)
router.get('/result_list', result_list_controller.get_result_lists)
router.get('/result_list/:id', result_list_controller.get_result_list)
router.put('/result_list/:id/:column/:parameter', result_list_controller.upd_result_list_parameter)
router.delete('/result_list/:id', result_list_controller.del_result_list)

module.exports = router