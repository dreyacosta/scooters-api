const { Router } = require('express');
const respondWith = require('../respondWith');
const ScootersAPI = require('./ScootersAPI');
const ScooterMongoRepository = require('../../../infrastructure/persistence/mongodb/scooter/ScooterMongoRepository');

const scootersAPI = new ScootersAPI({ scooterRepository: new ScooterMongoRepository() });

class ScootersRouter {
  static create() {
    const router = Router();

    router.get('/scooters', respondWith(scootersAPI.fetch.bind(scootersAPI)));

    return router;
  }
}

module.exports = ScootersRouter;