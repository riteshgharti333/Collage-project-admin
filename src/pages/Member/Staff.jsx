import React, { useEffect, useRef, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import DragDropWrapper from "../../components/DragDropWrapper/DragDropWrapper";
import { baseUrl } from "../../main";
import "./Member.scss";

const Staff = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [deleteImg, setDeleteImg] = useState(false);
  const [allData, setAllData] = useState([]);
  const [deleteData, setDeleteData] = useState();
  const cardRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [reorderLoading, setReorderLoading] = useState(false);

  useEffect(() => {
    const getAllData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/staff/all-staffs`);
        setAllData(data.staff);
      } catch (error) {
        toast.error("Failed to fetch staff");
      }
    };
    getAllData();
  }, []);

  const handleDrop = async (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    const updated = [...allData];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setAllData(updated);
    await updateBackendOrder(updated);
  };

  const updateBackendOrder = async (updated) => {
    setReorderLoading(true);
    try {
      const order = updated.map((staff) => staff._id);
      console.log(order);
      const { data } = await axios.patch(
        `${baseUrl}/staff/reorder`,
        { order },
        {
          withCredentials: true,
        }
      );
      if (data && data.result === 1) {
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      setReorderLoading(false);
    }
  };

  const deleteImage = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${baseUrl}/staff/${id}`, {
        withCredentials: true,
      });
      setAllData((prev) => prev.filter((staff) => staff._id !== id));
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      setDeleteImg(false);
    }
  };

  const DeleteImage = ({ id, onClose }) => (
    <div className="deleteImage">
      <div className="deleteImage-desc" ref={cardRef}>
        <h3>Delete this image?</h3>
        <div className="deleteImage-btns">
          <button
            className="delete-btn"
            disabled={loading}
            onClick={() => deleteImage(id)}
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
    <div className="member">
      <div className="member-top">
        <h1>Staff Members</h1>
        <Link to="/new-staff-member">
          <button className="success-btn" disabled={reorderLoading}>
            Add New Staff Member
          </button>
        </Link>
      </div>

      <div className="member-imgs">
        <DragDropWrapper
          items={allData}
          onDrop={handleDrop}
          renderItem={(item, index) => (
            <div
              className="member-img"
              key={item._id}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="member-img-round">
                <img
                  src={item.image}
                  alt={item.name}
                  className={`staff-img ${
                    hoveredIndex === index ? "add-filter" : ""
                  }`}
                />
              </div>
              <div className="staff-details">
                <h3>{item.name}</h3>
                <p>{item.position}</p>
                <span>
                  <FaLocationDot className="location-icon" />
                  {item.location}
                </span>
              </div>
              {hoveredIndex === index && (
                <div className="member-img-desc staff-img-desc">
                  <Link to={`/staff-member/${item._id}`}>
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
          <img src={selectedImg} alt="Preview" />
          <span className="close-btn" onClick={() => setSelectedImg(null)}>
            ×
          </span>
        </div>
      )}
    </div>
  );
};

export default Staff;
