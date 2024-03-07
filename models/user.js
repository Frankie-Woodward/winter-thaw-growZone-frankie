const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config()

const plantSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
  common_name: { type: String, required: true },
  scientific_name: { type: String, required: true },
  other_name: { type: String },
  watering: { type: String },
  depth_water_requirement: { type: Number },
  care_level: { type: String },
  sunlight: { type: String },
  soil: { type: String },
  drought_tolerant: { type: Boolean },
  maintenance: { type: String },
  pest_susceptibility: { type: String },
  flowering_season: { type: String },
  default_image: { type: String },
  description: { type: String },
  poisonous_to_humans: { type: Boolean },
  poisonous_to_pets: { type: Boolean }
});

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        minLength: 3,
        required: true
    },
    zipcode: {
        type: Number,
        required: true
    },
    myplants: [plantSchema],
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            return ret;
        }
    }
});



module.exports = mongoose.model('User', userSchema);