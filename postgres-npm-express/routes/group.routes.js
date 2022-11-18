const ROUTER = require('express')
const router = new ROUTER()
const group_controller = require('../controller/group.controller')

router.post('/group', group_controller.create)
router.get('/groups', group_controller.get_all)
router.get('/group/:id', group_controller.get_one)
router.put('/group/:id/:column/:parameter', group_controller.update_parameter)
router.delete('/group/:id', group_controller.del_one)

module.exports = router