import React, { useEffect, useRef, useState } from "react";
import "./Alumni.scss";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { baseUrl } from "../../main";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaBuilding, FaUserTie } from "react-icons/fa";
import DragDropWrapper from "../../components/DragDropWrapper/DragDropWrapper"; // Import DragDropWrapper

const Alumni = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [deleteImg, setDeleteImg] = useState(false);
  const [allData, setAllData] = useState([]);
  const [deleteData, setDeleteData] = useState();
  const [loading, setLoading] = useState(false);
  const [reorderLoading, setReorderLoading] = useState(false); // for reorder loading state
  const cardRef = useRef(null);

  useEffect(() => {
    const getAllData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/alumni/all-alumnies`);
        if (data && data.alumni) {
          setAllData(data.alumni);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch alumni");
      }
    };
    getAllData();
  }, []);

  // Delete alumni image function
  const deleteImage = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await axios.delete(`${baseUrl}/alumni/${id}`, {
        withCredentials: true,
      });
      if (data) {
        toast.success(data.message);
        setDeleteImg(false);
        setAllData((prev) => prev.filter((alumni) => alumni._id !== id));
      }
    } catch (error) {
       toast.error(error.response.data.message)
    } finally {
      setLoading(false);
    }
  };

  // Handle drag and drop reorder
  const handleDrop = async (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    const updated = [...allData];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setAllData(updated);
    await updateBackendOrder(updated);
  };

  // Update backend with new order
  const updateBackendOrder = async (updated) => {
    setReorderLoading(true);
    try {
      const order = updated.map((alumni) => alumni._id);
      const { data } = await axios.patch(
        `${baseUrl}/alumni/reorder`,
        { order },
        {
          withCredentials: true,
        }
      );
      if (data && data.result === 1) {
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reorder alumni");
    } finally {
      setReorderLoading(false);
    }
  };

  // Close delete modal when clicked outside
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
    <div className="alumni">
      <div className="alumni-top">
        <h1>Alumni</h1>
        <Link to={"/new-alumni"}>
          <button className="success-btn" disabled={reorderLoading}>
            Add New Alumni
          </button>
        </Link>
      </div>

      <div className="alumni-imgs">
        <DragDropWrapper
          items={allData}
          onDrop={handleDrop}
          renderItem={(item, index) => (
            <div
              className="alumni-img"
              key={item._id}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className={`staff-img ${
                  hoveredIndex === index ? "add-filter" : ""
                }`}
              />
              <div className="alumni-details">
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
                <div className="alumni-img-desc">
                  <Link to={`/update-alumni/${item._id}`}>
                    <FaRegEdit className="galley-icon edit-icon" />
                  </Link>
                  <MdDeleteOutline
                    className="galley-icon"
                    onClick={() => {
                      setDeleteData({ id: item._id });
                      setDeleteImg(true);
                    }}
                  />
                </div>
              )}
            </div>
          )}
        />
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
    </div>
  );
};

export default Alumni;
