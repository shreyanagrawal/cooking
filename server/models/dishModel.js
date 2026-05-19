const mongoose = require("mongoose");
const dishSchema = new mongoose.Schema({
    dishName: {type: String, required: true, unique: true},
    dishUploader: {type: String},
    ingredients: {type: String, required: true},
    method: {type: String, required: true},
    tags: {type: String, required: true}
});
const dishModel = mongoose.model("dishes",dishSchema);
module.exports = dishModel;