const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "Customer",
      required: true,
    },
    date: {
      type: Date,
      required: [true, "Please add a date"],
      get: function (date) {
        // Return the date as is without timezone conversion
        return date;
      },
      set: function (date) {
        // Store the date exactly as provided without timezone adjustment
        return new Date(date);
      },
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot be more than 500 characters"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: mongoose.Schema.ObjectId,
      ref: "Company",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    // Add this to ensure getters are applied when the document is converted to JSON
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
