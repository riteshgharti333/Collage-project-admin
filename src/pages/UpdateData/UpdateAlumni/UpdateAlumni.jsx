import "./UpdateAlumni.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../main";
import { toast } from "sonner";

const UpdateAlumni = () => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [singleData, setSingleData] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");

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
        const { data } = await axios.get(`${baseUrl}/alumni/${id}`);

        if (data && data.alumni) {
          setSingleData(data.alumni);
          setName(data.alumni.name);
          setCompany(data.alumni.company);
        }
      } catch (error) {
        console.error("Failed to fetch alumni:", error);
        toast.error(error.resposnce.data.message);
      }
    };
    getSingleData();
  }, [id]);

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("company", company);

      if (file) {
        formData.append("image", file);
      }

      const { data } = await axios.put(`${baseUrl}/alumni/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(data.message);
      navigate(-1);
    } catch (error) {
      console.error("Error updating alumni:", error);
      toast.error("Failed to update alumni member!");
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
            Update Alumni
          </h1>
        </Link>
      </div>

      <div className="newMember-contents">
        <div className="newMember-contents-card">
          <img
            src={selectedImage || singleData.image}
            alt="Selected alumni"
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
              <span>Company : </span>
              <input
                type="text"
                placeholder="Enter company name..."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
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
              {loading ? "Updating alumni..." : "Update alumni"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAlumni;
