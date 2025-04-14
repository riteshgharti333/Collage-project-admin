import "./NewGalleryFolder.scss";

import { Link, useNavigate } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { useState, useRef, useCallback } from "react";
import addImg from "../../../assets/images/addImg.svg";
import { baseUrl } from "../../../main";
import { toast } from "sonner";
import axios from "axios";
import { MdKeyboardBackspace } from "react-icons/md";

const NewGalleryFolder = () => {
  const [folderTitle, setFolderTitle] = useState("");
  const [folderImage, setFolderImage] = useState(null);
  const [folderFile, setFolderFile] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ Handle Folder Image Selection
  const handleFolderImageChange = useCallback((event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFolderImage(URL.createObjectURL(selectedFile));
      setFolderFile(selectedFile);
    }
  }, []);

  // ✅ Handle Gallery Images Selection
  const handleGalleryImagesChange = useCallback((event) => {
    const files = Array.from(event.target.files);
    const newGalleryImages = files.map((file) => ({
      imageUrl: URL.createObjectURL(file),
      file,
    }));
    setGalleryImages((prev) => [...prev, ...newGalleryImages]);
  }, []);

  // ✅ Remove Image
  const handleRemoveImage = useCallback((index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ✅ Form Submission with Cloudinary Upload
  const handleSaveToDatabase = useCallback(async () => {
    if (!folderTitle || !folderFile || galleryImages.length === 0) {
      toast.error(
        "Folder title, folder image, and gallery images are required!"
      );
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("folderTitle", folderTitle);
    formData.append("folderImage", folderFile);

    galleryImages.forEach((img) => {
      formData.append("galleryImages", img.file);
    });

    try {
      const response = await axios.post(
        `${baseUrl}/gallery-folder/new-gallery-folder`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.result === 1) {
        toast.success("Gallery folder created successfully!");
        navigate(`/gallery-folder`);
      }
    } catch (error) {
      console.error("Error creating gallery folder:", error);
      toast.error("Failed to create gallery folder.");
    } finally {
      setLoading(false);
    }
  }, [folderTitle, folderFile, galleryImages, navigate]);

  return (
    <div className="newGalleryFolder">
      {/* Top Section */}
      <div className="newGallery-top">
        <Link onClick={() => navigate(-1)} className="back-icon">
          <MdKeyboardBackspace size={35} />
        </Link>
        <h1>Add New Gallery Folder</h1>
      </div>

      {/* Content Section */}
      <div className="newGallery-content">
        {/* Folder Image Upload */}
        <div className="newGallery-content-details">
          <div className="newGallery-content-details-card">
            <div
              className={`newGallery-content-details-left ${
                folderImage ? "bg-none" : ""
              }`}
              onClick={() => fileInputRef.current.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload Folder Image"
            >
              {folderImage ? (
                <img src={folderImage} className="main-image" alt="Folder" />
              ) : (
                <>
                  <img
                    src={addImg}
                    alt="Add Folder Image"
                    className="addimage"
                  />
                  <p>Add Folder Image</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFolderImageChange}
              />
            </div>

            {/* Folder Title */}
            <div className="gallery-folder-input">
              <label htmlFor="folderTitle">Folder Title:</label>
              <input
                type="text"
                id="folderTitle"
                placeholder="Folder title..."
                value={folderTitle}
                onChange={(e) => setFolderTitle(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Display Added Gallery Images */}
        <div className="added-photos">
          {galleryImages.map((photo, index) => (
            <div key={index} className="photo-item">
              <img src={photo.imageUrl} alt="Photo" className="photo-thumb" />
              <div className="added-photos-btn">
                <button
                  className="delete-btn"
                  onClick={() => handleRemoveImage(index)}
                  aria-label="Delete Photo"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery Images Upload */}
        <div className="newGallery-content-details">
          <div className="newGallery-content-details-card">
            <div
              className="newGallery-content-details-left"
              onClick={() => galleryInputRef.current.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload Gallery Images"
            >
              <img src={addImg} alt="Add Gallery Images" className="addimage" />
              <p>Add Gallery Images</p>

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleGalleryImagesChange}
              />
            </div>

            {/* Save & Upload Buttons */}
            <div className="photo-add-btn">
              <button
                onClick={handleSaveToDatabase}
                className="success-btn"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Gallery Folder"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewGalleryFolder;
