import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


//create token
const createToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Optionally, set an expiration time for the token
  );
};


//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.json(
                {
                    success: false,
                    message: "User does not exists"
                }
            )
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json(
                {
                    success: false,
                    message: "Invalid password"
                }
            )
        }

        const token = createToken(user._id);
        res.json({
          success: true,
          message: "User logged in successfully",
          token: token,
          role: user.role, // Add this line to include role
        });
        
    } catch (error) {
        console.log(error);
        res.json(
            {
                success: false,
                message: "Internal server error"
            }
        )
        
    }
}

//register user

const registerUser = async (req, res) => {
    const { name, email, password, position, department, role, status, date } = req.body;
    try {
        const exists = await User.findOne( { email });
        if (exists) {
            return res.json(
                {
                    success: false,
                    message: "User already exists",
                    role: role
                }
            )
        }

        const avatarLocalPath = req.files?.avatar[0]?.path;

        if (!avatarLocalPath) {
            return res.json(
                {
                    success: false,
                    message: "Avatar is required"
                }
            )
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);

        if(!avatar) {
            return res.json(
                {
                    success: false,
                    message: "Avatar upload failed"
                }
            )
        }

        if (!validator.isEmail(email)) {
            return res.json(
                {
                    success: false,
                    message: "Invalid email"
                }
            )
        }

        if (password.length < 6) {
            return res.json(
                {
                    success: false,
                    message: "Password should be atleast 6 characters"
                }
            )
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User(
            {
                name,
                email,
                password: hashedPassword,
                avatar: avatar.url,
                position,
                department,
                role,
                status,
                date
            }
        )

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json(
            {
                success: true,
                message: "User registered successfully",
                token: token,
                avatar: avatar.url
            }
        )
    } catch (error) {
        console.log(error);
        res.json(
            {
                success: false,
                message: "Internal server error"
            }
        )
    }
}

 


//edit user
const editUser = async (req, res) => {
    const { name, email, password, position, department } = req.body;
    const userId = req.userId; 

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        // Update name
        if (name) user.name = name;

        // Update email
        if (email) {
            if (!validator.isEmail(email)) {
                return res.json({
                    success: false,
                    message: "Invalid email",
                });
            }
            user.email = email;
        }

        
        if (password) {
            if (password.length < 6) {
                return res.json({
                    success: false,
                    message: "Password should be at least 6 characters",
                });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        
        if (position) user.position = position;

        
        if (department) user.department = department;

        
        if (req.files?.avatar) {
            const avatarLocalPath = req.files.avatar[0]?.path;

            if (!avatarLocalPath) {
                return res.json({
                    success: false,
                    message: "Avatar upload failed",
                });
            }

            const avatar = await uploadOnCloudinary(avatarLocalPath);

            if (!avatar) {
                return res.json({
                    success: false,
                    message: "Avatar upload failed",
                });
            }

            user.avatar = avatar.url;
        }

        await user.save();

        res.json({
            success: true,
            message: "User updated successfully",
            user: {
                name: user.name,
                email: user.email,
                position: user.position,
                department: user.department,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Internal server error",
        });
    }
};

//create user
// Create Employee
const createEmployee = async (req, res) => {
  try {
    const { name, email, password, position, department, role, status, date } = req.body;
    const { role: userRole, department: userDepartment } = req.user;

    // Role-based access control
    if (userRole === "Manager" && department !== userDepartment) {
      return res.status(403).json({
        success: false,
        message: "Managers can only add employees to their own department",
      });
    }

    if (userRole === "User") {
      return res.status(403).json({
        success: false,
        message: "Regular users cannot create employees",
      });
    }

    try {

      const exists = await User.findOne({ email });
      if(exists) {
        return res.status(400).json({
          success: false,
          message: "Employee already exists",
        });
      }

      const avatarLocalPath = req.files?.avatar[0]?.path;

      if (!avatarLocalPath) {
        return res.json({
          success: false,
          message: "Avatar is required",
        });
      }

      const avatar = await uploadOnCloudinary(avatarLocalPath);

      if (!avatar) {
        return res.json({
          success: false,
          message: "Avatar upload failed",
        });
      }

      if (!validator.isEmail(email)) {
        return res.json({
          success: false,
          message: "Invalid email",
        });
      }

      if (password.length < 6) {
        return res.json({
          success: false,
          message: "Password should be atleast 6 characters",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      
      
      // Admin has full access
    const newEmployee = new User({
      name,
      email,
      password: hashedPassword,
      position,
      department,
      avatar: avatar.url,
      role,
      status,
      date,
    });
    
    const savedEmployee = await newEmployee.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: savedEmployee,
    });

      
    } catch (error) {
      console.error("Error creating employee:", error.message);
      res.status(500).json({
        success: false,
        message: "Internal server error- inside",
      });
    }

    
  } catch (error) {
    console.error("Error creating employee:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get All Employees (Admin/Manager access)
const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find();
    return res.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error("Error fetching employees:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update Employee (Admin/Manager access)
const updateEmployee = async (req, res) => {
  try {
    const { name, email, position, department, role, status, date } = req.body;
    const { employeeId } = req.params; // Get employeeId from the URL
    const { role: userRole, department: userDepartment } = req.user;

    const employee = await User.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Admin: Can update any employee
    if (userRole === "Admin") {
      if (name) employee.name = name;
      if (email) employee.email = email;
      if (position) employee.position = position;
      if (department) employee.department = department;
      if (role) employee.role = role;
      if (status) employee.status = status;
      if (date) employee.date = date;
    }

    // Manager: Can only update employees in their own department
    if (userRole === "Manager") {
      if (employee.department !== userDepartment) {
        return res.status(403).json({
          success: false,
          message: "Managers can only update employees in their department",
        });
      }

      if (name) employee.name = name;
      if (email) employee.email = email;
      if (position) employee.position = position;
      if (department) employee.department = department;
      if (role) employee.role = role;
      if (status) employee.status = status;
      if (date) employee.date = date;
    }

    // Regular User: Cannot update employees
    if (userRole === "user") {
      return res.status(403).json({
        success: false,
        message: "Regular users cannot update employees",
      });
    }

    await employee.save();

    res.json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    console.error("Error updating employee:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// Delete Employee (Admin/Manager access)
const deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const userRole = req.userRole;
    const userDepartment = req.user.department;

    const employee = await User.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Admin: Can delete any employee
    if (userRole === "Admin") {
      await employee.remove();
      return res.json({
        success: true,
        message: "Employee deleted successfully",
      });
    }

    // Manager: Can only delete employees in their own department
    if (userRole === "Manager") {
      if (employee.department !== userDepartment) {
        return res.status(403).json({
          success: false,
          message: "Managers can only delete employees in their department",
        });
      }
      await employee.remove();
      return res.json({
        success: true,
        message: "Employee deleted successfully",
      });
    }

    // Regular User: Cannot delete employees
    if (userRole === "user") {
      return res.status(403).json({
        success: false,
        message: "Regular users cannot delete employees",
      });
    }
  } catch (error) {
    console.error("Error deleting employee:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { createEmployee, getAllEmployees, updateEmployee, deleteEmployee };



export { loginUser, registerUser, editUser };
