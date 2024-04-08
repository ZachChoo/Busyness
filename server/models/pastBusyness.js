const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PastBusyness = new Schema(
    {
        createdAt: { type: Date, default: Date.now },
        roomId: { type: Schema.ObjectId, required: true },
        date: { type: Number },
        currBusyness: { type: Number, required: true}
    }
)

PastBusyness.index({ createdAt: 1 }, { expireAfterSeconds: 60*60*24*7 });

module.exports = mongoose.model('pastBusyness', PastBusyness)