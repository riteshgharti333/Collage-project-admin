import "./UpdateMember.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../main";
import { toast } from "sonner";
import { MdKeyboardBackspace } from "react-icons/md";
import ImageCropModal from "../../../components/ImageCropModel/ImageCropModel";

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
    setShowCropModal(false);
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
      const { data } = await axios.put(
        `${baseUrl}/founder/${id}`,
        formData,
        {
          withCredentials: true,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(data.message);
      navigate(-1);
    } catch (error) {
      console.error("Error updating founding member:", error);
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
        <h1>Update Founding Member</h1>
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
              accept="image/*"
              style={{ display: "none" }}
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
              {loading ? "Updating member..." : "Update member"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateFounding;
