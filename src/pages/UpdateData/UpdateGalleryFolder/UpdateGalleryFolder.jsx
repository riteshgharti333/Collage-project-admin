import "./UpdateGalleryFolder.scss";

import { Link, useNavigate, useParams } from "react-router-dom";
import { RiArrowLeftWideFill } from "react-icons/ri";
import { useState, useRef, useEffect } from "react";
import addImg from "../../../assets/images/addImg.svg";
import { baseUrl } from "../../../main";
import { toast } from "sonner";
import axios from "axios";
import { MdKeyboardBackspace } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";

const UpdateGalleryFolder = () => {
  const [folderImage, setFolderImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]); // New images
  const [existingImages, setExistingImages] = useState([]); // Existing images
  const [imagesToRemove, setImagesToRemove] = useState([]); // Images to remove

  const fileInputRef = useRef(null);

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };
  const [folderImageFile, setFolderImageFile] = useState(null);

  const handleFolderImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Folder image exceeds 2MB");
      return;
    }

    setFolderImage(URL.createObjectURL(file));
    setFolderImageFile(file); // Save file to send to server
  };

  const galleryInputRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  const [folderTitle, setFolderTitle] = useState("");

  useEffect(() => {
    const getGalleryData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/gallery-folder/${id}`);

        if (data && data.folder) {
          setFolderTitle(data?.folder.folderTitle);
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

  //  Handle Gallery Images Selection
  const handleGalleryImagesChange = (event) => {
    const files = Array.from(event.target.files);
    const validGalleryImages = [];

    files.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`Image "${file.name}" exceeds 2MB and was skipped.`);
      } else {
        validGalleryImages.push({
          imageUrl: URL.createObjectURL(file),
          file,
        });
      }
    });

    if (validGalleryImages.length > 0) {
      setGalleryImages((prev) => [...prev, ...validGalleryImages]);
    }
  };
  const handleRemoveExistingImage = (index) => {
    const imgToRemove = existingImages[index];
    setImagesToRemove((prev) => [...prev, imgToRemove.imageUrl]); // Store image URL to remove
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    setLoading(true);

    if (!folderTitle.trim()) {
      toast.error("Folder title is required");
      return;
    }

    const formData = new FormData();

    galleryImages.forEach((img) => {
      formData.append("galleryImages", img.file);
    });

    if (folderImageFile) {
      formData.append("folderImage", folderImageFile);
    }

    imagesToRemove.forEach((imgUrl) => {
      formData.append("imagesToRemove[]", imgUrl);
    });

    formData.append("folderTitle", folderTitle);

    try {
      const response = await axios.put(
        `${baseUrl}/gallery-folder/${id}`,
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
      <div className="updateGallery-top">
        <Link onClick={() => navigate(-1)} className="back-icon">
          <MdKeyboardBackspace size={35} />
        </Link>
        <h1>Update Gallery Images</h1>
      </div>

      <div className="updateGallery-content">
        <div className="updateGallery-content-details">
          <div className="updateGallery-content-details-card">
            <div className="updateGallery-content-details-left">
              <img src={folderImage} alt="Folder" />
              <div className="updateGallery-new-btn">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFolderImageChange}
                />

                <button
                  type="button"
                  className="success-btn"
                  onClick={handleFileInputClick}
                >
                  <FaPlus /> Change folder image
                </button>
              </div>

              <div className="updateGallery-title">
                <p>Folder Title:</p>
                <input
                  type="text"
                  value={folderTitle}
                  onChange={(e) => setFolderTitle(e.target.value)}
                  placeholder="Enter folder title"
                />
              </div>
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

        <div className="updateGallery-content-details">
          <div className="updateGallery-content-details-card">
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

            <p className="rec-size" style={{ color: "#fff" }}>
              Recommended size: Any size
            </p>

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
