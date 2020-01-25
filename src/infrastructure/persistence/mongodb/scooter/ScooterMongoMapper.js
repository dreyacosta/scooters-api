const Scooter = require('../../../../domain/scooters/Scooter');
const Coordinates = require('../../../../domain/scooters/Coordinates');

const ScooterMongoMapper = {
  toEntity(scooter) {
    const { _id, location } = scooter;

    return new Scooter({
      id: _id,
      coordinates: new Coordinates({
        longitude: location.coordinates[0],
        latitude: location.coordinates[1],
      }),
    });
  },

  toDatabase(scooter) {
    const { id, coordinates } = scooter;

    return {
      _id: id,
      location: {
        type: 'Point',
        coordinates: [
          coordinates.longitude,
          coordinates.latitude,
        ],
      },
    };
  },
};

module.exports = ScooterMongoMapper;