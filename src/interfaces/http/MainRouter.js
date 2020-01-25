const { Router } = require('express');
const methodOverride = require('method-override');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const ScootersRouter = require('./scooters/ScootersRouter');

class MainRouter {
  static create() {
    const router = Router();

    router
      .use(methodOverride('X-HTTP-Method-Override'))
      .use(cors())
      .use(bodyParser.json())
      .use(compression());

    router.use('/api/v1', ScootersRouter.create());

    return router;
  }
}

module.exports = MainRouter;