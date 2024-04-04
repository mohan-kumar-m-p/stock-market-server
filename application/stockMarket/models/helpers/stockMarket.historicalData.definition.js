const md5 = require('md5');
const mongoose = require('mongoose');

const definition = {
  //=== === === stock historical details starts here ======
  date: { type: Date, required: true },
  open: { type: Number, required: true },
  high: { type: Number, required: true },
  low: { type: Number, required: true },
  close: { type: Number, required: true },
  volume: { type: Number, required: true },
  //=== === === stock historical details ends here ========
  //=== === === general fields starts here ================
  id: { type:String, unique:true },
  companyId:{ type:String, required:true },
  Symbol: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  uniqueHashRef: { type:String },
  uniqueHash: { type:String, unique:true }, // combination of date-time and company id.
  createdBy:{ type:String, required:true },
  modifiedBy:{ type:String }
  //=== === === general fields ends here ==================
};

const historicalSchema = mongoose.Schema(definition, { timestamps: true });

historicalSchema.pre('save', function () {
  this.id = this._id;
  this.uniqueHashRef = new Date(this.date).toDateString() + this.companyId;
  // to maintain unique records of the historical stock data for a day.
  this.uniqueHash = md5(this.uniqueHashRef);
});

const historicalDataModel = mongoose.model('stockhistoricaldata', historicalSchema);

module.exports = { historicalDataModel };

// // Usage example
// const fromTimestamp = new Date("2024-03-28T12:00:00Z");
// const toTimestamp = new Date("2024-03-28T12:20:00Z");
// getStocksAtExactIntervals("AAPL", fromTimestamp, toTimestamp, 5); // Fetching stocks at 5-minute intervals
// const mongoose = require('mongoose');
// const StockData = require('./models/StockData'); // Assume this is your model

// // Function to fetch data
// async function fetchStockData(symbol, referenceTimestamp, interval) {
//   const referenceDate = new Date(referenceTimestamp);
//   const referenceMinutes = referenceDate.getHours() * 60 + referenceDate.getMinutes();

//   const pipeline = [
//     {
//       $match: {
//         symbol: symbol,
//         timestamp: { $gte: referenceDate }
//       }
//     },
//     {
//       $addFields: {
//         minutesDiff: {
//           $floor: {
//             $divide: [
//               { $subtract: ['$timestamp', referenceDate] },
//               1000 * 60
//             ]
//           }
//         }
//       }
//     },
//     {
//       $addFields: {
//         intervalGroup: {
//           $floor: {
//             $divide: ['$minutesDiff', interval]
//           }
//         }
//       }
//     },
//     {
//       $group: {
//         _id: '$intervalGroup',
//         averagePrice: { $avg: '$price' },
//         totalVolume: { $sum: '$volume' },
//         documents: { $push: '$$ROOT' } // Optional: Collects all documents in each group
//       }
//     },
//     {
//       $sort: { _id: 1 }
//     }
//   ];

//   const result = await StockData.aggregate(pipeline);
//   return result;
// }

// // Usage example
// fetchStockData('AAPL', '2024-03-28T12:00:00Z', 5)
//   .then(result => console.log(result))
//   .catch(err => console.error(err));

// {
//     "Meta Data": {
//         "1. Information": "Intraday (5min) open, high, low, close prices and volume",
//         "2. Symbol": "IBM",
//     },
//     "Time Series (5min)": {
//         "2024-04-03 19:55:00": {
//             "1. open": "191.3200",
//             "2. high": "191.3900",
//             "3. low": "191.3200",
//             "4. close": "191.3900",
//             "5. volume": "64"
//         },
//         "2024-04-03 19:30:00": {
//             "1. open": "191.2500",
//             "2. high": "191.2500",
//             "3. low": "191.2500",
//             "4. close": "191.2500",
//             "5. volume": "45"
//         },
//         "2024-04-03 19:25:00": {
//             "1. open": "191.2400",
//             "2. high": "191.2500",
//             "3. low": "191.2400",
//             "4. close": "191.2500",
//             "5. volume": "18"
//         },
//         "2024-04-03 19:20:00": {
//             "1. open": "191.0300",
//             "2. high": "191.2400",
//             "3. low": "191.0200",
//             "4. close": "191.0200",
//             "5. volume": "5"
//         },
//         "2024-04-03 19:15:00": {
//             "1. open": "191.2500",
//             "2. high": "191.2500",
//             "3. low": "190.9700",
//             "4. close": "190.9700",
//             "5. volume": "324"
//         },
//     }
// }