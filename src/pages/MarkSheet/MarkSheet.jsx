import { Link, useNavigate } from "react-router-dom";
import "./MarkSheet.scss";
import { useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { studentDetails } from "../../assets/data";
import { IoSearchSharp } from "react-icons/io5";
import { useEffect } from "react";

import { baseUrl } from "../../main";
import axios from "axios";
import { toast } from "sonner";
import { useRef } from "react";

const MarkSheet = () => {
  const [courses, setCourses] = useState([]);

  const handleCourseChange = (index, e) => {
    const { name, value } = e.target;
    const newCourses = [...courses];
    newCourses[index][name] = value;
    setCourses(newCourses);
  };

  const removeCourse = (index) => {
    if (courses.length > 1) {
      const newCourses = [...courses];
      newCourses.splice(index, 1);
      setCourses(newCourses);
    }
  };

  const calculatePercentage = () => {
    const totalMarks = courses.reduce(
      (sum, course) => sum + (parseFloat(course.marks) || 0),
      0
    );
    const totalMaxMarks = courses.reduce(
      (sum, course) => sum + (parseFloat(course.maxMarks) || 0),
      0
    );
    return totalMaxMarks > 0
      ? ((totalMarks / totalMaxMarks) * 100).toFixed(2)
      : "0.00";
  };

  const calculateGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  };

  const percentage = calculatePercentage();
  const grade = calculateGrade(percentage);

  const navigate = useNavigate();

  const searchRef = useRef(null);
  const courseSearchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        studentSearchRef.current &&
        !studentSearchRef.current.contains(event.target)
      ) {
        setSearchResults([]);
        setSearchKeyword("");
      }

      if (
        courseSearchRef.current &&
        !courseSearchRef.current.contains(event.target)
      ) {
        setSearchCourseResults([]);
        setSearchCourseKeyword("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [singleStudentData, setsingleStudentData] = useState(null);

  const [studentInfo, setStudentInfo] = useState({
    name: "",
    fatherName: "",
    course: "",
    duration: "",
    enrollmentId: "",
    certificateNo: "",
  });

  const handleStudentInfoChange = (e) => {
    if (!singleStudentData) {
      toast.error("Please search and select a student first");
      return;
    }

    const { name, value } = e.target;
    setStudentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentData = (data) => {
    setsingleStudentData(data);
    setStudentInfo({
      name: data.name || "",
      fatherName: data.fatherName || "",
      course: data.course || "",
      duration: data.duration || "",
      enrollmentId: data.enrollmentId || "",
      certificateNo: data.certificateNo || "",
    });
    setSearchKeyword("");
    setSearchResults([]);
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchKeyword(query);

    if (query) {
      try {
        const { data } = await axios.get(`${baseUrl}/student/search`, {
          params: { keyword: query },
        });
        console.log(data);
        setSearchResults(data.students);
      } catch (error) {
        console.error("Error searching students", error);
        // toast.error(error.response.data.message);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const [selectedCourses, setSelectedCourses] = useState([]);

  const [searchCourseKeyword, setSearchCourseKeyword] = useState("");
  const [searchCourseResults, setSearchCourseResults] = useState([]);

  const [singleCourseData, setSingleCourseData] = useState(null);

  const handleSelectChange = (e) => {
    const selectedOption = e.target.value;
    if (selectedOption === "Select Course") return;

    const [courseName, courseCode] = selectedOption.split(" - ");

    if (courses.some((course) => course.code === courseCode)) {
      toast.error("This course is already added");
      return;
    }

    const courseToAdd = courseData.find(
      (course) =>
        course.courseCode === courseCode && course.courseName === courseName
    );

    if (courseToAdd) {
      const newCourse = {
        code: courseToAdd.courseCode,
        name: courseToAdd.courseName,
        maxMarks: courseToAdd.marks,
        marks: "",
        grade: "",
      };
      setCourses([...courses, newCourse]);
    }
  };

  const handleCourseData = (data) => {
    if (courses.some((course) => course.code === data.courseCode)) {
      toast.error("This course is already added");
      return;
    }

    const newCourse = {
      code: data.courseCode,
      name: data.courseName,
      maxMarks: data.marks,
      marks: "",
      grade: "",
    };
    setCourses((prevCourses) => [...prevCourses, newCourse]);
    setSearchCourseKeyword("");
    setSearchCourseResults([]);
  };

  const handleSearchCourseChange = async (e) => {
    const query = e.target.value;
    setSearchCourseKeyword(query);

    if (query) {
      try {
        const { data } = await axios.get(`${baseUrl}/exam/search`, {
          params: { keyword: query },
        });
        console.log(data);
        setSearchCourseResults(data.courses);
      } catch (error) {
        console.error("Error searching students", error);
        setSearchCourseResults([]);
      }
    } else {
      setSearchCourseResults([]);
    }
  };

  const [courseData, setCourseData] = useState([]);

  useEffect(() => {
    const getAllCourses = async () => {
      const { data } = await axios.get(`${baseUrl}/exam/all-exams`);
      if (data && data.exams) {
        setCourseData(data.exams);
      }
    };
    getAllCourses();
  }, []);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!singleStudentData) {
        toast.error("Please select a student first");
        return;
      }

      if (courses.length === 0) {
        toast.error("Please add at least one course");
        return;
      }

      for (const course of courses) {
        if (!course.marks || isNaN(course.marks)) {
          toast.error(`Obtained marks missing for course: ${course.name}`);
          return;
        }

        if (!course.grade || course.grade.trim() === "") {
          toast.error(`Grade missing for course: ${course.name}`);
          return;
        }
      }

      // Calculate totals
      const totalObtainedMarks = courses.reduce(
        (sum, course) => sum + (parseFloat(course.marks) || 0),
        0
      );
      const totalMaxMarks = courses.reduce(
        (sum, course) => sum + (parseFloat(course.maxMarks) || 0),
        0
      );

      const subjects = courses.map((course) => ({
        courseCode: course.code,
        courseName: course.name,
        maxMarks: course.maxMarks,
        obtainedMarks: course.marks,
        grade: course.grade,
      }));

      console.log(subjects);

      const requestBody = {
        studentId: singleStudentData._id,
        subjects,
        totalMaxMarks,
        totalObtainedMarks,
        overallGrade: grade,
      };

      // Make API call
      const { data } = await axios.post(
        `${baseUrl}/marksheet/new-marksheet`,
        requestBody
      );

      if (data && data.result === 1) {
        toast.success(data.message);
        navigate("/marksheets");
      }
    } catch (error) {
      console.error("Error submitting marksheet:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to save marksheet. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="markSheet">
      <div className="markSheet-top">
        <Link onClick={() => navigate(-1)} className="back-icon">
          <MdKeyboardBackspace size={35} />
        </Link>
        <h1>Admission Form</h1>
      </div>
      <div className="markSheet-container">
        <div className="student-info-section">
          <div className="student-info-section-top">
            <h3>Student Information</h3>
            <div className="student-info-section-top-right">
              <IoSearchSharp className="searh-icon" />
              <input
                type="search"
                placeholder="search student by name and  name..."
                value={searchKeyword}
                onChange={handleSearchChange}
              />

              {searchKeyword && (
                <div className="search-data" ref={searchRef}>
                  {searchResults?.length > 0 ? (
                    <div className="search-results">
                      {searchResults?.map((item) => (
                        <div
                          key={item._id}
                          className="search-result-item"
                          onClick={() => handleStudentData(item)}
                        >
                          <span>{item.name}/</span>
                          <span className="fath-name">
                            father name: {item.fatherName}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-cust" ref={searchRef}>
                      No students found
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="info-grid">
            {studentDetails.map((field) => (
              <div className="info-item" key={field.name}>
                <label>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={
                    singleStudentData
                      ? singleStudentData[field.name] ||
                        studentInfo[field.name] ||
                        ""
                      : studentInfo[field.name] || ""
                  }
                  onChange={handleStudentInfoChange}
                  placeholder={field.placeholder}
                  readOnly={!singleStudentData}
                  onClick={() => {
                    if (!singleStudentData) {
                      toast.error("Please search and select a student first");
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="marks-table-section">
          <div className="marks-table-section-top">
            <h3>Course Performance</h3>
            <div className="marks-table-section-top-right">
              <div className="marks-table-section-top-right-search">
                <IoSearchSharp className="searh-icon" />
                <input
                  type="search"
                  placeholder="search course by name and course code..."
                  value={searchCourseKeyword}
                  onChange={handleSearchCourseChange}
                />

                {searchCourseKeyword && (
                  <div className="search-data" ref={courseSearchRef}>
                    {searchCourseResults?.length > 0 ? (
                      <div className="search-results">
                        {searchCourseResults?.map((item) => (
                          <div
                            key={item._id}
                            className="search-result-item"
                            onClick={() => handleCourseData(item)}
                          >
                            <span>{item.courseName}/</span>
                            <span className="fath-name">{item.courseCode}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-cust" ref={courseSearchRef}>
                        No courses found
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="marks-table-section-top-right-select">
                <select onChange={handleSelectChange} value="Select Course">
                  <option value="Select Course">Select Course</option>
                  {courseData?.map((item, index) => (
                    <option
                      key={index}
                      value={`${item.courseName} - ${item.courseCode}`}
                    >
                      {item.courseName} - {item.courseCode}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="table-container">
            <table>
              <colgroup>
                <col style={{ width: "15%" }} />
                <col style={{ width: "30%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "25%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Course Name</th>
                  <th>Maxs Marks</th>
                  <th>Maxs Obtain</th>
                  <th>Grade</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-table-message">
                      No courses added yet. Please search or select a course.
                    </td>
                  </tr>
                ) : (
                  courses.map((course, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          name="code"
                          value={course.code}
                          readOnly
                          className="read-only-input"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={course.name}
                          readOnly
                          className="read-only-input"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="maxInternal"
                          value={course.maxMarks}
                          readOnly
                          className="read-only-input"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="marks"
                          value={course.marks}
                          onChange={(e) => handleCourseChange(index, e)}
                          min="0"
                          max={course.marks}
                          placeholder="Obtained marks"
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="grade"
                          value={course.grade}
                          onChange={(e) => handleCourseChange(index, e)}
                          placeholder="A, B, C..."
                          required
                        />
                      </td>
                      <td>
                        <button
                          className="remove-btn"
                          onClick={() => removeCourse(index)}
                          disabled={courses.length <= 1}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="summary-section">
          <div className="summary-item">
            <span>Maxs Marks:</span>
            <span>
              {courses.reduce(
                (sum, course) => sum + (parseFloat(course.maxMarks) || 0),
                0
              )}
            </span>
          </div>
          <div className="summary-item">
            <span>Maxs Obtained:</span>
            <span>
              {courses.reduce(
                (sum, course) => sum + (parseFloat(course.marks) || 0),
                0
              )}
            </span>
          </div>
          <div className="summary-item">
            <span>Grade:</span>
            <span className={`grade-${grade}`}>{grade}</span>
          </div>
        </div>

        <div className="marksheet-btns">
          <button
            onClick={handleSubmit}
            className="success-btn"
            disabled={loading}
          >
            {" "}
            {loading ? "Saving..." : "Save Marksheet"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkSheet;
