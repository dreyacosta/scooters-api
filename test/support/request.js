const express = require('express');
const request = require('supertest');
const MainRouter = require('../../src/interfaces/http/MainRouter');

const app = express();
app.use(MainRouter.create());

module.exports = () => request(app);