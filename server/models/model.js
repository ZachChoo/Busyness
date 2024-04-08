const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Building = new Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        rooms: [{ 
            roomName: { type: String, required: true },
            closingTime: { type: String, required: true }, 
            busyness: { type: Number, required: true },
            building: { type: Schema.ObjectId, required: true },
            maxCapacity: { type: Number, required: true },
            deviceCount: { type: Number, required: true }
        }]
    }
)

module.exports = mongoose.model('buildings', Building)