const College = require("../models/College.model");

// Create College
const createCollege = async (req, res) => {
  try {
    const {
      name,
      short_name,
      email,
      phone,
      website,
      logo,
      address,
      city,
      state,
      pincode,
      established_year,
      status,
    } = req.body;

    // Required fields validation
    if (!name || !short_name || !email || !phone || !city || !state) {
      return res.status(400).json({
        success: false,
        message: "name, short_name, email, phone, city aur state required hain",
      });
    }

    // Check if college exists (by email OR name)
    const collegeExists = await College.findOne({
      $or: [
        { email: email },
        { name: name }
      ]
    });

    if (collegeExists) {
      return res.status(400).json({
        success: false,
        message: "Yeh college already exist karta hai (email ya name se)",
      });
    }

    // Create college
    const college = await College.create({
      name,
      short_name,
      email,
      phone,
      website,
      logo,
      address,
      city,
      state,
      pincode,
      established_year,
      status: status || "active", // Default status
    });

    return res.status(201).json({
      success: true,
      message: "College successfully create ho gaya",
      data: college,
    });

  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate field value entered",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Colleges with Pagination
const getAllColleges = async (req, res) => {
  try {
    const { 
      status, 
      city, 
      state,
      page = 1,
      limit = 10,
      search 
    } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (city) filter.city = city;
    if (state) filter.state = state;
    
    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { short_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get colleges
    const colleges = await College.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalColleges = await College.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: colleges.length,
      total: totalColleges,
      page: parseInt(page),
      totalPages: Math.ceil(totalColleges / parseInt(limit)),
      data: colleges,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get College by ID
const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College nahi mila",
      });
    }

    return res.status(200).json({
      success: true,
      data: college,
    });

  } catch (error) {
    // Handle invalid ID format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid college ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update College
const updateCollege = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "short_name",
      "email",
      "phone",
      "website",
      "logo",
      "address",
      "city",
      "state",
      "pincode",
      "established_year",
      "status",
    ];

    // Filter out undefined fields
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== null) {
        updateData[field] = req.body[field];
      }
    });

    // Check if there's data to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Update karne ke liye koi field nahi mili",
      });
    }

    // Check for duplicate email/name if updating
    if (updateData.email || updateData.name) {
      const duplicateCheck = await College.findOne({
        $and: [
          { _id: { $ne: req.params.id } }, // Exclude current college
          {
            $or: [
              { email: updateData.email },
              { name: updateData.name }
            ]
          }
        ]
      });

      if (duplicateCheck) {
        return res.status(400).json({
          success: false,
          message: "Email ya name already exists",
        });
      }
    }

    // Update college
    const updatedCollege = await College.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCollege) {
      return res.status(404).json({
        success: false,
        message: "College nahi mila",
      });
    }

    return res.status(200).json({
      success: true,
      message: "College successfully update ho gaya",
      data: updatedCollege,
    });

  } catch (error) {
    // Handle invalid ID format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid college ID format",
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate field value entered",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete College (New API - agar aapko delete functionality chahiye)
const deleteCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College nahi mila",
      });
    }

    return res.status(200).json({
      success: true,
      message: "College successfully delete ho gaya",
    });

  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid college ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Colleges by Status (Filter API)
const getCollegesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    // Validate status
    if (!['active', 'inactive', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Use: active, inactive, or pending",
      });
    }

    const colleges = await College.find({ status: status })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: colleges.length,
      data: colleges,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createCollege,
  getAllColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,      // Optional
  getCollegesByStatus, // Optional
};