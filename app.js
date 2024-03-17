const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const isValidAuthToken = require("./handlers/validateToken");
const cookieParser = require('cookie-parser');

// secure HTTP headers setting middleware
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// allow cross-origin resource sharing
const corsOptions = require("./configurations/cors.config");
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routers/auth.routers");
const userRouter = require("./routers/user.routers");
const roomRouters = require("./routers/room.routers");

// sets application API's routes starts here
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", isValidAuthToken, userRouter);
app.use("/api/v1",isValidAuthToken,roomRouters);
// routes end here 

module.exports = app;
