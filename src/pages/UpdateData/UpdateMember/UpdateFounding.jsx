import "./UpdateMember.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../main";
import { toast } from "sonner";

const UpdateFounding = () => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [singleData, setSingleData] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const getSingleData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/founder/${id}`);

        if (data && data.founder) {
          setSingleData(data.founder);
          setName(data.founder.name);
          setPosition(data.founder.position);
        }
      } catch (error) {
        console.error("Failed to fetch founding member:", error);
        toast.error("Failed to fetch founding member details");
      }
    };
    getSingleData();
  }, [id]);

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("position", position);

      if (file) {
        formData.append("image", file);
      }

      const { data } = await axios.put(`${baseUrl}/founder/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(data.message);
      navigate(-1);
    } catch (error) {
      console.error("Error updating founding member:", error);
      toast.error("Failed to update founding member!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newMember">
      <div className="newMember-top">
        <Link onClick={() => navigate(-1)} className="back-link">
          <h1>
            <RiArrowLeftWideFill className="member-icon" />
            Update Founding Member
          </h1>
        </Link>
      </div>

      <div className="newMember-contents">
        <div className="newMember-contents-card">
          <img
            src={selectedImage || singleData.image}
            alt="Selected Founding Member"
            className="member-img"
          />

          <div className="newMember-contents-card-desc">
            <div className="update-content">
              <span>Name : </span>
              <input
                type="text"
                placeholder="Enter name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="update-content">
              <span>Position : </span>
              <input
                type="text"
                placeholder="Enter position..."
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
          </div>

          <div className="member-btn">
            <button onClick={handleButtonClick} className="second-btn">
              <FaPlus className="change-icon" /> Add Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/*"
            />

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="success-btn"
            >
              {loading ? "Updating member..." : "Update member"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateFounding;
