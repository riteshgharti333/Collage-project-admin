import { useEffect, useRef, useState } from "react";
import "./Member.scss";
import { MdFullscreen, MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { baseUrl } from "../../main";
import { toast } from "sonner";
import { Link } from "react-router-dom";

import { FaRegEdit } from "react-icons/fa";

const Member = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [deleteImg, setDeleteImg] = useState(false);
  const [allData, setAllData] = useState([]);
  const [deleteData, setDeleteData] = useState();

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
        const { data } = await axios.get(`${baseUrl}/founder/all-founders`);

        if (data && data.founders) {
          setAllData(data.founders);
        }
      } catch (error) {
        console.error("Error fetching mentor:", error);
        toast.error(error.response.data.message);
      }
    };
    getAllData();
  }, []);

  const deleteImage = async (id) => {
    if (!id) return;

    try {
      const { data } = await axios.delete(`${baseUrl}/founder/${id}`);

      if (data) {
        toast.success(data.message);
        setDeleteImg(false);
      }
      setAllData((prev) => prev.filter((staff) => staff._id !== id));

      toast.success(data.message);
    } catch (error) {
      console.error("Error deleting mentor:", error);
      toast.error("Failed to delete mentor");
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
        <h3>Delete this image?</h3>
        <div className="deleteImage-btns">
          <button className="delete-btn" onClick={() => deleteImage(id)}>
            Yes
          </button>
          <button className="success-btn" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="member">
      <div className="member-top">
        <h1>Mentors</h1>
        <Link to={"/new-mentor"}>
          <button className="success-btn">Add New Mentor</button>
        </Link>
      </div>

      <div className="member-imgs">
        {allData?.length > 0 &&
          allData.map((item, index) => (
            <div
              className="member-img"
              key={item.imageId}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="member-img-round">
              <img
                src={item.image}
                alt={`Image ${index}`}
                loading="lazy"
                className={`${hoveredIndex === index ? "add-filter" : ""}`}
              />
              </div>
            

              <div className="member-details">
                <h3>{item.name}</h3>
                <p>{item.position}</p>
              </div>

              {hoveredIndex === index && (
                <div className="member-img-desc ">
                  <Link to={`/mentor/${item._id}`}>
                    <FaRegEdit
                      className="galley-icon edit-icon"
                      onClick={() => setSelectedImg(item.img)}
                      onMouseEnter={(e) => handleMouseEnter(e, "Edit Member")}
                      onMouseLeave={handleMouseLeave}
                    />
                  </Link>

                  <MdDeleteOutline
                    className="galley-icon"
                    onClick={() => {
                      setDeleteData({ id: item._id });
                      setDeleteImg(true);
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, "Delete Image")}
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

export default Member;
