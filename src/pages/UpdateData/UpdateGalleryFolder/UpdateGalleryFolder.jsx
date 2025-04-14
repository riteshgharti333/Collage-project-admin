import "./UpdateGalleryFolder.scss";

import { Link, useNavigate, useParams } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { useState, useRef, useEffect } from "react";
import addImg from "../../../assets/images/addImg.svg";
import { baseUrl } from "../../../main";
import { toast } from "sonner";
import axios from "axios";
import { MdKeyboardBackspace } from "react-icons/md";

const UpdateGalleryFolder = () => {
  const [folderImage, setFolderImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]); // New images
  const [existingImages, setExistingImages] = useState([]); // Existing images
  const [imagesToRemove, setImagesToRemove] = useState([]); // Images to remove

  const galleryInputRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  // ✅ Fetch Gallery Folder Data
  useEffect(() => {
    const getGalleryData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/gallery-folder/${id}`);

        if (data && data.folder) {
          setFolderImage(data.folder.folderImage);
          setExistingImages(data.folder.galleryImages);
        }
      } catch (error) {
        console.error("Error fetching gallery data:", error);
        toast.error("Failed to load gallery data.");
      }
    };

    getGalleryData();
  }, [id]);

  // ✅ Handle Gallery Images Selection
  const handleGalleryImagesChange = (event) => {
    const files = Array.from(event.target.files);
    const newGalleryImages = files.map((file) => ({
      imageUrl: URL.createObjectURL(file),
      file,
    }));
    setGalleryImages((prev) => [...prev, ...newGalleryImages]);
  };

  // ✅ Handle Remove Existing Image
  const handleRemoveExistingImage = (index) => {
    const imgToRemove = existingImages[index];
    setImagesToRemove((prev) => [...prev, imgToRemove.imageUrl]); // Store image URL to remove
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Handle Remove New Images (unsaved images)
  const handleRemoveNewImage = (index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    if (galleryImages.length === 0 && imagesToRemove.length === 0) {
      toast.error("No changes made. Add or remove images.");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    // ✅ Append new images properly
    galleryImages.forEach((img) => {
      formData.append("galleryImages", img.file);
    });

    // ✅ Append imagesToRemove as an array correctly
    imagesToRemove.forEach((imgUrl) => {
      formData.append("imagesToRemove[]", imgUrl); // ✅ Send as array
    });

    try {
      const response = await axios.put(
        `${baseUrl}/gallery-folder/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.result === 1) {
        toast.success("Gallery images updated successfully!");
        navigate("/gallery-folder");
      }
    } catch (error) {
      console.error("Error updating gallery folder:", error);
      toast.error(error.response?.data?.message || "Failed to update images.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="updateGalleryFolder">
      <div className="newGallery-top">
        <Link onClick={() => navigate(-1)} className="back-icon">
          <MdKeyboardBackspace size={35} />
        </Link>
        <h1>Update Gallery Images</h1>
      </div>

      <div className="newGallery-content">
        <div className="newGallery-content-details">
          <div className="newGallery-content-details-card">
            <div className="newGallery-content-details-left">
              <img src={folderImage} alt="Folder" />
            </div>
          </div>
        </div>

        <h3 className="title-top">Existing Images:</h3>
        <div className="added-photos">
          {existingImages.map((img, index) => (
            <div key={index} className="photo-item">
              <img src={img.imageUrl} alt="Photo" className="photo-thumb" />
              <button
                className="delete-btn"
                onClick={() => handleRemoveExistingImage(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <h3 className="title-top">New Images:</h3>
        <div className="added-photos">
          {galleryImages.map((photo, index) => (
            <div key={index} className="photo-item">
              <img src={photo.imageUrl} alt="Photo" className="photo-thumb" />
              <button
                className="delete-btn"
                onClick={() => handleRemoveNewImage(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="newGallery-content-details">
          <div className="newGallery-content-details-card">
            <div
              className="update-gallery"
              onClick={() => galleryInputRef.current.click()}
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

            <button
              onClick={handleUpdate}
              className="success-btn"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Images"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateGalleryFolder;
