import "./UpdateAlumni.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../main";
import { toast } from "sonner";
import { MdKeyboardBackspace } from "react-icons/md";
import ImageCropModal from "../../../components/ImageCropModel/ImageCropModel"; // Import Image Crop Modal

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
  const [location, setLocation] = useState("");
  const [designation, setDesignation] = useState("");

  // Crop-related state
  const [cropSrc, setCropSrc] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const maxSize = 2 * 1024 * 1024;

      if (file.size > maxSize) {
        toast.error("Image must be less than 2MB!");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCropSrc(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropDone = ({ blob, url }) => {
    setSelectedImage(url);
    setFile(new File([blob], "cropped.jpg", { type: "image/jpeg" }));
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
          setLocation(data.alumni.location);
          setDesignation(data.alumni.designation);
        }
      } catch (error) {
        console.error("Failed to fetch alumni:", error);
        toast.error("Failed to fetch alumni details");
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
      formData.append("location", location);
      formData.append("designation", designation);


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
        <Link onClick={() => navigate(-1)} className="back-icon">
          <MdKeyboardBackspace size={35} />
        </Link>
        <h1>Update Alumni</h1>
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
              <span>Designation : </span>
              <input
                type="text"
                placeholder="Enter desgination..."
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
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
            <div className="update-content">
              <span>Location : </span>
              <input
                type="text"
                placeholder="Enter company name..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <p className="rec-size" style={{ color: "#000", marginTop: "20px" }}>
            Recommended size: 400 x 400
          </p>

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

            {showCropModal && cropSrc && (
              <ImageCropModal
                src={cropSrc}
                onClose={() => setShowCropModal(false)}
                onCropDone={handleCropDone}
              />
            )}

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
