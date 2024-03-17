const allowedOrigins = [
    'http://localhost:3200',
    'http://localhost:3501',
    'http://localhost:3100'
  ];
  
  //validating cross origin platforms 
  const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('You are not allowed'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200
  };
  
  module.exports = corsOptions;