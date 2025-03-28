import "./Layout.scss";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="layout">
      <div className="layout-container">
        <div className="layout-left">
          <Sidebar />
        </div>

        <div className="layout-right">
          <div className="layout-nav">
            <Navbar />
          </div>


          <div className="layout-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
