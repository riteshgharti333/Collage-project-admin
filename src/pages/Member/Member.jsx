import { useEffect, useRef, useState } from "react";
import "./Member.scss";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import axios from "axios";
import { baseUrl } from "../../main";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import DragDropWrapper from "../../components/DragDropWrapper/DragDropWrapper";

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
  const [loading, setLoading] = useState(false);
  const [reorderLoading, setReorderLoading] = useState(false);

  const cardRef = useRef(null);

  useEffect(() => {
    const getAllData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/founder/all-founders`);
        if (data && data.founders) {
          setAllData(data.founders);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
        toast.error(error?.response?.data?.message || "Error fetching mentors");
      }
    };
    getAllData();
  }, []);

  const deleteImage = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await axios.delete(`${baseUrl}/founder/${id}`, {
        withCredentials: true,
      });
      setAllData((prev) => prev.filter((member) => member._id !== id));
      toast.success(data.message || "Deleted successfully");
      setDeleteImg(false);
    } catch (error) {
      console.error("Error deleting member:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBackendOrder = async (updated) => {
    setReorderLoading(true);
    try {
      const order = updated.map((member) => member._id);
      const { data } = await axios.patch(
        `${baseUrl}/founder/reorder`,
        {
          order,
        },
        {
          withCredentials: true,
        }
      );
      if (data?.result === 1) {
        toast.success(data.message || "Reorder successful");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reorder");
    } finally {
      setReorderLoading(false);
    }
  };

  const handleDrop = async (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    const updated = [...allData];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setAllData(updated);
    await updateBackendOrder(updated);
  };

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
        <h1>Mentors</h1>
        <Link to={"/new-mentor"}>
          <button className="success-btn" disabled={reorderLoading}>
            Add New Mentor
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
                  alt={`Mentor ${index}`}
                  className={`${hoveredIndex === index ? "add-filter" : ""}`}
                />
              </div>

              <div className="member-details">
                <h3>{item.name}</h3>
                <p>{item.position}</p>
              </div>

              {hoveredIndex === index && (
                <div className="member-img-desc">
                  <Link to={`/mentor/${item._id}`}>
                    <FaRegEdit
                      className="galley-icon edit-icon"
                      onMouseEnter={(e) => handleMouseEnter(e, "Edit Mentor")}
                      onMouseLeave={handleMouseLeave}
                    />
                  </Link>

                  <MdDeleteOutline
                    className="galley-icon"
                    onClick={() => {
                      setDeleteData({ id: item._id });
                      setDeleteImg(true);
                    }}
                    onMouseEnter={(e) => handleMouseEnter(e, "Delete Mentor")}
                    onMouseLeave={handleMouseLeave}
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
