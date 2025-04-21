import "./Sidebar.scss";
import logo from "../../assets/images/logo.png";
import { coursesLink, sidebarItems } from "../../assets/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineViewComfy, MdKeyboardArrowRight } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { baseUrl } from "../../main";
import { Context } from "../../context/Context";
import { IoMdBook } from "react-icons/io";

const Sidebar = () => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openCourseDropdown, setOpenCourseDropdown] = useState(false);
  const [topBanners, setTopBanners] = useState([]);
  const [courseBanners, setCourseBanners] = useState([]);

  const [courses, setCourses] = useState(false);

  const { user, dispatch } = useContext(Context);

  const dropdownVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  useEffect(() => {
    const getAllBanners = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/banner/all-banners`);

        if (data.result === 1) {
          const top = [];
          const courses = [];

          data.banners.forEach((banner) => {
            if (
              banner.type.includes("home") ||
              banner.type.includes("about") ||
              banner.type.includes("staff") ||
              banner.type.includes("enquiry") ||
              banner.type.includes("placement") ||
              banner.type.includes("admission") ||
              banner.type.includes("gallery") ||
              banner.type.includes("contact") ||
              banner.type.includes("mentor") ||
              banner.type.includes("alumni") ||
              banner.type.includes("ug") ||
              banner.type.includes("pg")
            ) {
              top.push(banner);
            } else {
              courses.push(banner);
            }
          });

          setTopBanners(top);
          setCourseBanners(courses);
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      }
    };

    getAllBanners();
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <img src={logo} alt="Logo" />
        </div>

        <div className="sidebar-items">
          {sidebarItems.map((item, index) => {
            return (
              <Link
                to={`/${item.link}`}
                key={index}
                className={`sidebar-item ${
                  location.pathname.startsWith(`/${item.link}`) ? "active" : ""
                }`}
              >
                <item.icon className="sidebar-icon" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>

        <div className="sidebar-dropdown">
          <div
            className="sidebar-dropdown-link"
            onClick={() => setCourses(!courses)}
          >
            <div className="sidebar-dropdown-link-left">
              <IoMdBook className="sidebar-icon" />
              <span>Courses</span>
            </div>
            <MdKeyboardArrowRight
              className={`right-arrow ${courses ? "rotate" : ""}`}
            />
          </div>

          <AnimatePresence>
            {courses && (
              <motion.div
                className="dropdown-links"
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {coursesLink.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={dropdownVariants}
                    custom={index}
                  >
                    <Link to={`/${item.link}`} className="dropdown-link">
                      {item.title}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Top Banners */}
        <div className="sidebar-dropdown">
          <div
            className="sidebar-dropdown-link"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <div className="sidebar-dropdown-link-left">
              <MdOutlineViewComfy className="sidebar-icon" />
              <span>Top Banner</span>
            </div>
            <MdKeyboardArrowRight
              className={`right-arrow ${openDropdown ? "rotate" : ""}`}
            />
          </div>

          <AnimatePresence>
            {openDropdown && (
              <motion.div
                className="dropdown-links"
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {topBanners.map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={dropdownVariants}
                    custom={index}
                  >
                    <Link
                      to={`banner/${item.type}/${item.id}`}
                      className="dropdown-link"
                    >
                      {item.type.replace(/-/g, " ").toUpperCase()}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
