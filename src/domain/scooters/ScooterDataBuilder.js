const Scooter = require('./Scooter');
const Coordinates = require('./Coordinates');
const Uuid = require('../shared/Uuid');

const SINGAPORE_TEKKA_CENTER_LONG = 103.850648;
const SINGAPORE_TEKKA_CENTER_LAT = 1.306251;

class ScooterMongoDataBuilder {
  constructor() {
    this.attributes = {
      id: Uuid.random(),
      coordinates: {
        longitude: SINGAPORE_TEKKA_CENTER_LONG,
        latitude: SINGAPORE_TEKKA_CENTER_LAT,
      },
    };
  }

  withCoordinatesNear({ longitude, latitude }, meters) {
    this.attributes.coordinates = generateNearCoordinates({
      longitude,
      latitude,
    }, meters);

    return this;
  }

  build() {
    return new Scooter({
      id: this.attributes.id,
      coordinates: new Coordinates(this.attributes.coordinates),
    });
  }
}

function generateNearCoordinates({ longitude, latitude }, radius) {
  const x0 = longitude;
  const y0 = latitude;

  const rd = radius / 111300;

  const u = Math.random();
  const v = Math.random();

  const w = rd * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  const xp = x / Math.cos(y0);

  return {
    longitude: xp + x0,
    latitude: y + y0,
  };
}

module.exports = ScooterMongoDataBuilder;