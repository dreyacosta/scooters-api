const ScooterDataBuilder = require('../domain/scooters/ScooterDataBuilder');

class CreateScootersNearby {
  constructor({ scooterMongoRepository }) {
    this.repository = scooterMongoRepository;
  }

  async execute({ longitude, latitude, meters, points }) {
    await this._batchInsert({
      total: points,
      batchSize: 5000,
      iterator: async () => this._createScooterNearby({ longitude, latitude, meters }),
    });
  }

  async _createScooterNearby({ longitude, latitude, meters }) {
    const scooter = await new ScooterDataBuilder()
      .withCoordinatesNear({ longitude, latitude }, meters)
      .build();
    await this.repository.add(scooter);
  }

  async _batchInsert({ total, batchSize, iterator }) {
    const inserts = [];
    const currentBatch = (total - batchSize > 0) ? batchSize : total;

    for (let index = 0; index < currentBatch; index++) {
      inserts.push(iterator());
    }
    await Promise.all(inserts);

    if (currentBatch < batchSize) return;

    await this._batchInsert({
      total: total - currentBatch,
      batchSize,
      iterator,
    });
  }
}

module.exports = CreateScootersNearby;