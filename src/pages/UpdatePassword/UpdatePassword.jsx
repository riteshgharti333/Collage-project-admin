import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import "./UpdatePassword.scss";
import { Context } from "../../context/Context";
import { useContext } from "react";
import { baseUrl } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${baseUrl}/auth/update-password`,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(
          response.data.message || "Password updated successfully!"
        );
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="updatePassword">
      <div className="updatePassword-top">
        <Link onClick={() => navigate(-1)} className="back-icon">
          <MdKeyboardBackspace size={35} />
        </Link>
        <h1>Update Password</h1>
      </div>

      <div className="updatePasswordContainer">
        <div className="updatePasswordContainerWrapper bg-primary">
          <form onSubmit={handleSubmit}>
            <div className="formData">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                name="oldPassword"
                placeholder="Enter Current Password"
                value={formData.oldPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="formData">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                name="newPassword"
                placeholder="Enter New Password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="formData">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="success-btn" disabled={loading}>
              {loading ? "Changing password..." : "  Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
