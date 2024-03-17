const md5 = require('md5');
const mongoose = require('mongoose');

const definition = {
  //=== === === stock company details starts here ===============================
  symbol: { type: String, unique: true, required: true },
  companyName: { type: String, required: true },
  exchange: { type: String, required: true },
  sector: { type: String, required: true },
  currentPrice: { type: Number, required: true }
  financials: { // financial data
    type: Object,
    properties: {
      marketCap: { type: Number }, // Market capitalization
      peRatio: { type: Number }, // Price-to-Earnings ratio
      dividendYield: { type: Number }, // Dividend yield
      debtToEquity: { type: Number }, // Debt-to-equity ratio
    }
  },
  statistics: {
    type: Object,
    properties: {
      dayRange: { type: Object }, // Object containing low and high for the current day
      week52Range: { type: Object }, // Object containing low and high for the past 52 weeks
      avgVolume: { type: Number }, // Average daily trading volume
    },
  },
  //=== === === stock company details ends here =================================
  //=== === === general fields starts here ======================================
  id: { type: String, unique: true },
  refCode: { type: String, unique: true },
  isActive: { type: Boolean, default: true },
  uniqueHashRef: { type: String },
  uniqueHash: { type: String, unique: true }, // combination of companyName
  createdBy: { type: String, required: true },
  modifiedBy: { type: String },
  //=== === === general fields ends here ========================================
};

// creating the stock market company schema
const companySchema = mongoose.Schema(definition, { timestamp: true });

// to generate unique reference code.
async function genRefCode(next) {
  this.id = this._id;
  this.uniqueHashRef = this.companyName;
  this.uniqueHash = md5(this.uniqueHashRef);
  // fetching the details of the last document created.
  const prevObject = await this.findOne({}).sort({ createdAt: -1 }).limit(1);
  let refCode = "";
  if (prevObject && prevObject.refCode) {
    // stroring previous document refcode
    const prevRef = prevObject.refCode;
    // extracting the number part of refcode
    const numberStr = prevRef.substring(3);
    // by converting refcode to number and adding one
    refCode = `SMC${Number(numberStr) + 1}`
  } else {
    // if it is first document the previous document will not be there so we store directly
    refCode = "SMC" + 100000;
  }
  // assigning refCode value
  this.refCode = refCode;
}

companySchema.pre('save', genRefCode);

const stockCompanyModel = mongoose.model('stockcompany', companySchema);

module.exports = { stockCompanyModel };