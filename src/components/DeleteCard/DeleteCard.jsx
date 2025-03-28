import { useRef, useEffect, useState } from "react";
import "./DeleteCard.scss";
import axios from "axios";
import { baseUrl } from "../../main";
import { toast } from "sonner"; // ✅ Import toast for notifications
import { useNavigate } from "react-router-dom";

const DeleteCard = ({ onClose, id, path, onDeleteSuccess }) => {
  const cardRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!id || !path) return;

    setLoading(true);

    try {
      const { data } = await axios.delete(`${baseUrl}/${path}/${id}`);

      if (data.result === 1) {
        toast.success(data.message);

        if (onDeleteSuccess) {
          onDeleteSuccess(id);
        }
        navigate(-1);
        onClose();
      } else {
        toast.error(data.message || `Failed to ${action}!`);
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      toast.error(`Failed to ${action}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="deleteCard">
      <div className="deleteCard-desc" ref={cardRef}>
        <h3>
          {path === "student"
            ? "Are you sure you want to delete this student?"
            : "Are you sure you want to delete this form?"}
        </h3>
        <p className="deleteCard-note">
          Note : 
          {path === "student"
            ? " Deleting this student will permanently remove their record from the database."
            : " Deleting this form will permanently remove it from the database."}
        </p>
        <div className="deleteCard-btns">
          <button
            className="delete-btn"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes"}
          </button>
          <button className="success-btn" onClick={onClose} disabled={loading}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCard;
