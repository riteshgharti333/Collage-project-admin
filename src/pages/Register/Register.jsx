import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import "./Register.scss";
import logo from "../../assets/images/logo.png";

import { baseUrl } from "../../main";

import { BiShow, BiHide } from "react-icons/bi";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // State for form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    // confirmPassword: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseUrl}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <div className="register">
      <div className="register-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="register-box">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>

            <div className="input-group-botom">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              {showPassword ? (
                <BiHide
                  className="viewIcon"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <BiShow
                  className="viewIcon"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
          </div>
          {/* <div className="input-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} />
          </div> */}
          <button type="submit" className="register-button">
            Sign Up
          </button>
        </form>
        <p className="register-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
