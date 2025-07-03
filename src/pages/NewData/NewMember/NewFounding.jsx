import "./NewMember.scss";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { useRef, useState } from "react";
import AddImg from "../../../assets/images/addImg.svg";
import axios from "axios";
import { baseUrl } from "../../../main";
import { toast } from "sonner";
import { MdKeyboardBackspace } from "react-icons/md";
import ImageCropModal from "../../../components/ImageCropModel/ImageCropModel"; // Import ImageCropModal

const NewFounding = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCropModal, setShowCropModal] = useState(false); // State to control modal visibility
  const [cropSrc, setCropSrc] = useState(null); // To store the image source for cropping

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (selectedFile.size > maxSize) {
        toast.error("Image must be less than 2MB!");
        return;
      }

      // Display the file in the modal for cropping
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropSrc(reader.result);
        setShowCropModal(true); // Show the cropping modal
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Handle crop completion and store the cropped image
  const handleCropDone = ({ blob, url }) => {
    setSelectedImage(url); // Set cropped image preview
    setFile(new File([blob], "cropped.jpg", { type: "image/jpeg" })); // Save the cropped image
    setShowCropModal(false); // Close the modal
  };

  // Trigger file input when the button is clicked
  const handleButtonClick = () => fileInputRef.current.click();

  // Handle form submission
  const handleSubmit = async () => {
    if (!name || !position || !file) {
      toast.error("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("position", position);
    formData.append("image", file);

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${baseUrl}/founder/new-founder`,
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
      navigate("/mentor");
    } catch (error) {
      console.error("Error creating staff:", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newMember">
      {/* Display the crop modal if needed */}
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
        <h1>New Mentor</h1>
      </div>

      <div className="newMember-contents">
        <div className="newMember-contents-card">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected Staff Member"
              className="member-img"
            />
          ) : (
            <div
              className="add-img-member"
              onClick={handleButtonClick}
              role="button"
              tabIndex={0}
              aria-label="Upload Mentor Image"
            >
              <img src={AddImg} alt="Add Staff" className="add-member-img" />
              <p>Add Mentor Image</p>
            </div>
          )}

          <div className="newMember-contents-card-desc">
            <div className="update-content">
              <span>Name: </span>
              <input
                type="text"
                placeholder="Enter name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="update-content">
              <span>Position: </span>
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
              style={{ display: "none" }}
              accept="image/*"
            />

            <button
              disabled={loading}
              className="success-btn"
              onClick={handleSubmit}
            >
              {loading ? "Adding mentor..." : "Add Mentor"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFounding;
