import { Link, useNavigate, useParams } from "react-router-dom";
import "./UpdateCourse.scss";
import { MdKeyboardBackspace } from "react-icons/md";
import { BiImageAdd } from "react-icons/bi";
import { FiPlusCircle } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { baseUrl } from "../../main";
import { IoTrashBin } from "react-icons/io5";

const UpdateCourse = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { id } = useParams();

  const [bannerImage, setBannerImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [bannerTitle, setBannerTitle] = useState("");
  const [courseType, setCourseType] = useState("UG Course");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseListTitle, setCourseListTitle] = useState("");
  const [courseListDesc, setCourseListDesc] = useState("");
  const [highlights, setHighlights] = useState([
    { title: "", description: "" },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSingleCourse = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/course/${id}`);
        if (data && data.course) {
          const courseData = data.course;
          setBannerImage(courseData.bannerImage);
          setBannerTitle(courseData.bannerTitle);
          setCourseType(courseData.courseType);
          setCourseTitle(courseData.courseTitle);
          setCourseDescription(courseData.courseDescription);
          setCourseListTitle(courseData.courseListTitle);
          setCourseListDesc(courseData.courseListDesc);
          setHighlights(
            courseData.courseLists?.map((item) => ({
              title: item.title,
              description: item.desc,
            })) || []
          );
        }
      } catch (error) {
        console.error("Failed to fetch course:", error);
        toast.error(error?.response?.data?.message || "Error fetching course");
      }
    };

    if (id) fetchSingleCourse();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setBannerImage(imageUrl);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const deleteHighlight = (indexToRemove) => {
    setHighlights((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  
  const handleHighlightChange = (index, field, value) => {
    const updatedHighlights = [...highlights];
    updatedHighlights[index][field] = value;
    setHighlights(updatedHighlights);
  };

  const addHighlight = () => {
    setHighlights([...highlights, { title: "", description: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const sanitizedHighlights = highlights.map((h) => ({
      title: h.title,
      desc: h.description,
    }));

    const formData = new FormData();
    if (selectedFile) {
      formData.append("bannerImage", selectedFile);
    }
    formData.append("bannerTitle", bannerTitle);
    formData.append("courseType", courseType);
    formData.append("courseTitle", courseTitle);
    formData.append("courseDescription", courseDescription);
    formData.append("courseListTitle", courseListTitle);
    formData.append("courseListDesc", courseListDesc);

    sanitizedHighlights.forEach((highlight, index) => {
      formData.append(`courseLists[${index}][title]`, highlight.title);
      formData.append(`courseLists[${index}][desc]`, highlight.desc);
    });

    try {
      const { data } = await axios.put(`${baseUrl}/course/${id}`, formData);
      toast.success(data.message || "Course updated successfully");
      navigate(-1);
    } catch (err) {
      console.error(
        "Error updating course:",
        err.response?.data || err.message
      );
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="updateCourse">
      <div className="updateCourse-top">
        <Link onClick={() => navigate(-1)} className="back-icon">
          <MdKeyboardBackspace size={35} />
        </Link>
        <h1>Update Course</h1>
      </div>

      <div className="updateCourse-container">
        <div className="updateCourse-banner">
          {bannerImage && (
            <img
              src={bannerImage}
              alt="Course Banner"
              className="banner-preview"
            />
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            name="bannerImage"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="updateCourse-banner-btn">
          <button className="success-btn" onClick={openFilePicker}>
            <FiPlusCircle />
            New Banner
          </button>
        </div>

        <div className="updateCourse-title">
          <label>Banner Title:</label>
          <input
            type="text"
            placeholder="Add banner title..."
            value={bannerTitle}
            onChange={(e) => setBannerTitle(e.target.value)}
          />
        </div>
      </div>

      <div className="course-info">
        <h1>Course Content</h1>

        <form className="course-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course Type</label>
            <select
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
              required
            >
              <option value="Main Course">Main Course</option>
              <option value="UG Course">UG Course</option>
              <option value="PG Course">PG Course</option>
            </select>
          </div>

          <div className="form-group">
            <label>Course Title</label>
            <input
              type="text"
              placeholder="e.g. B.Com (Bachelor of Commerce)"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Main Description</label>
            <textarea
              rows="4"
              style={{ height: "300px" }}
              placeholder="description..."
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Program Points Title</label>
            <input
              type="text"
              placeholder="e.g. Key Highlights"
              value={courseListTitle}
              onChange={(e) => setCourseListTitle(e.target.value)}
              required
            />

            <label style={{ marginTop: "20px" }}>
              Program Points Description
            </label>
            <textarea
              rows="4"
              style={{ height: "100px" }}
              placeholder="description..."
              value={courseListDesc}
              onChange={(e) => setCourseListDesc(e.target.value)}
              required
            ></textarea>

            <div className="highlight-fields">
              {highlights.map((highlight, index) => (
                <div className="highlight-item" key={index}>
                  <input
                    type="text"
                    placeholder="Highlight title"
                    value={highlight.title}
                    onChange={(e) =>
                      handleHighlightChange(index, "title", e.target.value)
                    }
                  />
                  <textarea
                    placeholder="Highlight description"
                    value={highlight.description}
                    onChange={(e) =>
                      handleHighlightChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                  ></textarea>
                  <IoTrashBin className="bin-icon"   onClick={() => deleteHighlight(index)}/>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="add-highlight"
              onClick={addHighlight}
            >
              + Add Another Highlight
            </button>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Course"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCourse;
