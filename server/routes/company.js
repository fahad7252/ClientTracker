const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/company");
const { protect } = require("../middleware/auth");
const customerRouter = require("./customer");

// Re-route into other resource routers
router.use("/:companyId/customers", customerRouter);

// Route: /api/companies
router
  .route("/")
  .get(protect, getCompanies)
  .post(
    protect,
    [check("name", "Name is required").not().isEmpty()],
    createCompany
  );

// Route: /api/companies/:id
router
  .route("/:id")
  .get(protect, getCompany)
  .put(
    protect,
    [check("name", "Name is required").optional().not().isEmpty()],
    updateCompany
  )
  .delete(protect, deleteCompany);

module.exports = router;
