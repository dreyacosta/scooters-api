const express = require('express');

class Server {
  constructor({ router }) {
    this.express = express();

    this.express.disable('x-powered-by');
    this.express.use(router);
  }

  async start() {
    const http = await this.express.listen(4000);
    const { port } = http.address();
    console.log(`[p ${process.pid}] Listening at port ${port}`);
  }
}

module.exports = Server;