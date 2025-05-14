import { sliderImage } from "../../assets/data";
import "./Affiliated.scss";
import { Link } from "react-router-dom";

import axios from "axios";

import { baseUrl } from "../../main";
import { toast } from "sonner";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";

const Affiliated = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [allData, setAllData] = useState([]);
  const [deleteImg, setDeleteImg] = useState(false);
  const [deleteData, setDeleteData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/affiliate/all-affiliates`);
        if (data && data.affiliated) {
          setAllData(data.affiliated);
        }
      } catch (error) {
        console.error("Error fetching affiliate images:", error);
      }
    };

    fetchData();
  }, []);

  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setDeleteImg(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [deleteImg]);

  const deleteImage = async (id) => {
    if (!id) return;

    setLoading(true);

    try {
      const { data } = await axios.delete(`${baseUrl}/affiliate/${id}`);

      if (data && data.result == 1) {
        toast.success(data.message);
        toast.success(data.message);
        setDeleteImg(false);
      }
      setAllData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting affiliate:", error);
      toast.error("Failed to delete affiliate!");
    } finally {
      setLoading(false);
    }
  };

  const DeleteImage = ({ id, onClose }) => (
    <div className="deleteImage">
      <div className="deleteImage-desc" ref={cardRef}>
        <h3>Delete this image?</h3>
        <div className="deleteImage-btns">
          <button
            className="delete-btn"
            disabled={loading}
            onClick={() => deleteImage(id)}
          >
            {loading ? "Deleting..." : "Yes"}
          </button>
          <button className="success-btn" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="affiliated">
      <div className="affiliated-top">
        <h1>New Affiliated Image</h1>
        <Link to={"/new-affiliated-colleges"} className="success-btn">
          Add new affiliated colleges
        </Link>
      </div>

      <div className="affiliated-cards">
        {allData.map((item, index) => (
          <div className="affiliated-card" key={index}>
            <img src={item.image} alt="" />
            <button
              className="delete-btn"
              onClick={() => {
                setDeleteData({ id: item._id });
                setDeleteImg(true);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {deleteImg && (
        <DeleteImage id={deleteData.id} onClose={() => setDeleteImg(false)} />
      )}
    </div>
  );
};

export default Affiliated;
