
const { roomTypeModel } = require("../../../../models/helpers/roomType.crud.definition");
const checkRoomAvailability = require("../../middlewares/checkRoomAvailability");
const {
  calculateNights,
  generateUniqueID,
  getDateArrayInRange,
} = require("../../../middlewares/common.functions");
const { sendEmail } = require("../../../middlewares/mailer");
const { CRUD } = require("../../../models/crud.model");

const create = async (req, res, stockCompanyModel) => {
  const data = req.body;

  //before creating stock market company check whether the company name already exists.
  const checkRoomNum = await CRUD.find(stockCompanyModel,
    { filter: { $or: [{ symbol: data.symbol }, { companyName: data.companyName }] } });

  //to avoid duplicate company name
  if (checkRoomNum?.length >= 0) {
    return res.status(401).json({
      success: false,
      message: "Company name or code already exists"
    });
  }

  //check whether the given stock price is valid.
  if (data.currentPrice < 0) {
    return res.status(401).json({
      success: false,
      message: "Invalid stock price given",
    });
  }

  //Create the stock market company document
  const result = await CRUD.create(stockCompanyModel, req.body);

  const mail = await sendEmail({ to: result.email, subject: "New Company added to stock market list", bookingData: result })

  return res.status(200).send({
    success: true,
    result: { data: result },
    message: "Company saved to stock market list successfully",
  });
};

module.exports = create;
