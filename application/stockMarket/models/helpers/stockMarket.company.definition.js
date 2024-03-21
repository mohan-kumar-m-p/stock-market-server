const md5 = require('md5');
const mongoose = require('mongoose');

const definition = {
  //=== === === stock company details starts here ===============================
  Symbol: { type: String, required: true },
  AssetType: { type: String, required: true },
  Name: { type: String, required: true },
  Description: { type: String, required: true },
  CIK: { type: String, required: true },
  Exchange: { type: String, required: true },
  Currency: { type: String, required: true },
  Country: { type: String, required: true },
  Sector: { type: String, required: true },
  Industry: { type: String, required: true },
  Address: { type: String, required: true },
  FiscalYearEnd: { type: String, required: true },
  LatestQuarter: { type: String, required: true },
  MarketCapitalization: { type: String, required: true },
  EBITDA: { type: String, required: true },
  PERatio: { type: String, required: true },
  PEGRatio: { type: String, required: true },
  BookValue: { type: String, required: true },
  DividendPerShare: { type: String, required: true },
  DividendYield: { type: String, required: true },
  ProfitMargin: { type: String, required: true },
  QuarterlyEarningsGrowthYOY: { type: String, required: true },
  QuarterlyRevenueGrowthYOY: { type: String, required: true },
  AnalystTargetPrice: { type: String, required: true },
  AnalystRatingStrongBuy: { type: String, required: true },
  AnalystRatingBuy: { type: String, required: true },
  AnalystRatingHold: { type: String, required: true },
  AnalystRatingSell: { type: String, required: true },
  AnalystRatingStrongSell: { type: String, required: true },
  '52WeekHigh': { type: String, required: true },
  '52WeekLow': { type: String, required: true },
  '50DayMovingAverage': { type: String, required: true },
  '200DayMovingAverage': { type: String, required: true },
  SharesOutstanding: { type: String, required: true },
  DividendDate: { type: String, required: true },
  ExDividendDate: { type: String, required: true },
  //=== === === stock company details ends here =================================
  //=== === === general fields starts here ======================================
  id: { type: String, unique: true },
  refCode: { type: String, unique: true },
  isActive: { type: Boolean, default: true },
  uniqueHashRef: { type: String },
  uniqueHash: { type: String, unique: true }, // combination of companyName
  createdBy: { type: String, required: true },
  modifiedBy: { type: String }
  //=== === === general fields ends here ========================================
};

// creating the stock market company schema
const companySchema = mongoose.Schema(definition, { timestamp: true });

// to generate unique reference code.
async function genRefCode (next) {
  this.id = this._id;
  this.uniqueHashRef = this.companyName;
  this.uniqueHash = md5(this.uniqueHashRef);
  // fetching the details of the last document created.
  const prevObject = await this.findOne({}).sort({ createdAt: -1 }).limit(1);
  let refCode = '';
  if (prevObject && prevObject.refCode) {
    // stroring previous document refcode
    const prevRef = prevObject.refCode;
    // extracting the number part of refcode
    const numberStr = prevRef.substring(3);
    // by converting refcode to number and adding one
    refCode = `SMC${Number(numberStr) + 1}`;
  } else {
    // if it is first document the previous document will not be there so we store directly
    refCode = 'SMC' + 100000;
  }
  // assigning refCode value
  this.refCode = refCode;
  next();
}

companySchema.pre('save', genRefCode);

const stockCompanyModel = mongoose.model('stockcompany', companySchema);

module.exports = { stockCompanyModel };
