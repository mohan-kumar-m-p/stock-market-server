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
