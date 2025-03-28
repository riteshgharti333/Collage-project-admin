import "./NewGallery.scss";
import { Link, useNavigate } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { useState, useRef, useCallback } from "react";
import addImg from "../../../assets/images/addImg.svg";
import { baseUrl } from "../../../main";
import { toast } from "sonner";
import axios from "axios";

const NewGallery = () => {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [photoAlbums, setPhotoAlbums] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Handle image selection
  const handleImageChange = useCallback((event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setImage(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
    }
  }, []);

  // Open file input
  const handleClick = useCallback(() => {
    fileInputRef.current.click();
  }, []);

  // Add photo album image without uploading
  const handleAddPhoto = useCallback(() => {
    if (!file) {
      toast.error("Please add images before adding.");
      return;
    }

    const newPhoto = { image: URL.createObjectURL(file), file };
    setPhotoAlbums((prev) => [...prev, newPhoto]);
    setImage(null);
    setFile(null);
  }, [file]);

  // Remove photo from album
  const handleRemovePhoto = useCallback((index) => {
    setPhotoAlbums((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Upload all images to Cloudinary & save to database
  const handleSaveToDatabase = useCallback(async () => {
    if (photoAlbums.length === 0) {
      toast.error("Please add at least one photo before saving.");
      return;
    }

    setLoading(true);

    try {
      // Prepare the payload
      const payload = {
        images: photoAlbums.map((photo) => ({
          img: photo.image,
        })),
      };
      const response = await axios.post(
        `${baseUrl}/gallery/new-gallery`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        toast.success(response.data.message);
        navigate(`/gallery`);
      }
    } catch (error) {
      console.error("Error saving photo album:", error);
      toast.error("Failed to save photo album.");
    } finally {
      setLoading(false);
    }
  }, [photoAlbums, navigate]);

  return (
    <div className="newGallery">
      {/* Top Section */}
      <div className="newGallery-top">
        <Link onClick={() => navigate(-1)} className="back-link">
          <h1>
            <RiArrowLeftWideFill className="newGallery-icon" />
            Add New Images
          </h1>
        </Link>
      </div>

      {/* Content Section */}
      <div className="newGallery-content">
        {/* Display Added Photos */}
        <div className="added-photos">
          {photoAlbums.map((photo, index) => (
            <div key={index} className="photo-item">
              <img src={photo.image} alt="Photo" className="photo-thumb" />
              <div className="added-photos-btn">
                <button
                  className="delete-btn"
                  onClick={() => handleRemovePhoto(index)}
                  aria-label="Delete Photo"
                >
                  Remove Image
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Photo Upload Section */}
        <div className="newGallery-content-details">
          <div className="newGallery-content-details-card">
            <div
              className={`newGallery-content-details-left ${
                image ? "bg-none" : ""
              }`}
              onClick={handleClick}
              role="button"
              tabIndex={0}
              aria-label="Upload Photo"
            >
              {image ? (
                <img src={image} className="main-image" alt="Selected Photo" />
              ) : (
                <>
                  <img src={addImg} alt="Add Photo" className="addimage" />
                  <p>Add Photo</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>

            <div className="photo-add-btn">
              <button onClick={handleAddPhoto} className="success-btn">
                Add Images
              </button>

              <button
                onClick={handleSaveToDatabase}
                className="success-btn"
                disabled={loading}
              >
                {loading ? "Saving Gallery Images..." : "Save Gallery Images"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewGallery;
