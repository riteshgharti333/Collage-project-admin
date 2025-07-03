import { Link } from "react-router-dom";
import "./GalleryFolder.scss";
import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../../main";
import { toast } from "sonner";
import DragDropWrapper from "../../components/DragDropWrapper/DragDropWrapper";

const GalleryFolder = () => {
  const [folders, setFolders] = useState([]);
  const [deleteCard, setDeleteCard] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const cardRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [reorderLoading, setReorderLoading] = useState(false);

  const getAllFolder = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${baseUrl}/gallery-folder/all-gallery-folders`
      );

      if (data && data.result === 1) {
        setFolders(data.folders);
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
      toast.error(error.response?.data?.message || "Failed to fetch folders.");
    }
  }, []);

  useEffect(() => {
    getAllFolder();
  }, [getAllFolder]);

  // ✅ Handle Drag Drop Reorder
  const handleDrop = async (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    const updated = [...folders];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setFolders(updated);
    await updateBackendOrder(updated);
  };

  const updateBackendOrder = async (updatedFolders) => {
    setReorderLoading(true);
    try {
      const order = updatedFolders.map((folder) => folder._id);
      const { data } = await axios.patch(`${baseUrl}/gallery-folder/reorder`, {
        order,
      });
      if (data.result === 1) {
        toast.success("Gallery folders reordered successfully!");
      }
    } catch (error) {
      toast.error("Reordering failed.");
    } finally {
      setReorderLoading(false);
    }
  };

  const handleDelete = useCallback(async () => {
    if (!selectedFolderId) return;
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `${baseUrl}/gallery-folder/${selectedFolderId}`,
        {
          withCredentials: true,
        }
      );
      if (data.result === 1) {
        toast.success("Folder deleted successfully!");
        setFolders((prev) =>
          prev.filter((folder) => folder._id !== selectedFolderId)
        );
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setDeleteCard(false);
      setSelectedFolderId(null);
      setLoading(false);
    }
  }, [selectedFolderId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setDeleteCard(false);
      }
    };
    if (deleteCard) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [deleteCard]);

  const DeleteModal = () => (
    <div className="deleteImage">
      <div className="deleteImage-desc" ref={cardRef}>
        <h3>Are you sure you want to delete this folder?</h3>
        <div className="deleteImage-btns">
          <button
            className="delete-btn"
            disabled={loading}
            onClick={handleDelete}
          >
            {loading ? "Deleting..." : "Yes"}
          </button>
          <button className="success-btn" onClick={() => setDeleteCard(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="galleryFolder">
      <div className="galleryFolder-top">
        <h1>Gallery Folder</h1>
        <Link to={"/new-gallery-folder"} className="success-btn">
          Add New Gallery Folder
        </Link>
      </div>

      <div className="galleryFolder-cards">
        {folders?.length > 0 ? (
          <DragDropWrapper
            items={folders}
            onDrop={handleDrop}
            renderItem={(item, index) => (
              <div className="galleryFolder-card" key={item._id}>
                <Link
                  to={`/gallery-folder/${item._id}?title=${encodeURIComponent(
                    item.folderTitle
                  )}`}
                >
                  <img src={item.folderImage} alt={item.folderTitle} />
                  <p>{item.folderTitle}</p>
                </Link>

                <button
                  className="delete-btn"
                  onClick={() => {
                    setSelectedFolderId(item._id);
                    setDeleteCard(true);
                  }}
                >
                  Delete Folder
                </button>
              </div>
            )}
          />
        ) : (
          <p>No folders found. Add new folders!</p>
        )}
      </div>

      {deleteCard && <DeleteModal />}
    </div>
  );
};

export default GalleryFolder;
