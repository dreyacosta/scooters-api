const MissingParamsError = require('../errors/MissingParamsError');
const Coordinates = require('../../../domain/scooters/Coordinates');
const ScooterSerializer = require('./ScooterSerializer');

class ScootersAPI {
  constructor({ scooterRepository }) {
    this.repository = scooterRepository;
  }

  async fetch(request, response) {
    if (!request.query.longitude || !request.query.latitude || !request.query.meters) {
      throw new MissingParamsError('Required params: longitude, latitude, meters.');
    }

    const coordinates = this._coordinatesFrom(request);
    const meters = this._metersFrom(request);

    const scooters = await this.repository.getAllNear({ coordinates, meters });

    return scooters.map(ScooterSerializer.toJSON);
  }

  _coordinatesFrom(request) {
    const { longitude, latitude } = request.query;
    return new Coordinates({
      longitude,
      latitude,
    });
  }

  _metersFrom(request) {
    const { meters } = request.query;
    return meters;
  }
}

module.exports = ScootersAPI;