const ScooterDataBuilder = require('../../../../domain/scooters/ScooterDataBuilder');
const ScooterMongoModel = require('./ScooterMongoModel');
const ScooterMongoMapper = require('./ScooterMongoMapper');

class ScooterMongoDataBuilder extends ScooterDataBuilder {
  constructor() {
    super();
    this.MongoModel = ScooterMongoModel;
    this.MongoMapper = ScooterMongoMapper;
  }

  async insert() {
    const domainObject = this.build();
    await this.MongoModel.create(this.MongoMapper.toDatabase(domainObject));
    return domainObject;
  }
}

module.exports = ScooterMongoDataBuilder;