const Appointment = require("../models/Appointment");
const Customer = require("../models/Customer");
const { validationResult } = require("express-validator");

// @desc    Get appointments by date range
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
  try {
    // Extract query parameters
    const { startDate, endDate } = req.query;

    // Build query
    const query = { user: req.user.id };

    // Add date range if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }

    // Find appointments
    const appointments = await Appointment.find(query)
      .populate({
        path: "customer",
        select: "name email phone status value",
      })
      .populate({
        path: "company",
        select: "name",
      })
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// @desc    Get appointments for a specific date
// @route   GET /api/appointments/date/:date
// @access  Private
exports.getAppointmentsByDate = async (req, res, next) => {
  try {
    const dateString = req.params.date; // "YYYY-MM-DD"

    // Create start and end of day in UTC to avoid timezone shifts
    const startDate = new Date(`${dateString}T00:00:00.000Z`);
    const endDate = new Date(`${dateString}T23:59:59.999Z`);

    const appointments = await Appointment.find({
      user: req.user.id,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate({
        path: "customer",
        select: "name email phone status value",
      })
      .populate({
        path: "company",
        select: "name",
      })
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Add user to req.body
    req.body.user = req.user.id;

    // Create appointment
    const appointment = await Appointment.create(req.body);

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, msg: "Appointment not found" });
    }

    // Make sure user owns the appointment
    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({
          success: false,
          msg: "Not authorized to update this appointment",
        });
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, msg: "Appointment not found" });
    }

    // Make sure user owns the appointment
    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({
          success: false,
          msg: "Not authorized to delete this appointment",
        });
    }

    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
