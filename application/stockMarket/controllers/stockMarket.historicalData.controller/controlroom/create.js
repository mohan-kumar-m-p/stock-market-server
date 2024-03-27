const { getSearchAlphavantage } = require('../../../middlewares/common.functions');
const { CRUD } = require('../../../models/crud.model');

const create = async (req, res, stockCompanyModel) => {
  const userId = req.user.id ?? 'System';
  const data = req.body;

  //before creating stock market company check whether the company name already exists.
  const exists = await CRUD.find(stockCompanyModel,
    { filter: { $or: [{ symbol: data.symbol }, { companyName: data.companyName }] } });

  //to avoid duplicate company name
  if (exists?.length >= 0) {
    return res.status(401).json({
      success: false,
      message: 'Company name or code already exists.'
    });
  }

  const overview = await getSearchAlphavantage (data.symbol);

  if (overview?.status !== 200 || overview?.data?.length <= 0) {
    return res.status(401).json({
      success: false,
      message: 'Sorry, company name or symbol data not found.'
    });
  }

  overview.createdBy = userId;
  //Create the stock market company document
  const result = await CRUD.create(stockCompanyModel, overview);

  res.status(200).send({
    success: true,
    result: { data: result },
    message: 'Stock market company created successfully'
  });

  return;
};

module.exports = create;
