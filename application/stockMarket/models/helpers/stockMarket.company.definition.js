const md5 = require('md5');
const mongoose = require('mongoose');

const definition = {
  //=== === === stock company details starts here ===============================
  symbol: { type: String, required: true, unique:true },
  assetType: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  cIK: { type: String, required: true },
  exchange: { type: String, required: true },
  currency: { type: String, required: true },
  country: { type: String, required: true },
  sector: { type: String, required: true },
  industry: { type: String, required: true },
  address: { type: String, required: true },
  fiscalYearEnd: { type: String, required: true },
  latestQuarter: { type: String, required: true },
  marketCapitalization: { type: String, required: true },
  eBITDA: { type: String, required: true },
  pERatio: { type: String, required: true },
  pEGRatio: { type: String, required: true },
  bookValue: { type: String, required: true },
  dividendPerShare: { type: String, required: true },
  dividendYield: { type: String, required: true },
  profitMargin: { type: String, required: true },
  quarterlyEarningsGrowthYOY: { type: String, required: true },
  quarterlyRevenueGrowthYOY: { type: String, required: true },
  analystTargetPrice: { type: String, required: true },
  analystRatingStrongBuy: { type: String, required: true },
  analystRatingBuy: { type: String, required: true },
  analystRatingHold: { type: String, required: true },
  analystRatingSell: { type: String, required: true },
  analystRatingStrongSell: { type: String, required: true },
  s52WeekHigh: { type: String, required: true },
  s52WeekLow: { type: String, required: true },
  s50DayMovingAverage: { type: String, required: true },
  s200DayMovingAverage: { type: String, required: true },
  sharesOutstanding: { type: String, required: true },
  dividendDate: { type: String, required: true },
  exDividendDate: { type: String, required: true },
  lastRefreshed: { type: Date, default: new Date('2024-03-30T11:00:00Z') },
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
  this.uniqueHashRef = this.name;
  this.uniqueHash = md5(this.uniqueHashRef);
  // fetching the details of the last document created.
  const prevObject = await this.constructor.findOne().sort({ createdAt: -1 });
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
