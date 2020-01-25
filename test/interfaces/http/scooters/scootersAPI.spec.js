const { expect, sinon, ResponseStub } = require('../../../specHelper');
const MissingParamsError = require('../../../../src/interfaces/http/errors/MissingParamsError');
const ScooterMongoRepository = require('../../../../src/infrastructure/persistence/mongodb/scooter/ScooterMongoRepository');
const ScooterDataBuilder = require('../../../../src/domain/scooters/ScooterDataBuilder');
const ScootersAPI = require('../../../../src/interfaces/http/scooters/ScootersAPI');
const ScooterSerializer = require('../../../../src/interfaces/http/scooters/ScooterSerializer');

describe('ScootersAPI', () => {
  let scooterRepository;
  let scootersAPI;
  let request;
  let response;
  let scooter;
  let meters;

  beforeEach(() => {
    scooterRepository = sinon.createStubInstance(ScooterMongoRepository);
    scootersAPI = new ScootersAPI({ scooterRepository });

    scooter = new ScooterDataBuilder().build();
    meters = 1000;

    request = {
      query: jsonContaining({ scooter, meters }),
    };
    response = ResponseStub();

    scooterRepository.getAllNear
      .withArgs({ coordinates: scooter.coordinates, meters })
      .returns([scooter]);
  });

  context('throws MissingParamsError if missing', () => {
    it('longitude', async () => {
      request = {
        query: {
          latitude: 'lat',
          meters: 'distance',
        },
      };

      try {
        await scootersAPI.fetch(request, response);
      } catch (error) {
        expect(error).to.be.an.instanceof(MissingParamsError);
      }
    });

    it('latitude', async () => {
      request = {
        query: {
          longitude: 'lng',
          meters: 'distance',
        },
      };

      try {
        await scootersAPI.fetch(request, response);
      } catch (error) {
        expect(error).to.be.an.instanceof(MissingParamsError);
      }
    });

    it('meters', async () => {
      request = {
        query: {
          longitude: 'lng',
          latitude: 'lat',
        },
      };

      try {
        await scootersAPI.fetch(request, response);
      } catch (error) {
        expect(error).to.be.an.instanceof(MissingParamsError);
      }
    });
  });

  it('queries ScooterRepository', async () => {
    await scootersAPI.fetch(request, response);

    expect(scooterRepository.getAllNear).to.have.been.calledWith({
      coordinates: scooter.coordinates,
      meters,
    });
  });

  it('returns array of json representing scooters', async () => {
    const scooters = await scootersAPI.fetch(request, response);

    expect(scooters).to.deep.equal([ScooterSerializer.toJSON(scooter)]);
  });

  function jsonContaining({ scooter, meters }) {
    return {
      longitude: scooter.coordinates.longitude,
      latitude: scooter.coordinates.latitude,
      meters,
    };
  }
});