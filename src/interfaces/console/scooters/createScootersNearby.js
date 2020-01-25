#!/usr/bin/env node

require('dotenv').config();

const MongoDatabase = require('../../../infrastructure/persistence/mongodb/MongoDatabase');
const CreaterScootersNearby = require('../../../actions/CreateScootersNearby');
const ScooterMongoRepository = require('../../../infrastructure/persistence/mongodb/scooter/ScooterMongoRepository');

const mongo = new MongoDatabase();
const scooterMongoRepository = new ScooterMongoRepository();
const createScootersNearby = new CreaterScootersNearby({ scooterMongoRepository });

const { longitude, latitude, meters, points } = require('yargs')
    .usage('Usage: $0 --longitude [num] --latitude [num] --meters [num] --points [num]')
    .demandOption(['longitude','latitude', 'meters', 'points'])
    .argv;

mongo.start()
  .then(() => createScootersNearby.execute({ longitude, latitude, meters, points }))
  .then(() => mongo.close())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
