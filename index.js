require('dotenv').config();

const Application = require('./src/app/Application');
const Server = require('./src/interfaces/http/Server');
const MainRouter = require('./src/interfaces/http/MainRouter');
const MongoDatabase = require('./src/infrastructure/persistence/mongodb/MongoDatabase');

const app = new Application({
  server: new Server({
    router: MainRouter.create(),
  }),
  database: new MongoDatabase(),
});

app
  .start()
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
