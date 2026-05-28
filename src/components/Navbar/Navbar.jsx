import "./Navbar.scss";

import { useContext, useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa6";
import { HiLogin, HiLogout } from "react-icons/hi";

import { Context } from "../../context/Context";
import { baseUrl } from "../../main";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, dispatch } = useContext(Context);

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);

    try {
      await axios.post(`${baseUrl}/auth/logout`, null, {
        withCredentials: true,
      });

      localStorage.removeItem("user");

      dispatch({ type: "LOGOUT" });

      setProfile(null);

      toast.success("Logout Successfully");

      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout. Try again!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/auth/profile`, {
          withCredentials: true,
        });

        setProfile(data?.user);
      } catch (error) {
        // if not logged in or token expired
        setProfile(null);
      }
    };

    fetchProfile();
  }, []);

  const isLoggedIn = !!profile;

  return (
    <div className="navbar">
      <div className="navbar-left">
        {isLoggedIn && (
          <Link to={"/profile"} className="user-link">
            <FaRegUser className="user-icon" />

            <div className="user">
              <p>{profile?.name}</p>
            </div>
          </Link>
        )}
      </div>

      <div className="navbar-right">
        <div className="sidebar-button">
          {isLoggedIn ? (
            <button onClick={handleLogout} disabled={loading}>
              Logout
              <HiLogout className="login-icon" />
            </button>
          ) : (
            <Link to={"/login"}>
              <button>
                Login
                <HiLogin className="login-icon" />
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
