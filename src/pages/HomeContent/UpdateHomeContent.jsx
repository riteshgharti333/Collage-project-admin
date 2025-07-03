import "./UpdateHomeContent.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace, MdCloudUpload } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { baseUrl } from "../../main";

const UpdateHomeContent = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

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

  const [singleImage, setSingleImage] = useState("");

  useEffect(() => {
    const homeContentData = async () => {
      const { data } = await axios.get(`${baseUrl}/home-content/${id}`);
      setSingleImage(data.homeContent.image);
    };
    homeContentData();
  }, [id]);

  const addHomeContentImg = async () => {
    if (!file) {
      toast.error("Please select an image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.put(
        `${baseUrl}/home-content/${id}`,
        formData,
        {
          withCredentials: true,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (data && data.result === 1) {
        toast.success(data.message);
        navigate("/home-content-image");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error updating home content image:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="updateHomeContent">
      <div className="updateHomeContent-top">
        <Link onClick={() => navigate(-1)} className="back-icon">
          <MdKeyboardBackspace size={35} />
        </Link>
        <h1>Update Home Content Image</h1>
      </div>

      <div className="=updateHomeContent-container">
        <div className="image-upload-section">
          <div className="image-preview">
            <img src={previewUrl || singleImage} alt="Preview" />
          </div>

          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          <p className="rec-size" style={{ color: "#fff" }}>
            Recommended size: 200 × 250
          </p>

          <div className="button-group">
            <label htmlFor="fileInput" className="upload-btn">
              <MdCloudUpload size={20} />{" "}
              {file ? "Change Image" : "Upload Image"}
            </label>

            <button
              onClick={addHomeContentImg}
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

export default UpdateHomeContent;
