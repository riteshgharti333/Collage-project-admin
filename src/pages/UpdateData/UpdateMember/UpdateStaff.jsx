import "./UpdateMember.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../main";
import { toast } from "sonner";
import { MdKeyboardBackspace } from "react-icons/md";
import ImageCropModal from "../../../components/ImageCropModel/ImageCropModel";

const UpdateStaff = () => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [singleData, setSingleData] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");

  const [cropSrc, setCropSrc] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
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

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const getSingleData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/staff/${id}`);

        if (data && data.staff) {
          setSingleData(data.staff);
          setName(data.staff.name);
          setPosition(data.staff.position);
          setLocation(data.staff.location);
        }
      } catch (error) {
        console.error("Failed to fetch staff:", error);
        toast.error("Failed to fetch staff details");
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
      formData.append("location", location);

      if (file) {
        formData.append("image", file);
      }

      const { data } = await axios.put(
        `${baseUrl}/staff/${id}`,
        formData,
        {
          withCredentials: true,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(data.message);
      navigate(-1);
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error(error.response.data.message);
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
        <h1>Update Staff Member</h1>
      </div>

      <div className="newMember-contents">
        <div className="newMember-contents-card">
          <img
            src={selectedImage || singleData.image}
            alt="Selected Staff Member"
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
              <FaPlus className="change-icon" /> Add Image
            </button>

            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
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
              {loading ? "Updating Staff..." : "Update Staff"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStaff;
