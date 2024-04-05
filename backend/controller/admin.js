const Doctor = require("../model/doctor");
const Appointment = require("../model/appointments");
const PatientQuery = require("../model/patientmessage");
const Ambulance = require("../model/Ambulance");
const bcryptjs = require('bcryptjs');

const addDoctor = async (req, res) => {
    try {
        const { name, expertise, image, date, email, password, desc, contact, ammount } = req.body;
        console.log(name, expertise, image, date, email, password, desc, contact, ammount);
        if (!name || !image || !expertise || !date || !email || !password || !desc || !contact || !ammount) {
            return res.status(400).json({ message: "Incomplete content" });
        } else {
            const dbDoctor = await Doctor.findOne({ email });
            if (!dbDoctor) {
                const hashedPassword = await bcryptjs.hash(password, 8);
                await Doctor.create({ name, image, expertise, date, email, password: hashedPassword, desc, contact, ammount });
                return res.status(201).json({ message: "Doctor added" });
            }
            return res.status(409).json({ message: "Doctor already exists" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteDoctor = async (req, res) => {
    try {
        const _id = req.params.id;

        if (!_id) {
            return res.status(400).json({ message: "No ID sent" });
        } else {
            const dbDoctor = await Doctor.findOne({ _id });
            if (dbDoctor) {
                await Doctor.deleteOne({ _id });
                return res.json({ message: "Doctor deleted" });
            }
            return res.status(404).json({ message: "No doctor found" });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const userQuery = async (req, res) => {
    try {
        const allQueries = await PatientQuery.find({}, '-__v');
        return res.status(200).json(allQueries);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const ambulanceService = async (req, res) => {
    try {
        const ambulanceData = await Ambulance.find({}, '-__v');
        return res.status(200).json(ambulanceData);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateAppointment = async (req, res) => {
    try {
        const { _id, status, invoice } = req.body;
        if (!_id || !status || !invoice) {
            return res.status(400).json({ message: "Incomplete content" });
        } else {
            const appointment = await Appointment.findOne({ _id });
            if (!appointment) {
                return res.status(404).json({ message: "No appointment exists" });
            } else {
                await Appointment.findByIdAndUpdate(_id, { status, invoice });
                return res.status(200).json({ message: "Appointment updated" });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const allAppointments = async (req, res) => {
    try {
        const allAppointmentsData = await Appointment.find().populate("user").populate("doctor");
        if (!allAppointmentsData || allAppointmentsData.length === 0) {
            return res.status(404).json({ message: "No appointments found" });
        } else {
            return res.status(200).json(allAppointmentsData);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const singleAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointmentData = await Appointment.findById(id).populate("doctor").populate("user");
        if (!appointmentData) {
            return res.status(404).json({ message: "Appointment not found" });
        } else {
            return res.status(200).json(appointmentData);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    addDoctor,
    deleteDoctor,
    allAppointments,
    updateAppointment,
    userQuery,
    ambulanceService,
    singleAppointment
};
