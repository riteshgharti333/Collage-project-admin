import "./UpdateCourse.scss";

import { Link, useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import { BiImageAdd } from "react-icons/bi";
import { FiPlusCircle } from "react-icons/fi";
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { baseUrl } from "../../main";
import { IoTrashBin } from "react-icons/io5";
import { useEffect } from "react";

const UpdateCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [bannerImage, setBannerImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [bannerTitle, setBannerTitle] = useState("");
  const [courseType, setCourseType] = useState("UG Course");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  const [courseOfCoursesTitle, setCourseOfCoursesTitle] = useState("");

  const [topicTitle, setTopicTitle] = useState("");

  const [careerTitle, setCareerTitle] = useState("");

  const [overviewTitle, setOverviewTitle] = useState("");

  const [overviewDesc, setOverviewDesc] = useState("");

  const [courseListTitle, setCourseListTitle] = useState("");
  const [courseListDesc, setCourseListDesc] = useState("");

  const [courseOfCoursesItems, setCourseOfCoursesItems] = useState([
    { item: "" },
  ]);
  const [topicItems, setTopicItems] = useState([{ item: "" }]);
  const [careerItems, setCareerItems] = useState([{ item: "" }]);

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

          // Add these new state initializations:
          setCourseOfCoursesTitle(courseData.courseOfCoursesTitle || "");
          setTopicTitle(courseData.topicTitle || "");
          setCareerTitle(courseData.careerTitle || "");
          setOverviewTitle(courseData.overviewTitle || "");
          setOverviewDesc(courseData.overviewDesc || "");
          setCourseListTitle(courseData.courseListTitle || "");
          setCourseListDesc(courseData.courseListDesc || "");

          // Initialize arrays
          setCourseOfCoursesItems(
            courseData.courseOfCoursesLists?.map((item) => ({
              item: item.item,
            })) || [{ item: "" }]
          );
          setTopicItems(
            courseData.topicLists?.map((item) => ({ item: item.item })) || [
              { item: "" },
            ]
          );
          setCareerItems(
            courseData.careerLists?.map((item) => ({ item: item.item })) || [
              { item: "" },
            ]
          );
          setHighlights(
            courseData.courseLists?.map((item) => ({
              title: item.title,
              description: item.desc,
            })) || [{ title: "", description: "" }]
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
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (file) {
      if (file.size > maxSize) {
        toast.error("Image must be less than 2MB!");
        return;
      }

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

  const deleteCourseOfCoursesItem = (indexToRemove) => {
    setCourseOfCoursesItems((prev) =>
      prev.filter((_, i) => i !== indexToRemove)
    );
  };

  const deleteTopicItem = (indexToRemove) => {
    setTopicItems((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const deleteCareerItem = (indexToRemove) => {
    setCareerItems((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleCourseOfCoursesChange = (index, value) => {
    const updated = [...courseOfCoursesItems];
    updated[index].item = value;
    setCourseOfCoursesItems(updated);
  };

  const handleTopicChange = (index, value) => {
    const updated = [...topicItems];
    updated[index].item = value;
    setTopicItems(updated);
  };

  const handleCareerChange = (index, value) => {
    const updated = [...careerItems];
    updated[index].item = value;
    setCareerItems(updated);
  };

  const addCourseOfCoursesItem = () => {
    setCourseOfCoursesItems([...courseOfCoursesItems, { item: "" }]);
  };

  const addTopicItem = () => {
    setTopicItems([...topicItems, { item: "" }]);
  };

  const addCareerItem = () => {
    setCareerItems([...careerItems, { item: "" }]);
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

    formData.append("courseOfCoursesTitle", courseOfCoursesTitle);
    formData.append(
      "courseOfCoursesLists",
      JSON.stringify(courseOfCoursesItems)
    );

    formData.append("topicTitle", topicTitle);
    formData.append("topicLists", JSON.stringify(topicItems));

    formData.append("careerTitle", careerTitle);
    formData.append("careerLists", JSON.stringify(careerItems));

    formData.append("overviewTitle", overviewTitle);
    formData.append("overviewDesc", overviewDesc);

    formData.append("courseListTitle", courseListTitle);
    formData.append("courseListDesc", courseListDesc);
    formData.append("courseLists", JSON.stringify(sanitizedHighlights));

    try {
      // Change to PUT request for updates
      const { data } = await axios.put(
        `${baseUrl}/course/${id}`, // Update endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data) {
        toast.success(data.message);
        const bannerTitle = data.course.bannerTitle || "";
        navigate(`/course/${data.course._id}/${bannerTitle}`);
      }
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
          {bannerImage ? (
            <img
              src={bannerImage}
              alt="Course Banner"
              className="banner-preview"
            />
          ) : (
            <div className="updateCourse-banner-desc" onClick={openFilePicker}>
              <BiImageAdd className="add-image-icon" />
              <p>Add Course Banner</p>
            </div>
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

        <p
          className="rec-size"
          style={{ color: "#fff", marginTop: "20px", textAlign: "center" }}
        >
          Recommended size: 1800 x 600
        </p>

        <div className="updateCourse-banner-btn">
          <button className="success-btn" onClick={openFilePicker}>
            <FiPlusCircle />
            Add Banner
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
            ></textarea>
          </div>
          {/* /////////////////////////////////////////////// */}

          {/* Courses Section */}
          <div className="form-group">
            <label>Courses</label>
            <input
              type="text"
              placeholder="course"
              value={courseOfCoursesTitle}
              onChange={(e) => setCourseOfCoursesTitle(e.target.value)}
            />

            <div className="highlight-fields" style={{ marginTop: "10px" }}>
              {courseOfCoursesItems.map((item, index) => (
                <div className="highlight-item" key={index}>
                  <input
                    type="text"
                    placeholder="Courses"
                    value={item.item}
                    onChange={(e) =>
                      handleCourseOfCoursesChange(index, e.target.value)
                    }
                  />
                  <IoTrashBin
                    className="bin-icon"
                    onClick={() => deleteCourseOfCoursesItem(index)}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              className="add-highlight"
              onClick={addCourseOfCoursesItem}
            >
              + Add Another Course
            </button>
          </div>

          {/* Key Topics Section */}
          <div className="form-group">
            <label>Key Topics</label>
            <input
              type="text"
              placeholder="Key Topic"
              value={topicTitle}
              onChange={(e) => setTopicTitle(e.target.value)}
            />

            <div className="highlight-fields" style={{ marginTop: "10px" }}>
              {topicItems.map((item, index) => (
                <div className="highlight-item" key={index}>
                  <input
                    type="text"
                    placeholder="Key Topic Items"
                    value={item.item}
                    onChange={(e) => handleTopicChange(index, e.target.value)}
                  />
                  <IoTrashBin
                    className="bin-icon"
                    onClick={() => deleteTopicItem(index)}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              className="add-highlight"
              onClick={addTopicItem}
            >
              + Add Another Key Topic
            </button>
          </div>

          {/* Career Opportunities Section */}
          <div className="form-group">
            <label>Career Opportunities</label>
            <input
              type="text"
              placeholder="Career Opportunities"
              value={careerTitle}
              onChange={(e) => setCareerTitle(e.target.value)}
            />

            <div className="highlight-fields" style={{ marginTop: "10px" }}>
              {careerItems.map((item, index) => (
                <div className="highlight-item" key={index}>
                  <input
                    type="text"
                    placeholder="Career Opportunities Item"
                    value={item.item}
                    onChange={(e) => handleCareerChange(index, e.target.value)}
                  />
                  <IoTrashBin
                    className="bin-icon"
                    onClick={() => deleteCareerItem(index)}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              className="add-highlight"
              onClick={addCareerItem}
            >
              + Add Another Career Opportunities
            </button>
          </div>

          {/* ////////////////////////// */}
          <div className="form-group">
            <label>Course List Title</label>
            <input
              type="text"
              placeholder="e.g. Key Highlights"
              value={courseListTitle}
              onChange={(e) => setCourseListTitle(e.target.value)}
            />

            <label style={{ marginTop: "20px" }}>Course List Description</label>
            <textarea
              rows="4"
              style={{ height: "100px" }}
              placeholder="description..."
              value={courseListDesc}
              onChange={(e) => setCourseListDesc(e.target.value)}
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
                  <IoTrashBin
                    className="bin-icon"
                    onClick={() => deleteHighlight(index)}
                  />
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

          {/* ////////////////////////////////////////////// */}

          <div className="form-group">
            <label>Overview Title</label>
            <input
              type="text"
              placeholder="Overview Title"
              value={overviewTitle}
              onChange={(e) => setOverviewTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Overview Description</label>
            <textarea
              rows="4"
              style={{ height: "300px" }}
              placeholder="Overview Description"
              value={overviewDesc}
              onChange={(e) => setOverviewDesc(e.target.value)}
            ></textarea>
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
