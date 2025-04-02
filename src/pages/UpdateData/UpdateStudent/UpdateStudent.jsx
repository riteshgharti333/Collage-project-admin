import { useEffect, useState } from "react";
import "./UpdateStudent.scss";
import axios from "axios";
import { baseUrl } from "../../../main";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { MdKeyboardBackspace } from "react-icons/md";

const UpdateStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    enrollmentId: "",
    certificateNo: "",
    course: "",
    duration: "",
    date: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ Fetch student data
  useEffect(() => {
    const getSingleData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/student/${id}`);
        if (data && data.student) {
          // Format date to `YYYY-MM-DD` for input type="date"
          const formattedDate = new Date(data.student.date)
            .toISOString()
            .split("T")[0];

          setFormData({
            name: data.student.name || "",
            enrollmentId: data.student.enrollmentId || "",
            certificateNo: data.student.certificateNo || "",
            course: data.student.course || "",
            duration: data.student.duration || "",
            date: formattedDate,  // Set formatted date
          });
        }
      } catch (error) {
        console.error("Failed to fetch student:", error);
        toast.error("Failed to fetch student");
      }
    };
    getSingleData();
  }, [id]);

  // ✅ Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ✅ Handle Update
  const handleUpdate = async () => {
    setLoading(true);

    try {
      const { data } = await axios.put(`${baseUrl}/student/${id}`, formData);

      if (data.result === 1) {
        toast.success("Student updated successfully!");
        navigate(-1); // Go back after update
      } else {
        toast.error(data.message || "Failed to update student.");
      }
    } catch (error) {
      console.error("Error during update:", error);
      toast.error("Failed to update student. Please try again.");
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
        <h1>Update Student</h1>
      </div>

      <div className="single-page-content">
        <h2 className="single-page-form-title">Update Certificate Details</h2>

        <div className="single-page-form-content">
          <ul className="single-page-form-list">
            <li className="single-page-form-item">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </li>

            <li className="single-page-form-item">
              <label>Enrollment ID:</label>
              <input
                type="text"
                name="enrollmentId"
                value={formData.enrollmentId}
                onChange={handleInputChange}
              />
            </li>

            <li className="single-page-form-item">
              <label>Certificate No:</label>
              <input
                type="text"
                name="certificateNo"
                value={formData.certificateNo}
                onChange={handleInputChange}
              />
            </li>

            <li className="single-page-form-item">
              <label>Course:</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
              />
            </li>

            <li className="single-page-form-item">
              <label>Duration (Year):</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
              />
            </li>

            <li className="single-page-form-item">
              <label>Date (MM/DD/YYYY):</label>
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
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default UpdateStudent;
