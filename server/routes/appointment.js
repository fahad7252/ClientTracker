const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { 
  getAppointments, 
  getAppointmentsByDate, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment 
} = require('../controllers/appointment');
const { protect } = require('../middleware/auth');

// Route: /api/appointments
router
  .route('/')
  .get(protect, getAppointments)
  .post(
    protect,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('customer', 'Customer is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty()
    ],
    createAppointment
  );

// Route: /api/appointments/date/:date
router
  .route('/date/:date')
  .get(protect, getAppointmentsByDate);

// Route: /api/appointments/:id
router
  .route('/:id')
  .put(protect, updateAppointment)
  .delete(protect, deleteAppointment);

module.exports = router;
