const MissingParamsError = require('./errors/MissingParamsError');

function respondWith(action) {
  return async (request, response) => {
    function respondWithCode(code, error) {
      response.status(code).json({ message: error.message, data: error.data });
    }

    try {
      const result = await action(request, response);
      return response
        .status(200)
        .json(result);
    } catch(error) {
      if (error instanceof MissingParamsError) return respondWithCode(422, error);
      return respondWithCode(500, error);
    }
  };
}

module.exports = respondWith;