import {User} from "../models/user.model.js";

const roleMiddleware = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Ensure `userId` is set by `authMiddleware`
      const { userId } = req;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      // Fetch the user's role from the database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if user's role is in the allowed roles
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
          role: user.role,
        });
      }

      // Attach the user's role to the `req` object
      req.user = {
        id: user.id,
        role: user.role,
        department: user.department, // Include department here
        email: user.email, // Add other relevant properties as needed
      };

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error("Role middleware error:", error.message);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};

export default roleMiddleware;
