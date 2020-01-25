const { expect } = require('../../../../specHelper');
const MongoDatabase = require('../../../../../src/infrastructure/persistence/mongodb/MongoDatabase');
const ScooterDataBuilder = require('../../../../../src/domain/scooters/ScooterDataBuilder');
const ScooterMongoDataBuilder = require('../../../../../src/infrastructure/persistence/mongodb/scooter/ScooterMongoDataBuilder');
const ScooterRepository = require('../../../../../src/infrastructure/persistence/mongodb/scooter/ScooterMongoRepository');
const Coordinates = require('../../../../../src/domain/scooters/Coordinates');

describe('ScooterMongoRepository', () => {
  const mongo = new MongoDatabase();
  const scooterRepository = new ScooterRepository();

  before(async () => mongo.start());
  beforeEach(async () => mongo.clean());
  after(async () => mongo.drop());
  after(async () => mongo.close());

  context('given no scooters', () => {
    const meters = 500;
    let scooter;

    beforeEach(async () => mongo.clean());
    beforeEach(() => {
      scooter = new ScooterDataBuilder().build();
    });

    context('when add a new scooter', () => {
      beforeEach(async () => scooterRepository.add(scooter));

      it('returns the scooter', async () => {
        const scooters = await scooterRepository.getAllNear({
          coordinates: scooter.coordinates,
          meters,
        });

        expect(scooters).to.deep.equal([scooter]);
      });
    });

    context('when query for near scooters', () => {
      it('returns no scooters', async () => {
        const scooters = await scooterRepository.getAllNear({
          coordinates: scooter.coordinates,
          meters,
        });

        expect(scooters).to.deep.equal([]);
      });
    });
  });

  context('given scooters within a radius', () => {
    const SINGAPORE_TEKKA_CENTER = {
      longitude: 103.850648,
      latitude: 1.306251,
    };
    const RADIUS_FROM_TEKKA_CENTER = 500;

    let scooterOne;
    let scooterTwo;

    beforeEach(async () => {
      scooterOne = await new ScooterMongoDataBuilder()
        .withCoordinatesNear(SINGAPORE_TEKKA_CENTER, RADIUS_FROM_TEKKA_CENTER)
        .insert();

      scooterTwo = await new ScooterMongoDataBuilder()
        .withCoordinatesNear(SINGAPORE_TEKKA_CENTER, RADIUS_FROM_TEKKA_CENTER)
        .insert();
    });

    context('when query for near scooters inside the given radius', () => {
      it('returns all given scooters', async () => {
        const insideRadius = RADIUS_FROM_TEKKA_CENTER + 5000;
        const scooters = await scooterRepository.getAllNear({
          coordinates: new Coordinates(SINGAPORE_TEKKA_CENTER),
          meters: insideRadius,
        });

        expect(scooters).to.deep.equalInAnyOrder([scooterOne, scooterTwo]);
      });
    });

    context('when query for near scooters outside the given radius', () => {
      it('returns no scooters', async () => {
        const outsideRadius = 0;
        const scooters = await scooterRepository.getAllNear({
          coordinates: new Coordinates(SINGAPORE_TEKKA_CENTER),
          meters: outsideRadius,
        });

        expect(scooters).to.deep.equalInAnyOrder([]);
      });
    });
  });
});