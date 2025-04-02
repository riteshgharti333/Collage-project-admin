import { useEffect, useRef, useState } from "react";
import "./SinglePage.scss";
import DeleteCard from "../../components/DeleteCard/DeleteCard";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import { baseUrl } from "../../main";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MdKeyboardBackspace } from "react-icons/md";

const SingleStudent = () => {
  const [openDeleteCard, setDeleteCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);

  const [singleData, setSingleData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const getSingleData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/student/${id}`);
        if (data && data.student) {
          setSingleData(data.student);
        }
      } catch (error) {
        console.error("Failed to fetch student:", error);
        toast.error("Failed to fetch student");
      }
    };
    getSingleData();
  }, [id]);

  // ✅ Utility function to format date to `DD/MM/YYYY`
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const dateObj = new Date(isoDate);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const { _id, name, enrollmentId, certificateNo, course, duration, date } =
    singleData;

  const admissionDetails = [
    { label: "Name", value: name },
    { label: "Enrollment Id", value: enrollmentId },
    { label: "Certificate No", value: certificateNo },
    { label: "Course", value: course },
    { label: "Duration", value: `${duration} Year` },
    { label: "Date", value: formatDate(date) },
  ];

  const navigate = useNavigate();

  return (
    <div className="single-page">
      <div className="single-page-top">
        <Link onClick={() => navigate(-1)} className="back-icon">
          <MdKeyboardBackspace size={35} />
        </Link>
        <h1>Certificate</h1>
      </div>

      {openDeleteCard && (
        <DeleteCard
          onClose={() => setDeleteCard(false)}
          id={_id}
          path="student"
        />
      )}

      <div className="single-page-content">
        <h2 className="single-page-form-title">Certificate Details</h2>
        <div className="single-page-form-content">
          <ul className="single-page-form-list">
            {admissionDetails.map((item, index) => (
              <li key={index} className="single-page-form-item">
                <span className="single-page-form-label">
                  <strong>{item.label} :</strong>
                </span>
                <span className="single-page-form-value">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="single-page-btns">
        <Link to={`/update-student/${id}`} className="success-btn">
          Update
        </Link>

        <button
          className="delete-btn"
          onClick={() => setDeleteCard(!openDeleteCard)}
        >
          <AiOutlineCloseCircle className="btn-icon" />
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default SingleStudent;
