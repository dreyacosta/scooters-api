const { Schema, model } = require('mongoose');

const locationSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
    index: '2d',
  },
});

const scooterSchema = new Schema({
  _id: String,
  location: {
    type: locationSchema,
    index: '2dsphere',
  },
});

scooterSchema.index({
  location: '2dsphere',
  'location.coordinates': '2d',
});

module.exports = model('Scooter', scooterSchema);