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

// {
//   "Meta Data": {
//       "1. Information": "Intraday (5min) open, high, low, close prices and volume",
//       "2. Symbol": "IBM",
//       "3. Last Refreshed": "2024-03-26 19:55:00",
//       "4. Interval": "5min",
//       "5. Output Size": "Compact",
//       "6. Time Zone": "US/Eastern"
//   },
//   "Time Series (5min)": {
//       "2024-03-26 19:55:00": {
//           "1. open": "188.7100",
//           "2. high": "188.7100",
//           "3. low": "188.6200",
//           "4. close": "188.6200",
//           "5. volume": "29"
//       },
//       "2024-03-26 19:45:00": {
//           "1. open": "188.6000",
//           "2. high": "188.6000",
//           "3. low": "188.6000",
//           "4. close": "188.6000",
//           "5. volume": "1"
//       },
//     }
//   }