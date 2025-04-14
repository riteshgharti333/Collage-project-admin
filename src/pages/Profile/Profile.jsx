import "./Profile.scss";
import { Context } from "../../context/Context";
import { useContext } from "react";

import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

const Profile = () => {
  const { user } = useContext(Context);

  const navigate = useNavigate();

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
              <h3>{user?.user?.name}</h3>
            </div>
            <div className="right-item">
              <p>Email : </p>
              <h3>{user?.user?.email}</h3>
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
