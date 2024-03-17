const md5 = require("md5");
const mongoose = require("mongoose");

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
  isActive: { type: Boolean, default: true },
  uniqueHashRef: { type:String }, 
  uniqueHash: { type:String, unique:true }, // combination of todays date and company id.
  createdBy:{ type:String, required:true },
  modifiedBy:{ type:String },
  //=== === === general fields ends here ==================
};

const historicalSchema = mongoose.Schema(definition, { timestamps: true });

historicalSchema.pre("save", function () {
  this.id = this._id;
  this.uniqueHashRef = new Date(this.date).toDateString() + this.companyId;
  // to maintain unique records of the historical stock data for a day.
  this.uniqueHash = md5(this.uniqueHashRef);
});

const historicalDataModel = mongoose.model("stockhistoricaldata", historicalSchema);

module.exports = { historicalDataModel };
