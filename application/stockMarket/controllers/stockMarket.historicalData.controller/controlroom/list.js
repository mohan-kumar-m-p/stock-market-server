
const { prepareFilter, prepareSort, prepareSelect } = require('../../../../../helpers/systemFunctions/commonFunctions');
const { CRUD } = require('../../../models/crud.model');

const list = async (req, res, historicalDataModel) => {

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
  let filter = prepareFilter(query);
  // preparing sort objects
  const sort = prepareSort(query);
  // preparing select objects to get only selected feilds data
  const select = prepareSelect(query);
  let result = [];

  // fetch the stock market OHLCV list.
  if (filter?.interval && filter?.interval >= 5 && filter?.symbol){
    const documentsToSkip = (filter?.interval / 5) - 1;
    let skipCount = 0;
    const collectedDocuments = [];

    while (collectedDocuments.length < limit) {
      const document = await CRUD.find(historicalDataModel, { filter:{ symbol:filter?.symbol }, select, sort, offset:skipCount, limit });
      if (!document) break;
      collectedDocuments.push(document[0]);
      skipCount += documentsToSkip + 1;
    }

    result = collectedDocuments;
  } else {
    result = await CRUD.find(historicalDataModel, { filter, select, sort, offset, limit });
  }

  return res.status(200).send({
    success: true,
    result: { data: result },
    message: 'Stock market OHLCV list fetched successfully'
  });
};

module.exports = list;
