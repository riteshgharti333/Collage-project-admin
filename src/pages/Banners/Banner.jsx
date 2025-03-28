import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Banner.scss";
import { FiPlusCircle } from "react-icons/fi";
import axios from "axios";
import { baseUrl } from "../../main";
import { toast } from "sonner";

const Banner = () => {
  const { bannerType, id } = useParams();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [singleBanner, setSingleBanner] = useState("");

  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection and preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Fetch banner details on component mount
  useEffect(() => {
    const getBanner = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/banner/${bannerType}/${id}`
        );
        if (data && data.image) {
          setSingleBanner(data.image);
        }
      } catch (error) {
        console.error("Failed to fetch banner:", error);
      }
    };
    getBanner();
  }, [bannerType, id]);

  // Update the banner
  const handleUpdate = async () => {
    if (!selectedFile) {
      toast.error("No file selected!");
      return;
    }

    setLoading(true);

    try {
      // ✅ Create FormData
      const formData = new FormData();
      formData.append("image", selectedFile); // Image file

      // ✅ Send FormData to the API
      const { data } = await axios.put(
        `${baseUrl}/banner/${bannerType}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for FormData
          },
        }
      );

      if (data) {
        toast.success(data.message);

        // ✅ Display the updated image
        const tempUrl = URL.createObjectURL(selectedFile);
        setSingleBanner(tempUrl);
      }
    } catch (error) {
      console.error("Failed to update banner:", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="banner">
      <div className="banner-top">
        <h1>{bannerType.split("-").join(" ").toLowerCase()}</h1>
      </div>

      <div className="banner-content">
        <img
          src={preview || singleBanner}
          alt="Banner Preview"
          loading="lazy"
        />

        <div className="banner-btns">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*"
          />

          <button
            className="success-btn"
            onClick={() => fileInputRef.current.click()}
          >
            <FiPlusCircle className="plus-icon" />
            Change Banner
          </button>

          <button
            className="success-btn"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating.." : " Update Banner"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
