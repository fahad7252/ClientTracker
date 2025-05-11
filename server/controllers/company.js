const Company = require("../models/Company");
const { validationResult } = require("express-validator");

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private
exports.getCompanies = async (req, res, next) => {
  try {
    let query = Company.find({ user: req.user.id });

    // Add populate for client count
    query = query.populate("customers");

    const companies = await query;

    return res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Private
exports.getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate("customers");

    if (!company) {
      return res.status(404).json({ success: false, msg: "Company not found" });
    }

    // Make sure user owns the company
    if (company.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(401)
        .json({ success: false, msg: "Not authorized to access this company" });
    }

    return res.status(200).json({
      success: true,
      data: company,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// @desc    Create new company
// @route   POST /api/companies
// @access  Private
exports.createCompany = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Add user to req.body
    req.body.user = req.user.id;

    const company = await Company.create(req.body);

    return res.status(201).json({
      success: true,
      data: company,
    });
  } catch (err) {
    console.error(err);

    // Handle duplicate key error
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ success: false, msg: "Company already exists" });
    }

    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private
exports.updateCompany = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, msg: "Company not found" });
    }

    // Make sure user owns the company
    if (company.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(401)
        .json({ success: false, msg: "Not authorized to update this company" });
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      data: company,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private
exports.deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, msg: "Company not found" });
    }

    // Make sure user owns the company
    if (company.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(401)
        .json({ success: false, msg: "Not authorized to delete this company" });
    }

    await company.remove();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
