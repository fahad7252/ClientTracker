const express = require('express');
const router = express.Router({ mergeParams: true });
const { check } = require('express-validator');
const { 
  getCustomers, 
  getCompanyCustomers, 
  getCustomer, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer 
} = require('../controllers/customer');
const { protect } = require('../middleware/auth');

// Route: /api/customers or /api/companies/:companyId/customers
router
  .route('/')
  .get(protect, function(req, res, next) {
    // Use getCompanyCustomers if companyId exists in params, otherwise use getCustomers
    if (req.params.companyId) {
      return getCompanyCustomers(req, res, next);
    } else {
      return getCustomers(req, res, next);
    }
  })
  .post(
    protect,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Valid email is required').isEmail()
    ],
    createCustomer
  );

// Route: /api/customers/:id
router
  .route('/:id')
  .get(protect, getCustomer)
  .put(
    protect,
    [
      check('name', 'Name is required').optional().not().isEmpty(),
      check('email', 'Valid email is required').optional().isEmail()
    ],
    updateCustomer
  )
  .delete(protect, deleteCustomer);

module.exports = router;
