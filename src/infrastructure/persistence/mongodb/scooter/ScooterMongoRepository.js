const ScooterMongoMapper = require('./ScooterMongoMapper');
const ScooterMongoModel = require('./ScooterMongoModel');

class ScooterMongoRepository {
  constructor() {
    this.ScooterMongoModel = ScooterMongoModel;
  }

  async add(scooter) {
    await this.ScooterMongoModel.create(ScooterMongoMapper.toDatabase(scooter));
  }

  async getAll() {
    const scooters = await this.ScooterMongoModel.find().lean();
    return scooters.map(ScooterMongoMapper.toEntity);
  }

  async getAllNear({ coordinates, meters }) {
    const scooters = await this.ScooterMongoModel.find({
      location: {
        $nearSphere: {
          $maxDistance: meters,
          $geometry: {
            type: 'Point',
            coordinates: [
              coordinates.longitude,
              coordinates.latitude,
            ],
          },
        }
      },
    }).lean();

    return scooters.map(ScooterMongoMapper.toEntity);
  }
}

module.exports = ScooterMongoRepository;