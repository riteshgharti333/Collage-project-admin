import "./Gallery.scss";

import { useEffect, useRef, useState } from "react";
import { MdFullscreen, MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import { baseUrl } from "../../main";
import { toast } from "sonner";
import { Link, useNavigate, useParams } from "react-router-dom";

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [gallery, setGallery] = useState({});

  const [galleryImages, setGalleryImages] = useState([]);

  // Tooltip state
  const [tooltip, setTooltip] = useState({
    visible: false,
    text: "",
    x: 0,
    y: 0,
  });

  const cardRef = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    const getGallery = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/gallery-folder/${id}`);
        if (data && data.folder) {
          setGallery(data.folder);
          setGalleryImages(data.folder.galleryImages);
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
        toast.error("Failed to fetch gallery images");
      }
    };
    getGallery();
  }, []);

  const handleMouseEnter = (event, text) => {
    const { clientX, clientY } = event;
    setTooltip({
      visible: true,
      text,
      x: clientX + 10,
      y: clientY + 10,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, text: "", x: 0, y: 0 });
  };

  const navigate = useNavigate();

  return (
    <div className="gallery">
      <div className="gallery-top">
        <Link onClick={() => navigate(-1)} className="top-link">
          <h1>
            <MdKeyboardBackspace size={35} /> {gallery.folderTitle}
          </h1>
        </Link>
        <Link to={`/update-gallery-folder/${gallery._id}`}>
          <button className="success-btn">Update Gallery Images</button>
        </Link>
      </div>

      <div className="gallery-imgs">
        {galleryImages.length > 0 &&
          galleryImages.map((item, index) => (
            <div
              className="gallery-img"
              key={item.imageUrl}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={item.imageUrl}
                alt={item.imageUrl}
                loading="lazy"
                className={`${hoveredIndex === index ? "add-filter" : ""}`}
              />

              {hoveredIndex === index && (
                <div className="gallery-img-desc">
                  <MdFullscreen
                    className="gallery-icon"
                    onClick={() => setSelectedImg(item.imageUrl)}
                    onMouseEnter={(e) => handleMouseEnter(e, "Fullscreen View")}
                    onMouseLeave={handleMouseLeave}
                  />
                </div>
              )}
            </div>
          ))}
      </div>

      {selectedImg && (
        <div className="image-modal" onClick={() => setSelectedImg(null)}>
          <img src={selectedImg} alt="Fullscreen Preview" loading="lazy" />
          <span className="close-btn" onClick={() => setSelectedImg(null)}>
            ×
          </span>
        </div>
      )}

      {tooltip.visible && (
        <div
          className="tooltip"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default Gallery;
