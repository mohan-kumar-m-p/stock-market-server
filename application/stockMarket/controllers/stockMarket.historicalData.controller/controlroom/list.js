
const commonFunction = require('../../../../../helpers/systemFunctions');
const { CRUD } = require('../../../models/crud.model');

const list = async (req, res, historicalDataModel, stockCompanyModel) => {

  const { query } = req;

  // preparing offset and limit for pagination.
  let limit = query.limit || 10;
  let offset = query.offset || 0;

  limit = parseInt(limit, 10);
  offset = parseInt(offset, 10);

  if (limit && offset) {
    offset = limit * offset;
  }

  // preparing filter object
  let filter = commonFunction.prepareFilter(query);
  // preparing sort objects
  const sort = commonFunction.prepareSort(query);
  // preparing select objects to get only selected feilds data
  const select = commonFunction.prepareSelect(query);

  // fetch the stock market companies list.
  const result = await CRUD.find(stockCompanyModel, { filter, select, sort, offset, limit });

  return res.status(200).send({
    success: true,
    result: { data: result },
    message: 'Stock market companies list fetched successfully'
  });
};

module.exports = list;
