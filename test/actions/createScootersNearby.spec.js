const { expect } = require('../specHelper');
const MongoDatabase = require('../../src/infrastructure/persistence/mongodb/MongoDatabase');
const ScooterMongoRepository = require('../../src/infrastructure/persistence/mongodb/scooter/ScooterMongoRepository');
const ScooterMongoDataBuilder = require('../../src/infrastructure/persistence/mongodb/scooter/ScooterMongoDataBuilder');
const Coordinates = require('../../src/domain/scooters/Coordinates');
const CreateScootersNearby = require('../../src/actions/CreateScootersNearby');

describe('CreateScootersNearby', () => {
  const mongo = new MongoDatabase();
  const SINGAPORE_TEKKA_CENTER = {
    longitude: 103.850648,
    latitude: 1.306251,
  };
  const RADIUS_FROM_TEKKA_CENTER = 500;
  const NUMBER_OF_POINTS_TO_CREATE = 100;

  let scooterMongoRepository;
  let createScootersNearby;

  before(async () => mongo.start());
  beforeEach(async () => mongo.clean());
  after(async () => mongo.drop());
  after(async () => mongo.close());

  beforeEach(() => {
    scooterMongoRepository = new ScooterMongoRepository();
    createScootersNearby = new CreateScootersNearby({ scooterMongoRepository });
  });

  context('given no scooters', () => {
    context('when creates specific numbers of scooters nearby specific coordinates', () => {
      it('ScooterRepository contains the given number of scooters', async () => {
        await createScootersNearby.execute({
          longitude: SINGAPORE_TEKKA_CENTER.longitude,
          latitude: SINGAPORE_TEKKA_CENTER.latitude,
          meters: RADIUS_FROM_TEKKA_CENTER,
          points: NUMBER_OF_POINTS_TO_CREATE,
        });

        const expectedScooters = await scooterMongoRepository.getAllNear({
          coordinates: new Coordinates(SINGAPORE_TEKKA_CENTER),
          meters: RADIUS_FROM_TEKKA_CENTER + 5000,
        });
        expect(expectedScooters.length).to.deep.equal(NUMBER_OF_POINTS_TO_CREATE);
      });
    });
  });
});