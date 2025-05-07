import "./Profile.scss";
import { Context } from "../../context/Context";
import { useContext, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

import { useState } from "react";
import { baseUrl } from "../../main";

const Profile = () => {
  const { user } = useContext(Context);

  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/auth/profile`, {
          withCredentials: true,
        });
        setProfile(data.user);
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };

    fetchProfile();
  }, []);

  const displayUser = profile || user?.user;

  return (
    <div className="profile">
      <div className="profile-top">
        <Link onClick={() => navigate(-1)} className="back-icon">
          <MdKeyboardBackspace size={35} />
        </Link>
        <h1>Profile</h1>
      </div>

      <div className="settingsWrapper">
        <div className="profileData">
          <div className="right">
            <div className="right-item">
              <p>Name : </p>
              <h3>{displayUser?.name}</h3>
            </div>
            <div className="right-item">
              <p>Email : </p>
              <h3>{displayUser?.email}</h3>
            </div>
          </div>
          <div className="password-change">
            <Link to={"/update-password"}>
              <p className="changePwd">Change Password</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
