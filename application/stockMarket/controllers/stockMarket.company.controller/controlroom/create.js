const { getSearchAlphavantage } = require('../../../middlewares/common.functions');
const { CRUD } = require('../../../models/crud.model');

const create = async (req, res, stockCompanyModel) => {
  const userId = req?.user?.id ?? 'System';
  const data = req.body;

  //before creating stock market company check whether the company name already exists.
  const exists = await CRUD.find(stockCompanyModel, { filter: { symbol: data?.symbol } });

  //to avoid duplicate company name
  if (exists?.length > 0) {
    return res.status(401).json({
      success: false,
      message: 'Company name or code already exists.'
    });
  }

  const overview = await getSearchAlphavantage(data.symbol);

  if ( Object.keys(overview?.data)?.length <= 0 || overview?.status === 401) {
    return res.status(401).json({
      success: false,
      message: 'Sorry, company name or symbol data not found.'
    });
  }

  const resBody = Object.assign({}, overview.data);
  resBody.createdBy = userId;
  console.log('overview --', overview);
  console.log('resBody --', resBody);
  //Create the stock market company document
  const result = await CRUD.create(stockCompanyModel, resBody);

  res.status(200).send({
    success: true,
    result: { data: result },
    message: 'Stock market company created successfully'
  });

  return;
};

module.exports = create;
