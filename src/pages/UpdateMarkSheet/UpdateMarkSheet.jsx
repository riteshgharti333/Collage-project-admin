import { Link, useNavigate, useParams } from "react-router-dom";
import "./UpdateMarkSheet.scss";
import { useState, useEffect, useRef } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { studentDetails } from "../../assets/data";
import { IoSearchSharp } from "react-icons/io5";
import { baseUrl } from "../../main";
import axios from "axios";
import { toast } from "sonner";

const UpdateMarkSheet = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialMarksheetData, setInitialMarksheetData] = useState(null);

  // Student related states
  const [singleStudentData, setSingleStudentData] = useState(null);
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    fatherName: "",
    course: "",
    duration: "",
    enrollmentId: "",
    certificateNo: "",
  });

  // Search related states
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchCourseKeyword, setSearchCourseKeyword] = useState("");
  const [searchCourseResults, setSearchCourseResults] = useState([]);
  const [courseData, setCourseData] = useState([]);

  const searchRef = useRef(null);
  const courseSearchRef = useRef(null);

  // Fetch marksheet data on component mount
  useEffect(() => {
    const fetchMarksheetData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${baseUrl}/marksheet/${id}`);
        if (data?.marksheet) {
          setInitialMarksheetData(data.marksheet);

          // Set student data
          if (data.marksheet.student) {
            setSingleStudentData(data.marksheet.student);
            setStudentInfo({
              name: data.marksheet.student.name || "",
              fatherName: data.marksheet.student.fatherName || "",
              course: data.marksheet.student.course || "",
              duration: data.marksheet.student.duration || "",
              enrollmentId: data.marksheet.student.enrollmentId || "",
              certificateNo: data.marksheet.student.certificateNo || "",
            });
          }

          // Set courses
          if (data.marksheet.subjects) {
            const loadedCourses = data.marksheet.subjects.map((subject) => ({
              code: subject.courseCode,
              name: subject.courseName,
              maxMarks: subject.maxMarks,
              marks: subject.obtainedMarks,
              grade: subject.grade,
            }));
            setCourses(loadedCourses);
          }
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load marksheet"
        );
        navigate("/marksheets");
      } finally {
        setLoading(false);
      }
    };

    fetchMarksheetData();
  }, [id, navigate]);

  // Fetch all available courses
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/exam/all-exams`);
        if (data?.exams) setCourseData(data.exams);
      } catch (error) {
        toast.error("Failed to load courses");
      }
    };
    fetchAllCourses();
  }, []);

  // Handle course changes
  const handleCourseChange = (index, e) => {
    const { name, value } = e.target;
    const newCourses = [...courses];
    newCourses[index][name] = value;

    // Auto-calculate grade when marks change
    if (name === "marks" && value !== "") {
      const maxMarks = parseFloat(newCourses[index].maxMarks) || 0;
      const obtainedMarks = parseFloat(value) || 0;
      const percentage = maxMarks > 0 ? (obtainedMarks / maxMarks) * 100 : 0;
      newCourses[index].grade = calculateGrade(percentage);
    }

    setCourses(newCourses);
  };

  const removeCourse = (index) => {
    const newCourses = [...courses];
    newCourses.splice(index, 1);
    setCourses(newCourses);
  };

  // Grading system functions
  const calculatePercentage = () => {
    const presentCourses = courses.filter((course) => course.grade !== "Ab");
    const totalMarks = presentCourses.reduce(
      (sum, course) => sum + (parseFloat(course.marks) || 0),
      0
    );
    const totalMaxMarks = presentCourses.reduce(
      (sum, course) => sum + (parseFloat(course.maxMarks) || 0),
      0
    );
    return totalMaxMarks > 0
      ? ((totalMarks / totalMaxMarks) * 100).toFixed(2)
      : "0.00";
  };

  const calculateGrade = (percentage) => {
    const percent = parseFloat(percentage);
    if (percent === 0) return "Ab";
    if (percent >= 90) return "O";
    if (percent >= 80) return "A+";
    if (percent >= 70) return "A";
    if (percent >= 60) return "B+";
    if (percent >= 50) return "B";
    if (percent >= 40) return "C";
    if (percent >= 35) return "P";
    return "F";
  };

  const percentage = calculatePercentage();
  const overallGrade = calculateGrade(percentage);

  // Search handlers
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchKeyword(query);
    if (query) {
      try {
        const { data } = await axios.get(`${baseUrl}/student/search`, {
          params: { keyword: query },
        });
        setSearchResults(data.students || []);
      } catch (error) {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchCourseChange = async (e) => {
    const query = e.target.value;
    setSearchCourseKeyword(query);
    if (query) {
      try {
        const { data } = await axios.get(`${baseUrl}/exam/search`, {
          params: { keyword: query },
        });
        setSearchCourseResults(data.courses || []);
      } catch (error) {
        setSearchCourseResults([]);
      }
    } else {
      setSearchCourseResults([]);
    }
  };

  const handleCourseData = (data) => {
    if (courses.some((course) => course.code === data.courseCode)) {
      toast.error("Course already added");
      return;
    }
    setCourses([
      ...courses,
      {
        code: data.courseCode,
        name: data.courseName,
        maxMarks: data.marks,
        marks: "",
        grade: "",
      },
    ]);
    setSearchCourseKeyword("");
    setSearchCourseResults([]);
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value === "Select Course") return;

    const [name, code] = value.split(" - ");
    const course = courseData.find(
      (c) => c.courseCode === code && c.courseName === name
    );

    if (!course) return;

    if (courses.some((c) => c.code === code)) {
      toast.error("Course already added");
      e.target.value = "Select Course";
      return;
    }

    setCourses([
      ...courses,
      {
        code: course.courseCode,
        name: course.courseName,
        maxMarks: course.marks,
        marks: "",
        grade: "",
      },
    ]);
    e.target.value = "Select Course";
  };

  // Submit handler
  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validation
      if (courses.length === 0) {
        toast.error("Please add at least one course");
        return;
      }

      for (const course of courses) {
        if (course.grade === "Ab") continue;
        if (!course.marks || isNaN(course.marks)) {
          toast.error(`Marks missing for ${course.name}`);
          return;
        }
        if (!course.grade) {
          toast.error(`Grade missing for ${course.name}`);
          return;
        }
      }

      // Prepare data
      const presentCourses = courses.filter((course) => course.grade !== "Ab");
      const totalObtained = presentCourses.reduce(
        (sum, course) => sum + (parseFloat(course.marks) || 0),
        0
      );
      const totalMax = presentCourses.reduce(
        (sum, course) => sum + (parseFloat(course.maxMarks) || 0),
        0
      );
      const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
      const overallGrade = calculateGrade(percentage);

      const payload = {
        subjects: courses.map((course) => ({
          courseCode: course.code,
          courseName: course.name,
          maxMarks: course.maxMarks,
          obtainedMarks: course.grade === "Ab" ? 0 : course.marks,
          grade: course.grade,
        })),
        totalMaxMarks: totalMax,
        totalObtainedMarks: totalObtained,
        percentage: parseFloat(percentage.toFixed(2)),
        overallGrade,
      };

      // API call
      const { data } = await axios.put(
        `${baseUrl}/marksheet/${id}`,
        {
          withCredentials: true,
        },
        payload
      );

      if (data?.result === 1) {
        toast.success(data.message);
        navigate("/marksheets");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !initialMarksheetData) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="markSheet">
      <div className="markSheet-top">
        <Link onClick={() => navigate(-1)} className="back-icon">
          <MdKeyboardBackspace size={35} />
        </Link>
        <h1>Update Marksheet</h1>
      </div>
      <div className="markSheet-container">
        {/* Student Info Section */}
        <div className="student-info-section">
          <div className="student-info-section-top">
            <h3>Student Information</h3>
            <div className="student-info-section-top-right">
              <IoSearchSharp className="searh-icon" />
              <input
                type="search"
                placeholder="Search student..."
                value={searchKeyword}
                onChange={handleSearchChange}
                disabled
              />
            </div>
          </div>
          <div className="info-grid">
            {studentDetails.map((field) => (
              <div className="info-item" key={field.name}>
                <label>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={studentInfo[field.name] || ""}
                  readOnly
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Courses Section */}
        <div className="marks-table-section">
          <div className="marks-table-section-top">
            <h3>Course Performance</h3>
            <div className="marks-table-section-top-right">
              <div className="marks-table-section-top-right-search">
                <IoSearchSharp className="searh-icon" />
                <input
                  type="search"
                  placeholder="Search courses..."
                  value={searchCourseKeyword}
                  onChange={handleSearchCourseChange}
                />
                {searchCourseKeyword && (
                  <div className="search-data" ref={courseSearchRef}>
                    {searchCourseResults.length > 0 ? (
                      <div className="search-results">
                        {searchCourseResults.map((item) => (
                          <div
                            key={item._id}
                            className="search-result-item"
                            onClick={() => handleCourseData(item)}
                          >
                            <span>{item.courseName}</span>
                            <span className="code">{item.courseCode}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-cust">No courses found</p>
                    )}
                  </div>
                )}
              </div>
              <div className="marks-table-section-top-right-select">
                <select
                  onChange={handleSelectChange}
                  defaultValue="Select Course"
                >
                  <option value="Select Course" disabled>
                    Select Course
                  </option>
                  {courseData.map((item) => (
                    <option
                      key={item._id}
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
                <col style={{ width: "10%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Course</th>
                  <th>Max Marks</th>
                  <th>Obtained</th>
                  <th>Grade</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-table-message">
                      No courses added
                    </td>
                  </tr>
                ) : (
                  courses.map((course, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={course.code}
                          readOnly
                          className="read-only-input"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={course.name}
                          readOnly
                          className="read-only-input"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
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
                          max={course.maxMarks}
                          required
                        />
                      </td>
                      <td>
                        <select
                          name="grade"
                          value={course.grade}
                          onChange={(e) => handleCourseChange(index, e)}
                          required
                        >
                          <option value="">Select</option>
                          <option value="O">O (10)</option>
                          <option value="A+">A+ (9)</option>
                          <option value="A">A (8)</option>
                          <option value="B+">B+ (7)</option>
                          <option value="B">B (6)</option>
                          <option value="C">C (5)</option>
                          <option value="P">P (4)</option>
                          <option value="F">F (0)</option>
                          <option value="Ab">Ab (0)</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="remove-btn"
                          onClick={() => removeCourse(index)}
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

          {/* Summary Section */}
          <div className="summary-section">
            <div className="summary-item">
              <strong>Overall Percentage: {percentage}%</strong>
            </div>
            <div className="summary-item">
              <strong>Overall Grade: {overallGrade}</strong>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="marksheet-btns">
          <button
            onClick={handleSubmit}
            className="success-btn"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Marksheet"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateMarkSheet;
