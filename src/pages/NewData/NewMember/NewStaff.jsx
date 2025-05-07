import "./NewMember.scss";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { useRef, useState } from "react";
import AddImg from "../../../assets/images/addImg.svg";
import axios from "axios";
import { baseUrl } from "../../../main";
import { toast } from "sonner";
import { MdKeyboardBackspace } from "react-icons/md";
import ImageCropModal from "../../../components/ImageCropModel/ImageCropModel";

const NewStaff = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

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
  };

  const handleCropDone = ({ blob, url }) => {
    setSelectedImage(url);
    setFile(new File([blob], "cropped.jpg", { type: "image/jpeg" }));
  };

  const handleButtonClick = () => fileInputRef.current.click();

  const handleSubmit = async () => {
    if (!name || !position || !location || !file) {
      toast.error("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("position", position);
    formData.append("location", location);
    formData.append("image", file);

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${baseUrl}/staff/new-staff`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(data.message);
      navigate(-1);
    } catch (error) {
      console.error("Error creating staff:", error);
      toast.error("Failed to add staff member.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newMember">
      {showCropModal && (
        <ImageCropModal
          src={cropSrc}
          onClose={() => setShowCropModal(false)}
          onCropDone={handleCropDone}
        />
      )}

      <div className="newMember-top">
        <Link onClick={() => navigate(-1)} className="back-icon">
          <MdKeyboardBackspace size={35} />
        </Link>
        <h1>New Staff Member</h1>
      </div>

      <div className="newMember-contents">
        <div className="newMember-contents-card">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected Staff"
              className="member-img"
            />
          ) : (
            <div
              className="add-img-member"
              onClick={handleButtonClick}
              role="button"
              tabIndex={0}
              aria-label="Upload Staff Image"
            >
              <img src={AddImg} alt="Add Staff" className="add-member-img" />
              <p>Add Staff Member Image</p>
            </div>
          )}

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

            <div className="update-content">
              <span>Location : </span>
              <input
                type="text"
                placeholder="Enter location..."
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
              <FaPlus className="change-icon" />{" "}
              {selectedImage ? "Change Image" : "Add Image"}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/*"
            />

            <button
              disabled={loading}
              className="success-btn"
              onClick={handleSubmit}
            >
              {loading ? "Adding Staff..." : "Add Staff"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewStaff;
