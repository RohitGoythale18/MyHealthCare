const Appointments = require("../model/appointments");
const Doctor = require("../model/doctor");
const User = require("../model/user");
const PatientQuery = require("../model/patientmessage");
const Ambulance = require("../model/Ambulance");

const axios = require("axios");
const bcryptjs = require("bcryptjs");

const userQuery = async (req, res) => {
  try {
    const { name, email, contact, message } = req.body;
    await PatientQuery.create({ name, email, contact, message });
    return res.status(200).json({ message: "Message Sent Successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

const singleAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointments.findById(id).populate("doctor").populate("user");
    if (!appointment) {
      return res.status(404).json({ message: "No appointments found" });
    } else {
      return res.json({ appointment });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const allAppointments = async (req, res) => {
  try {
    const { id } = req;
    if (!id) {
      return res.status(400).json({ message: "Incomplete content" });
    } else {
      const userAppointments = await Appointments.find({ user: id }).populate("doctor");
      if (!userAppointments || userAppointments.length === 0) {
        return res.status(404).json({ message: "No appointments found" });
      } else {
        return res.json({ userAppointments });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createAppointments = async (req, res) => {
  try {
    const { doctor, disease, date } = req.body;
    const user = req.id;

    if (!user || !doctor || !disease || !date) {
      return res.status(400).json({ message: "Incomplete content" });
    } else {
      const userAppointments = await Appointments.create({ user, doctor, disease, date });
      if (userAppointments) {
        return res.status(200).json({ message: "Appointments created" });
      } else {
        return res.status(400).json({ message: "Error creating appointments" });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const payment = async (req, res) => {
  const { status, _id } = req.body;
  console.log(_id, status);
  try {
    if (!_id || !status) {
      return res.status(400).json({ message: "Invalid payment request" });
    }
    await Appointments.findByIdAndUpdate(_id, { payment: status });
    return res.status(200).json({ message: "Paid successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const ambulanceBooking = async (req, res) => {
  const { name, phoneNumber, address, emergencyType, city, state, zip } = req.body;
  try {
    if (!name || !phoneNumber || !address || !emergencyType || !city || !state || !zip) {
      return res.status(400).json({ message: "Invalid request" });
    }
    await Ambulance.create({ name, phoneNumber, address, emergencyType, city, state, zip });
    return res.status(200).json({ message: "Ambulance booked successfully" });
  } catch (error) {
    return res.status(502).json({ message: "Internal problem" });
  }
}

const singleUser = async (req, res) => {
  const { id } = req;
  try {
    const data = await User.findById(id);
    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User found successfully", data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

const updateUser = async (req, res) => {
  const { id } = req;
  let { username, email, password, phone, gender, age, location } = req.body;
  let updateObject = {};

  try {
    if (!username || !email || !phone || !gender || !age || !location) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const data = await User.findById(id);
    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password) {
      password = await bcryptjs.hash(password, 10);
      updateObject = { username, email, password, phone, gender, age, location };
    } else {
      updateObject = { username, email, phone, gender, age, location };
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateObject);

    return res.status(200).json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = { allAppointments, createAppointments, payment, userQuery, ambulanceBooking, singleAppointment, singleUser, updateUser };