require('dotenv').config();

const request = require('./support/request');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const ResponseStub = require('./support/ResponseStub');

chai.use(sinonChai);
chai.use(deepEqualInAnyOrder);

module.exports = {
  request,
  expect: chai.expect,
  sinon,
  ResponseStub,
};