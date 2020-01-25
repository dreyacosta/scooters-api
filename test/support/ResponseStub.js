const sinon = require('sinon');

function ResponseStub() {
  const response = {
    json: sinon.spy(),
  };

  response.status = sinon.stub().returns(response);

  return response;
}

module.exports = ResponseStub;