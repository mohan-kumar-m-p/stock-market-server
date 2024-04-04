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
  companyId:{ type:String, required:true },
  symbol: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdBy:{ type:String, required:true },
  modifiedBy:{ type:String }
  //=== === === general fields ends here ==================
};

const historicalSchema = mongoose.Schema(definition, { timestamps: true });

const historicalDataModel = mongoose.model('stockhistoricaldata', historicalSchema);

module.exports = { historicalDataModel };
