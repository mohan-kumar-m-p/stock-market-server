const { prepareSelect } = require('../../../../../helpers/systemFunctions/commonFunctions');
const { CRUD } = require('../../../models/crud.model');

const getOne = async (req, res, historicalDataModel) => {

  const { query } = req;

  const filter = { _id: req.params.id };
  // preparing select objects to get only selected feilds data
  const select = prepareSelect(query);

  // fetch the details of a stock market company.
  const result = await CRUD.findOne(historicalDataModel, { filter, select });

  return res.status(200).send({
    success: true,
    result: { data: result },
    message: 'A stock market company details fetched successfully'
  });
};

module.exports = getOne;
