import { useEffect, useState } from "react";
import "./NewStudent.scss";
import axios from "axios";
import { baseUrl } from "../../../main";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MdKeyboardBackspace } from "react-icons/md";

const NewStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    enrollmentId: "",
    certificateNo: "",
    course: "",
    duration: "",
    date: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ✅ Handle New Student Creation
  const handleNewStudent = async () => {
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${baseUrl}/student/new-student`,
        formData
      ); // ✅ No ID in the route

      if (data.result === 1) {
        toast.success(data.message);
        navigate(-1);
      } else {
        toast.error(data.message || "Failed to add student.");
      }
    } catch (error) {
      console.error("Error during creation:", error);
      toast.error(error.response?.data?.message || "Failed to add student.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-student-page">
      <div className="single-page-top">
        <Link onClick={() => navigate(-1)} className="back-icon">
          <MdKeyboardBackspace size={35} />
        </Link>
        <h1>Add New Certificate</h1>
      </div>

      <div className="single-page-content">
        <h2 className="single-page-form-title">Add Certificate Details</h2>

        <div className="single-page-form-content">
          <ul className="single-page-form-list">
            <li className="single-page-form-item">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Add name"
              />
            </li>

            <li className="single-page-form-item">
              <label>Enrollment ID:</label>
              <input
                type="text"
                name="enrollmentId"
                value={formData.enrollmentId}
                onChange={handleInputChange}
                placeholder="Add enrollment id"
              />
            </li>

            <li className="single-page-form-item">
              <label>Certificate No:</label>
              <input
                type="text"
                name="certificateNo"
                value={formData.certificateNo}
                onChange={handleInputChange}
                placeholder="Add certificate no"
              />
            </li>

            <li className="single-page-form-item">
              <label>Course:</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                placeholder="Add course"
              />
            </li>

            <li className="single-page-form-item">
              <label>Duration (Year):</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="Add duration"
              />
            </li>

            <li className="single-page-form-item">
              <label>Date (YYYY-MM-DD):</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </li>
          </ul>
        </div>
      </div>

      <div className="single-page-btns">
        <button
          className="success-btn"
          onClick={handleNewStudent}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Certificate"}
        </button>
      </div>
    </div>
  );
};

export default NewStudent;
