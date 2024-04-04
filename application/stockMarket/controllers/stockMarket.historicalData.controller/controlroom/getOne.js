
const commonFunction = require('../../../../../helpers/systemFunctions');
const { CRUD } = require('../../../models/crud.model');

const getOne = async (req, res, historicalDataModel, stockCompanyModel) => {

    const { query } = req;

    const filter = { _id: req.params.id };
    // preparing select objects to get only selected feilds data
    const select = commonFunction.prepareSelect(query);

    // fetch the details of a stock market company.
    const result = await CRUD.findOne(stockCompanyModel, { filter, select });

    return res.status(200).send({
        success: true,
        result: { data: result },
        message: 'A stock market company details fetched successfully'
    });
};

module.exports = getOne;


/**
 *Function for view the data
 * @param {*} req
 * @param {*} res
 */
async function getOne(req, res) {
    logger.info(`${moduleName} - {'method':${req.method}, 'host':${req.headers.host}, 'url':${req.url}, 'data':${JSON.stringify(req.params)}`);
    try {
        const { query } = req;

        let filter = {
            _id: req.params.id,
        };

        filter = Object.assign({}, commonHelper.updateFilterByUser(req, filter, moduleName));
        const select = commonHelper.prepareSelect(query, logger, moduleName);

        const result = await modelLib.getOne(filter, select);
        response.successResponse(200, result, res);
    } catch (error) {
        response.errorResponse(error, res);
    }
}
