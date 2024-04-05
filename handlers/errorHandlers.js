/*
  Catch Errors Handler
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/

exports.catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch((error) => {
      console.log('error -- ', error);
      if (error.name == 'ValidationError') {
        res.status(400).json({
          success: false,
          result: null,
          message: 'Required fields are not supplied',
          controller: fn.name,
          error: error
        });
      } else {
        // Server Error
        res.status(500).json({
          success: false,
          result: null,
          message: error.message,
          conttroller: fn.name,
          error: error
        });
      }
    });
  };
};
