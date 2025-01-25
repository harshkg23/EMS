import mongoose , { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    type: String,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Manager", "User"], 
    default: "User", 
  },

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("User", userSchema);