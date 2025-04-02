import { useEffect, useRef, useState } from "react";
import "./Alumini.scss";
import { MdFullscreen, MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { baseUrl } from "../../main";
import { toast } from "sonner";
import { Link } from "react-router-dom";

import { FaRegEdit } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaBuilding } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";

const Alumini = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [deleteImg, setDeleteImg] = useState(false);
  const [allData, setAllData] = useState([]);
  const [deleteData, setDeleteData] = useState();
  const [loading, setLoading] = useState(false);
  // Tooltip state
  const [tooltip, setTooltip] = useState({
    visible: false,
    text: "",
    x: 0,
    y: 0,
  });

  const cardRef = useRef(null);

  useEffect(() => {
    const getAllData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/alumni/all-alumnies`);

        if (data && data.alumni) {
          setAllData(data.alumni);
        }
      } catch (error) {
        console.error("Error fetching alumni:", error);
        toast.error(error.response.data.message);
      }
    };
    getAllData();
  }, []);

  const deleteImage = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await axios.delete(`${baseUrl}/alumni/${id}`);

      if (data) {
        toast.success(data.message);
        setDeleteImg(false);
      }
      setAllData((prev) => prev.filter((alumni) => alumni._id !== id));

      toast.success(data.message);
    } catch (error) {
      console.error("Error deleting alumni:", error);
      toast.error("Failed to delete alumni!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setDeleteImg(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [deleteImg]);

  const handleMouseEnter = (event, text) => {
    const { clientX, clientY } = event;
    setTooltip({
      visible: true,
      text,
      x: clientX + 10,
      y: clientY + 10,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, text: "", x: 0, y: 0 });
  };

  const DeleteImage = ({ id, onClose }) => (
    <div className="deleteImage">
      <div className="deleteImage-desc" ref={cardRef}>
        <h3>Delete Alumni</h3>
        <div className="deleteImage-btns">
          <button
            className="delete-btn"
            onClick={() => deleteImage(id)}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes"}
          </button>
          <button className="success-btn" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="alumini">
      <div className="alumini-top">
        <h1>Alumnies</h1>
        <Link to={"/new-alumni"}>
          <button className="success-btn">Add New Alumini</button>
        </Link>
      </div>
      <div className="alumini-imgs">
        {allData?.length > 0 &&
          allData.map((item, index) => (
            <div
              className="alumini-img"
              key={item.imageId}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={item.image}
                alt={`Image ${index}`}
                loading="lazy"
                className={`staff-img ${
                  hoveredIndex === index ? "add-filter" : ""
                }`}
              />

              <div className="alumini-details">
                <h3>{item.name}</h3>
                <p>
                  <FaUserTie className="alumni-icon" />
                  {item.designation}
                </p>
                <p>
                  <FaBuilding className="alumni-icon" />
                  {item.company}
                </p>
                <p>
                  <FaLocationDot className="alumni-icon" />
                  {item.location}
                </p>
              </div>

              {hoveredIndex === index && (
                <div className="alumini-img-desc">
                  <Link to={`/update-alumni/${item._id}`}>
                    <FaRegEdit
                      className="galley-icon edit-icon"
                      onClick={() => setSelectedImg(item.img)}
                      onMouseEnter={(e) => handleMouseEnter(e, "Edit alumini")}
                      onMouseLeave={handleMouseLeave}
                    />
                  </Link>
                  <MdDeleteOutline
                    className="galley-icon"
                    onClick={() => {
                      setDeleteData({ id: item._id });
                      setDeleteImg(true);
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, "Delete alumni")}
                    onMouseLeave={handleMouseLeave}
                  />
                </div>
              )}
            </div>
          ))}
      </div>
      {deleteImg && (
        <DeleteImage id={deleteData.id} onClose={() => setDeleteImg(false)} />
      )}
      {selectedImg && (
        <div className="image-modal" onClick={() => setSelectedImg(null)}>
          <img src={selectedImg} alt="Fullscreen Preview" loading="lazy" />
          <span className="close-btn" onClick={() => setSelectedImg(null)}>
            ×
          </span>
        </div>
      )}
      {tooltip.visible && (
        <div
          className="tooltip"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default Alumini;
