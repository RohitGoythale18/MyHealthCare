const express = require("express");
const adminRouter = require("./router/admin");
const authRouter = require("./router/auth");
const publicRouter = require("./router/public");
const doctorRouter = require("./router/doctor");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const mongooseConnection = require("./db/connection");
const patientRouter = require("./router/patient");
const doctor = require("./model/doctor");

const app = express();

app.use(cors({ credentials: true, origin: true }));
mongooseConnection(app);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/public", publicRouter);
app.use(authRouter);
app.use(adminRouter);
app.use(patientRouter);
app.use(doctorRouter);
