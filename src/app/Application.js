class Application {
  constructor({ database, server }) {
    this.database = database;
    this.server = server;
  }

  async start() {
    await this.database.start();
    await this.server.start();
  }
}

module.exports = Application;