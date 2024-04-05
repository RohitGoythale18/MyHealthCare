const Appointment = require("../model/appointments");
const Doctor = require("../model/doctor");

const allAppointments = async (req, res) => {
    const { id } = req.params;
    try {
        const appointments = await Appointment.find({ doctor: id }).populate("user");
        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found" });
        } else {
            return res.status(200).json({ appointments });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getSingleDoctor = async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        } else {
            return res.status(200).json({ doctor });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateDoctor = async (req, res) => {
    const { id } = req.params;
    const { name, image, contact, email, desc, ammount } = req.body;
    try {
        if (!name || !image || !contact || !email || !desc || !ammount) {
            return res.status(400).json({ message: "Incomplete content" });
        } else {
            const doctor = await Doctor.findByIdAndUpdate(id, { name, image, contact, email, desc, ammount }, { new: true });
            if (!doctor) {
                return res.status(404).json({ message: "Doctor not found" });
            } else {
                return res.status(200).json({ message: "Doctor updated", doctor });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const changeDate = async (req, res) => {
    const { _id, date } = req.body;
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(_id, { date }, { new: true });
        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        } else {
            return res.status(200).json({ message: "Appointment date changed", updatedAppointment });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateMedicine = async (req, res) => {
    const { _id, medicine, about } = req.body;
    try {
        if (!_id || !medicine || !about) {
            return res.status(400).json({ message: "Incomplete content" });
        } else {
            const appointment = await Appointment.findById(_id);
            if (!appointment) {
                return res.status(404).json({ message: "Appointment not found" });
            } else {
                await Appointment.findByIdAndUpdate(_id, { medicine, about });
                return res.status(200).json({ message: "Appointment medicine updated" });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    allAppointments,
    getSingleDoctor,
    updateDoctor,
    changeDate,
    updateMedicine
}
