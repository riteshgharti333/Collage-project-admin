import { Link, useNavigate } from "react-router-dom";
import "./NewPaper.scss";
import { MdKeyboardBackspace } from "react-icons/md";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { baseUrl } from "../../main";

const NewPaper = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    marks: "",
  });

  const [loading, setLoading] = useState(false);

  const generateCourseCode = () => {
    // Generate random 3 numbers (0-9) with NAD prefix and # suffix
    const numbers = '0123456789';
    
    let randomNumbers = '';
    for (let i = 0; i < 3; i++) {
      randomNumbers += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return `NAD${randomNumbers}#`; // Format: NAD123#
  };

  const handleGenerateCode = () => {
    const newCode = generateCourseCode();
    setFormData(prev => ({ ...prev, courseCode: newCode }));
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
      const { data } = await axios.post(`${baseUrl}/exam/new-exam`, formData);

      if (data && data.result === 1) {
        toast.success(data.message);
        navigate("/paper-design");
      }
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newPaper">
      <div className="newPaper-top">
        <Link onClick={() => navigate(-1)} className="back-icon">
          <MdKeyboardBackspace size={35} />
        </Link>
        <h1>New Exam Course</h1>
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
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPaper;