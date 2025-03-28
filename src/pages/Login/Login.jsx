import "./Login.scss";

import logo from "../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";

import { baseUrl } from "../../main";
import { useContext, useState } from "react";
import {toast} from "sonner";
import axios from "axios";
import { Context } from "../../context/Context";

import { BiShow, BiHide } from "react-icons/bi";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const { dispatch } = useContext(Context);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    dispatch({ type: "LOGIN_START" });
  
    try {
      const response = await axios.post(
        `${baseUrl}/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );
  
      dispatch({ type: "LOGIN_SUCCESS", payload: response?.data });
  
      if (response?.data) {
        toast.success(response?.data?.message || "Login successful!");
      }
  
      navigate("/");
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
     
      toast.error(error.response.data.message);
      console.error("Login Error:", error);
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login">
      <div className="login-logo">
        <img src={logo} alt="" />
      </div>
      <div className="login-box">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p className="signup-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
