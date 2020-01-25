const uuidv4 = require('uuid/v4');

class Uuid {
  static random() {
    return uuidv4();
  }
}

module.exports = Uuid;