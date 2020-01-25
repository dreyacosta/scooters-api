const ScooterSerializer = {
  toJSON(scooter) {
    return {
      id: scooter.id,
      coordinates: {
        lng: scooter.coordinates.longitude,
        lat: scooter.coordinates.latitude,
      },
    };
  },
};

module.exports = ScooterSerializer;