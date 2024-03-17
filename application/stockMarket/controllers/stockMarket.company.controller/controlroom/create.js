
const {roomTypeModel} = require("../../../../models/helpers/roomType.crud.definition");
const checkRoomAvailability = require("../../middlewares/checkRoomAvailability");
const {
  calculateNights,
  generateUniqueID,
  getDateArrayInRange,
} = require("../../../middlewares/common.functions");
const { sendEmail } = require("../../../middlewares/mailer");
const { CRUD } = require("../../../models/crud.model");

const create = async (stockCompanyModel, req, res) => {
  const data = req.body;
 
  //before creating stock market company check whether the company name already exists.
  const checkRoomNum = await CRUD.find(stockCompanyModel, 
    {filter : { companyName: data.companyName },
     offset : 0,
     limit : 10
    });

  //checking whether the selected rooms are in the active status
  if (checkRoomNum.length!==roomNumberId.length) {
    return res.status(401).json({
      success: false,
      message: "Please select valid Room Number",
    });
  }
  //before creating room booking check for available room type with the selected room type id.
  const checkRoomType = await CRUD.findOne(roomTypeModel, {
    _id: roomtypeId,
    isActive: true,
  });  
  //checking whether the selected room type available in a good condition
  if (!checkRoomType) {
    return res.status(401).json({
      success: false,
      message: "Please select valid Room Type",
    });
  }
  //check for room availability
  const availableRooms = await checkRoomAvailability({
    checkIn,
    checkOut,
    roomtypeId,
  });
  console.log("availableRooms",availableRooms);

  //check whether selected room number is present in the available room number document
  const roomNum = await roomNumberId.map((id)=>{
    let check = false;
    const num = availableRooms.data.map((d)=>{
      if(id===d.id){
        check = true;
        return d.roomNumber
      }
    })
    if(!check){
      throw {
        success: false,
        message: `The Selected room is unavailable ${id}`,
      };
    }
    return num;
  })
  
  //check whether the selected no. of rooms available for bookings
  if (availableRooms.count <= 0 || availableRooms.count < numberOfRooms) {
    return res.status(401).json({
      success: false,
      message: "You Enter Maximum Number of Room!",
    });
  }
  //check for no. of guests meet the capacity of room
  if (numberOfGuest > numberOfRooms * checkRoomType.roomCapacity) {
    return res.status(401).json({
      success: false,
      message: "You Enter Maximum Number of Guest!",
    });
  }
  req.body.actualPrice = checkRoomType.price;
  req.body.subTotal = checkRoomType.price*numberOfRooms;
  req.body.discount = checkRoomType.discount;
  console.log("checkRoomType.discount/100",checkRoomType.discount/100);
  req.body.totalPrice = req.body.subTotal - req.body.subTotal * (checkRoomType.discount/100);
  //adding createdBy one who is in current login
  req.body.createdBy = req.user._id;
  //Total nights calculated withing requested booking date range
  req.body.totalNight = calculateNights(checkIn, checkOut);
  //Generatinng Unique booking id
  req.body.code = "BHR" + generateUniqueID();

  //Create the Room booking document
  const result = await CRUD.create(bookingsModel, req.body);

  //shape the booked room document
  const assignRoom = roomNumberId.map((numId) => {
    return { bookingId: result._id, roomtypeId, roomNumberId: numId };
  });
  // assigned room numbers adding to booked room database
  const storeAssignedRoom = await CRUD.create(bookedRoomModel, assignRoom);
 //give date array of requested date range for booking
  const dateArray = getDateArrayInRange(checkIn, checkOut);
 //shape the booked date document
  const getBookingDatesObject = dateArray.map((date) => {
    return { bookingId: result._id, roomtypeId, bookedDate: date };
  });
  //store the each date with the bookings
  const storeBookingDates = await CRUD.create(
    roomBookedDatesModel,
    getBookingDatesObject
  );

  result.roomNumbers = roomNum.join();
  result.roomType = checkRoomType.typeName;
  const mail = await sendEmail({to:result.email, subject:"Booking Confirmation", bookingData:result})
console.log("mail",mail);
  return res.status(200).send({
    success: true,
    result: result,
    message: "Room Booking document saved correctly",
  });
};

module.exports = create;
