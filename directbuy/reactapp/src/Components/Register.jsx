// src/components/RegistrationForm.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Register.css"; // Import the stylesheet
import axios from "axios";
import { apiUrl } from "../apiconfig";
const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    role: "ADMIN",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    const fieldErrors = { ...errors };

    switch (fieldName) {
      case "firstName":
        fieldErrors.firstName = value.length >= 6 ? "" : "First name must be at least 6 characters long";
      break;
      case "password":
        fieldErrors.password =
          value.length >= 6 ? "" : "Password must be at least 6 characters";
        break;
      case "confirmPassword":
        fieldErrors.confirmPassword =
          value === formData.password ? "" : "Passwords do not match";
        break;
      case "email":
        // Simple regex for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        fieldErrors.email = emailRegex.test(value)
          ? ""
          : "Invalid email address";
        break;
      case "mobileNumber":
        // Assuming mobile number should be 10 digits
        const phoneRegex = /^\d{10}$/;
        fieldErrors.mobileNumber = phoneRegex.test(value)
          ? ""
          : "Invalid phone number";
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
  };

  const handleSubmit = async (e) => {
    const fieldErrors = { ...errors };

    // Validation logic for firstName, lastName, mobileNumber, email, password, and confirmPassword
    fieldErrors.firstName =
      formData.firstName.trim() === "" ? "First Name is required" :
      formData.firstName.length < 6 ? "First Name must be at least 6 characters" : "";

    fieldErrors.lastName =
      formData.lastName.trim() === "" ? "Last Name is required" : "";
    fieldErrors.mobileNumber =
      fieldErrors.mobileNumber == ""
        ? formData.mobileNumber.trim() === ""
          ? "Mobile Number is required"
          : ""
        : fieldErrors.mobileNumber;
    fieldErrors.email =
      fieldErrors.email == ""
        ? formData.email.trim() === ""
          ? "Email is required"
          : ""
        : fieldErrors.email;
    fieldErrors.password =
      formData.password != ""
        ? formData.password.length < 6
          ? "Password must be at least 6 characters"
          : ""
        : "Password is required";
    fieldErrors.confirmPassword =
      formData.confirmPassword.trim() === ""
        ? "Confirm Password is required"
        : formData.confirmPassword !== formData.password
        ? "Passwords do not match"
        : "";

    setErrors(fieldErrors); // Add validation logic here
    const hasErrors = Object.values(fieldErrors).some((error) => error !== "");

    if (hasErrors) {
      return;
    }

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      mobileNumber: formData.mobileNumber,
      email: formData.email,
      role: formData.role,
      password: formData.password,
    };
    try {
      let response = await axios.post(
       apiUrl+"/api/auth/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      navigate("/error");
    }
  };

  return (
    <div className="registration-form">
      <h2>Register</h2>
      <label>
        Select Role:
        <select name="role" value={formData.role} onChange={handleInputChange}>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
        </select>
      </label>

      <div className="form-grid">
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          {errors.firstName && (
            <span className="error">{errors.firstName}</span>
          )}
        </label>

        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </label>

        <label>
          Mobile Number:
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
          />
          {errors.mobileNumber && (
            <span className="error">{errors.mobileNumber}</span>
          )}
        </label>

        <label>
          E-mail Id:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </label>

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </label>

        <label>
          Confirm Password:
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}
        </label>
      </div>

      <button type="submit" onClick={handleSubmit}>
        Register
      </button>
      <div className="login-link">
        Already have an Account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Register;
