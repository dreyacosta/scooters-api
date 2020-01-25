const mongoose = require('mongoose');

class MongoDatabase {
  constructor() {
    this.name = process.env.APP_ENV === 'test' ? 'scooters_test' : process.env.MONGO_DB_NAME;
    this.db = mongoose;
  }

  async start() {
    await this.db.connect(`mongodb://${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${this.name}`, {
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    await this._createCollections();
  }

  async clean() {
    await this._removeCollections();
  }

  async drop() {
    await this.db.connection.db.dropDatabase();
  }

  async close() {
    await this.db.connection.close();
  }

  async _createCollections() {
    const models = Object.keys(this.db.models);
    for (let index = 0; index < models.length; index++) {
      const modelName = models[index];
      const model = this.db.models[modelName];
      await model.createCollection();
    }
  }

  async _removeCollections() {
    const models = Object.keys(this.db.models);
    for (let index = 0; index < models.length; index++) {
      const modelName = models[index];
      const model = this.db.models[modelName];
      await model.deleteMany();
    }
  }
}

module.exports = MongoDatabase;