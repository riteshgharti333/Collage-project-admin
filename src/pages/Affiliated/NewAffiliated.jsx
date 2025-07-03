import "./NewAffiliated.scss";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace, MdCloudUpload } from "react-icons/md";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { baseUrl } from "../../main";

const NewAffiliated = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const maxSize = 2 * 1024 * 1024;

      if (selectedFile.size > maxSize) {
        toast.error("Image size should be less than 2 MB");
        return;
      }

      const imageUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(imageUrl);
      setFile(selectedFile);
    }
  };

  const addAffiliate = async () => {
    if (!file) {
      toast.error("Please select an image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post(
        `${baseUrl}/affiliate/new-affiliate`,
        formData,
        {
          withCredentials: true,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (data && data.result == 1) {
        toast.success(data.message);
        navigate("/affiliated-colleges");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error adding affiliate:", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newAffiliated">
      <div className="newAffiliated-top">
        <Link onClick={() => navigate(-1)} className="back-icon">
          <MdKeyboardBackspace size={35} />
        </Link>
        <h1>Admission Form</h1>
      </div>

      <div className="newAffiliated-container">
        <div className="image-upload-section">
          <div className="image-preview">
            {previewUrl ? (
              <img src={previewUrl} alt="Selected" />
            ) : (
              <div className="placeholder">No Image Selected</div>
            )}
          </div>

          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          <p className="rec-size" style={{ color: "#fff" }}>
            Recommended size: 300 × 170
          </p>

          <div className="button-group">
            <label htmlFor="fileInput" className="upload-btn">
              <MdCloudUpload size={20} />{" "}
              {file ? "Change Image" : "Upload Image"}
            </label>

            <button
              onClick={addAffiliate}
              className="success-btn"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAffiliated;
