import React, { useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./ImageCropModel.scss";

// Function to crop image and preserve transparency if format supports it
const getCroppedImg = (image, crop, format = "image/png") => {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  // Clear canvas to support transparency
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      format,
      1
    );
  });
};

// Function to detect format from file extension or MIME
const getImageFormat = (src) => {
  if (src.includes("image/jpeg") || src.endsWith(".jpg") || src.endsWith(".jpeg")) return "image/jpeg";
  if (src.includes("image/webp") || src.endsWith(".webp")) return "image/webp";
  return "image/png"; // Default to PNG for transparency support
};

const ImageCropModal = ({ src, onClose, onCropDone }) => {
  const imgRef = useRef(null);
  const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);

  const handleSave = async () => {
    if (!imgRef.current || !completedCrop) return;

    try {
      const format = getImageFormat(src);
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop, format);
      const croppedUrl = URL.createObjectURL(croppedBlob);
      onCropDone({ blob: croppedBlob, url: croppedUrl });
      onClose();
    } catch (err) {
      console.error("Crop failed:", err);
    }
  };

  return (
    <div className="crop-modal">
      <div className="crop-modal-content">
        <h3>Crop Image</h3>
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={1}
        >
          <img
            ref={imgRef}
            src={src}
            alt="To crop"
            style={{ maxWidth: "100%" }}
          />
        </ReactCrop>
        <div className="crop-modal-buttons">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="success-btn" onClick={handleSave}>
            Save Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
