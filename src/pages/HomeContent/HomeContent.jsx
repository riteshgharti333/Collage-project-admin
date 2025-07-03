import "./HomeContent.scss";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../main";
import { toast } from "sonner";

const HomeContent = () => {
  const [allData, setAllData] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [originalData, setOriginalData] = useState({
    title: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHomeContentDetails = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/home-content-details/only`
        );
        if (data && data.content) {
          setFormData({
            title: data.content.title || "",
            description: data.content.description || "",
          });
          setOriginalData({
            title: data.content.title || "",
            description: data.content.description || "",
          });
        }
      } catch (err) {
        console.error("Error fetching home content details:", err);
      }
    };

    const fetchHomeContentImages = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/home-content/all-homeContent-images`
        );
        if (data && data.homeContent) {
          setAllData(data.homeContent);
        }
      } catch (err) {
        console.error("Error fetching home content images:", err);
      }
    };

    fetchHomeContentDetails();
    fetchHomeContentImages();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${baseUrl}/home-content-details/update`,
        formData,
        {
          withCredentials: true,
        }
      );
      if (data && data.success) {
        toast.success(data.message);
        setOriginalData(formData);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating home content details:", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homeContent">
      <div className="homeContent-top">
        <h1>Home Content</h1>
      </div>

      <div className="home-content-detail">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Enter title..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            rows="8"
            value={formData.description}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Enter description..."
          />
        </div>

        <div className="home-content-detail-btns">
          {isEditing ? (
            <>
              <button className="delete-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button className="success-btn" onClick={handleSave}>
                Save
              </button>
            </>
          ) : (
            <button
              className="success-btn"
              disabled={loading}
              onClick={handleEdit}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          )}
        </div>
      </div>

      <div className="homeContent-cards">
        {allData.map((item, index) => (
          <div className="homeContent-card" key={index}>
            <img src={item.image} alt="" />
            <Link
              to={`/update-home-content-image/${item._id}`}
              className="success-btn"
            >
              Update
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeContent;
