import { useContext } from "react";
import "./Navbar.scss";
import { FaRegUser } from "react-icons/fa6";

import { Context } from "../../context/Context";
import { HiLogout } from "react-icons/hi";
import { baseUrl } from "../../main";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user } = useContext(Context);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${baseUrl}/auth/logout`, { withCredentials: true });

      localStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });
      toast.success("Logout Successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout. Try again!");
      console.log(error);
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <FaRegUser className="user-icon" />
        <div className="user">
          <p>{user?.user?.name}</p>
        </div>
      </div>
      <div className="navbar-right">
        <div className="sidebar-button">
          {user && (
            <button onClick={handleLogout}>
              Logout
              <HiLogout className="login-icon" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
