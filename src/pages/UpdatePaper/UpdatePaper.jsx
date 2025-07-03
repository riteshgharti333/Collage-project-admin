import { Link, useNavigate, useParams } from "react-router-dom";
import "./UpdatePaper.scss";
import { MdKeyboardBackspace } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { baseUrl } from "../../main";

const UpdatePaper = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const cardRef = useRef(null);

  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    marks: "",
  });

  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setShowDeleteModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const getSingleData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/exam/${id}`);
        if (data && data.exam) {
          setFormData({
            courseName: data.exam.courseName,
            courseCode: data.exam.courseCode,
            marks: data.exam.marks,
          });
        }
      } catch (error) {
        console.error("Failed to fetch course exam:", error);
        toast.error(error?.response?.data?.message || "Failed to fetch data");
      }
    };
    getSingleData();
  }, [id]);

  const generateCourseCode = () => {
    // Generate random 3 numbers (0-9) with NAD prefix and # suffix
    const numbers = "0123456789";

    let randomNumbers = "";
    for (let i = 0; i < 3; i++) {
      randomNumbers += numbers.charAt(
        Math.floor(Math.random() * numbers.length)
      );
    }

    return `NAD${randomNumbers}#`; // Format: NAD123#
  };

  const handleGenerateCode = () => {
    const newCode = generateCourseCode();
    setFormData((prev) => ({ ...prev, courseCode: newCode }));
    toast.success(`Generated new code: ${newCode}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { courseName, courseCode, marks } = formData;

    if (!courseName.trim() || !courseCode.trim() || !marks) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }

    if (isNaN(marks) || marks <= 0 || marks > 100) {
      toast.error("Marks must be a number between 1 and 100.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.put(`${baseUrl}/exam/${id}`, formData, {
        withCredentials: true,
      });
      if (data && data.result === 1) {
        toast.success(data.message);
        navigate("/paper-design");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { data } = await axios.delete(`${baseUrl}/exam/${id}`, {
        withCredentials: true,
      });
      if (data) {
        toast.success(data.message);
        setShowDeleteModal(false);
        navigate("/paper-design");
      }
    } catch (error) {
      console.error("Error deleting exam:", error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const DeleteModal = () => (
    <div className="deleteImage">
      <div className="deleteImage-desc" ref={cardRef}>
        <h3>Are you sure you want to delete this exam?</h3>
        <div className="deleteImage-btns">
          <button
            className="delete-btn"
            disabled={loading}
            onClick={handleDelete}
          >
            {loading ? "Deleting..." : "Yes"}
          </button>
          <button
            className="success-btn"
            onClick={() => setShowDeleteModal(false)}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="updatePaper">
      <div className="updatePaper-top">
        <Link onClick={() => navigate(-1)} className="paper-icon">
          <MdKeyboardBackspace size={35} />
          <h1>Update Exam Course</h1>
        </Link>
        <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>
          Delete
        </button>
      </div>

      <div className="course-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course Name</label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              placeholder="e.g. B.Sc Computer Science"
            />
          </div>

          <div className="form-group">
            <label>Course Code</label>
            <div className="course-code-container">
              <input
                type="text"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleChange}
                placeholder="Click generate button"
                className="course-code"
                readOnly
              />
              <button
                type="button"
                onClick={handleGenerateCode}
                className="generate-btn"
              >
                Generate Code
              </button>
            </div>
            <small className="code-format-hint">Format: NAD123#</small>
          </div>

          <div className="form-group">
            <label>Out of Marks</label>
            <input
              type="number"
              name="marks"
              value={formData.marks}
              onChange={handleChange}
              placeholder="e.g. 100"
              min={1}
              max={100}
            />
          </div>

          <button type="submit" className="success-btn" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>

      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

export default UpdatePaper;
