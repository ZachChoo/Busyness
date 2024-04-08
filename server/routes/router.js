const express = require('express')
const controller = require('../controllers/controller')
const router = express.Router()

router.get("/is_authenticated", controller.is_authenticated)
router.post("/get_token", controller.get_token)

//editing buildings
router.post('/create_building', controller.protect, controller.createBuilding)
router.put('/update_building/', controller.protect, controller.updateBuilding)
router.delete('/delete_building/', controller.protect, controller.deleteBuilding)
router.get('/get_building/', controller.getBuildingById)
router.get('/get_all_buildings', controller.getBuildings)
router.get('/get_all_rooms_in_all_buildings', controller.getAllRoomsInAllBuildings)

//rooms
router.put('/create_room', controller.protect, controller.createRoom)
router.put('/update_room', controller.updateRoom)
router.delete('/delete_room', controller.protect, controller.deleteRoom)
router.get('/get_all_rooms', controller.getRooms)
router.get('/get_room', controller.getRoomById)

router.get('/get_past_busyness', controller.getPastBusyness)
router.get('/get_past_busyness_of_room', controller.getPastBusynessOfRoom)




module.exports = router