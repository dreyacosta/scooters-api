const { request } = require('../../../specHelper');
const MongoDatabase = require('../../../../src/infrastructure/persistence/mongodb/MongoDatabase');
const ScooterMongoDataBuilder = require('../../../../src/infrastructure/persistence/mongodb/scooter/ScooterMongoDataBuilder');
const ScooterSerializer = require('../../../../src/interfaces/http/scooters/ScooterSerializer');

describe('GET /api/v1/scooters', () => {
  const mongo = new MongoDatabase();
  const SINGAPORE_TEKKA_CENTER = {
    longitude: 103.850648,
    latitude: 1.306251,
  };
  const RADIUS_FROM_TEKKA = 100;

  before(async () => mongo.start());
  beforeEach(async () => mongo.clean());
  after(async () => mongo.drop());
  after(async () => mongo.close());

  context('when get scooters missing query params', () => {
    it('returns 422 status code', async () => {
      await request()
        .get('/api/v1/scooters')
        .expect('Content-Type', /json/)
        .expect(422);
    });
  });

  context('given no scooters', () => {
    context('when get scooters', () => {
      it('returns no scooters', async () => {
        await request()
          .get('/api/v1/scooters')
          .query({ ...SINGAPORE_TEKKA_CENTER, meters: RADIUS_FROM_TEKKA })
          .expect('Content-Type', /json/)
          .expect(200, []);
      });
    });
  });

  context('given scooters', () => {
    context('when get scooters', () => {
      it('returns all the scooters', async () => {
        const scooter = await new ScooterMongoDataBuilder()
          .withCoordinatesNear(SINGAPORE_TEKKA_CENTER, RADIUS_FROM_TEKKA)
          .insert();

        await request()
          .get('/api/v1/scooters')
          .query({ ...SINGAPORE_TEKKA_CENTER, meters: RADIUS_FROM_TEKKA + 5000 })
          .expect('Content-Type', /json/)
          .expect(200, [ScooterSerializer.toJSON(scooter)]);
      });
    });
  });
});