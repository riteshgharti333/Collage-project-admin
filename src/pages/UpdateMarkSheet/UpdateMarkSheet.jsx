import { Link, useNavigate, useParams } from "react-router-dom";
import "./UpdateMarkSheet.scss";
import { useState, useEffect, useRef } from "react"; // Combined imports
import { MdKeyboardBackspace } from "react-icons/md";
import { studentDetails } from "../../assets/data"; // Assuming this is still relevant for field definitions
import { IoSearchSharp } from "react-icons/io5";
import { baseUrl } from "../../main";
import axios from "axios";
import { toast } from "sonner";

const UpdateMarkSheet = () => {
  const { id } = useParams(); // ID of the marksheet to update
  const navigate = useNavigate();

  const [studentInfo, setStudentInfo] = useState({
    name: "",
    fatherName: "",
    course: "", // This is likely the student's main enrolled course
    duration: "",
    enrollmentId: "",
    certificateNo: "",
  });
  const [singleStudentData, setSingleStudentData] = useState(null); // To store the full student object
  const [courses, setCourses] = useState([]); // Stores courses with marks for the marksheet

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  const [searchCourseKeyword, setSearchCourseKeyword] = useState("");
  const [searchCourseResults, setSearchCourseResults] = useState([]);
  const [courseData, setCourseData] = useState([]); // All available courses for selection

  const [loading, setLoading] = useState(false);
  const [initialMarksheetData, setInitialMarksheetData] = useState(null); // Store the initially fetched marksheet

  // --- Fetch existing Marksheet Data on Load ---
  useEffect(() => {
    if (!id) {
      toast.error("No marksheet ID provided.");
      navigate("/marksheets");
      return;
    }

    const fetchMarksheetData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${baseUrl}/marksheet/${id}`);
        if (data && data.marksheet) {
          const marksheet = data.marksheet;
          setInitialMarksheetData(marksheet); // Store for reference

          // 1. Populate Student Info
          if (marksheet.student) {
            // Assuming backend returns student object nested
            setSingleStudentData(marksheet.student);
            setStudentInfo({
              name: marksheet.student.name || "",
              fatherName: marksheet.student.fatherName || "",
              course: marksheet.student.course || "", // Student's main course
              duration: marksheet.student.duration || "",
              enrollmentId: marksheet.student.enrollmentId || "",
              certificateNo: marksheet.student.certificateNo || "",
            });
          } else {
            // Fallback if student object is not directly nested, might need another fetch
            // or expect studentId and then search (less ideal for update form)
            toast.warn("Student details not fully loaded with marksheet.");
          }

          // 2. Populate Courses for the Marksheet
          if (marksheet.subjects && Array.isArray(marksheet.subjects)) {
            const loadedCourses = marksheet.subjects.map((subject) => ({
              code: subject.courseCode,
              name: subject.courseName,
              maxMarks: subject.maxMarks,
              marks: subject.obtainedMarks, // Backend field name
              grade: subject.grade,
              // _id: subject._id // If your subjects have IDs and you need them
            }));
            setCourses(loadedCourses);
          }
        } else {
          toast.error("Marksheet not found.");
          navigate("/marksheets");
        }
      } catch (error) {
        console.error("Error fetching marksheet:", error);
        toast.error(
          error?.response?.data?.message || "Failed to load marksheet data."
        );
        navigate("/marksheets"); // Navigate away if an error occurs
      } finally {
        setLoading(false);
      }
    };

    fetchMarksheetData();
  }, [id, navigate]);

  // --- Fetch all available courses for adding ---
  useEffect(() => {
    const getAllCourses = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/exam/all-exams`); // Assuming this gets all possible courses
        if (data && data.exams) {
          setCourseData(data.exams);
        }
      } catch (error) {
        console.error("Error fetching all courses for selection:", error);
        toast.error("Could not load courses for selection.");
      }
    };
    getAllCourses();
  }, []);

  const handleCourseChange = (index, e) => {
    const { name, value } = e.target;
    const newCourses = [...courses];
    newCourses[index][name] = value;

    // Basic validation for marks
    if (name === "marks") {
      const marksValue = parseFloat(value);
      const maxMarksValue = parseFloat(newCourses[index].maxMarks);
      if (marksValue < 0) {
        newCourses[index][name] = "0";
        toast.error("Marks cannot be negative.");
      } else if (marksValue > maxMarksValue) {
        newCourses[index][name] = maxMarksValue.toString();
        toast.error(`Marks cannot exceed Max Marks (${maxMarksValue}).`);
      }
    }
    setCourses(newCourses);
  };

  const removeCourse = (index) => {
    // For update, allow removing all courses if user wants to start over with courses
    // if (courses.length > 1) {
    const newCourses = [...courses];
    newCourses.splice(index, 1);
    setCourses(newCourses);
    // } else {
    //   toast.info("At least one course is required for a marksheet.");
    // }
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
  const overallGrade = calculateGrade(percentage); // Renamed from 'grade' to avoid conflict with course.grade

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
        // setSearchKeyword(""); // Keep keyword if user clicks outside then back in
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Student search (Consider disabling or hiding for update, as student is usually fixed)
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchKeyword(query);

    if (query) {
      try {
        const { data } = await axios.get(`${baseUrl}/student/search`, {
          params: { keyword: query },
        });
        setSearchResults(data.students);
      } catch (error) {
        console.error("Error searching students", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  // When a student is selected from search (Less relevant for "Update" unless you allow changing the student)
  const handleStudentData = (data) => {
    // For an update form, changing the student is generally not done.
    // If you allow it, ensure backend handles this correctly.
    // For now, we'll assume the student is fixed based on the initial load.
    toast.info(
      "Student for this marksheet is fixed. To change student, create a new marksheet."
    );
    setSearchKeyword("");
    setSearchResults([]);
    // setsingleStudentData(data);
    // setStudentInfo({
    //   name: data.name || "",
    //   fatherName: data.fatherName || "",
    //   course: data.course || "",
    //   duration: data.duration || "",
    //   enrollmentId: data.enrollmentId || "",
    //   certificateNo: data.certificateNo || "",
    // });
  };

  // Add course from search
  const handleCourseData = (data) => {
    if (courses.some((course) => course.code === data.courseCode)) {
      toast.error("This course is already added");
      setSearchCourseKeyword("");
      setSearchCourseResults([]);
      return;
    }
    const newCourse = {
      code: data.courseCode,
      name: data.courseName,
      maxMarks: data.marks, // Assuming 'marks' from exam/search is maxMarks
      marks: "", // Obtained marks will be empty initially
      grade: "",
    };
    setCourses([...courses, newCourse]);
    setSearchCourseKeyword("");
    setSearchCourseResults([]);
  };

  // Add course from select dropdown
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "Select Course") return;

    const [courseName, courseCode] = selectedValue.split(" - ");

    if (courses.some((course) => course.code === courseCode)) {
      toast.error("This course is already added");
      e.target.value = "Select Course"; // Reset select
      return;
    }

    const courseToAdd = courseData.find(
      (c) => c.courseCode === courseCode && c.courseName === courseName
    );

    if (courseToAdd) {
      const newCourse = {
        code: courseToAdd.courseCode,
        name: courseToAdd.courseName,
        maxMarks: courseToAdd.marks, // Assuming 'marks' from all-exams is maxMarks
        marks: "",
        grade: "",
      };
      setCourses([...courses, newCourse]);
    }
    e.target.value = "Select Course"; // Reset select
  };

  // Search for courses to add
  const handleSearchCourseChange = async (e) => {
    const query = e.target.value;
    setSearchCourseKeyword(query);

    if (query) {
      try {
        // Assuming '/exam/search' is the correct endpoint for searching courses/exams
        const { data } = await axios.get(`${baseUrl}/exam/search`, {
          params: { keyword: query },
        });
        setSearchCourseResults(data.courses); // Assuming response has 'courses' array
      } catch (error) {
        console.error("Error searching courses", error);
        setSearchCourseResults([]);
      }
    } else {
      setSearchCourseResults([]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!singleStudentData || !singleStudentData._id) {
        toast.error("Student information is missing or invalid for update.");
        setLoading(false);
        return;
      }

      if (courses.length === 0) {
        toast.error("Please add at least one course to the marksheet.");
        setLoading(false);
        return;
      }

      let formIsValid = true;
      for (const course of courses) {
        if (!course.marks || isNaN(parseFloat(course.marks))) {
          toast.error(
            `Obtained marks missing or invalid for course: ${course.name}`
          );
          formIsValid = false;
          break;
        }
        if (
          parseFloat(course.marks) < 0 ||
          parseFloat(course.marks) > parseFloat(course.maxMarks)
        ) {
          toast.error(
            `Obtained marks for ${course.name} is out of range (0-${course.maxMarks}).`
          );
          formIsValid = false;
          break;
        }
        if (!course.grade || course.grade.trim() === "") {
          toast.error(`Grade missing for course: ${course.name}`);
          formIsValid = false;
          break;
        }
      }

      if (!formIsValid) {
        setLoading(false);
        return;
      }

      const totalObtainedMarks = courses.reduce(
        (sum, course) => sum + (parseFloat(course.marks) || 0),
        0
      );
      const totalMaxMarks = courses.reduce(
        (sum, course) => sum + (parseFloat(course.maxMarks) || 0),
        0
      );

      const subjectsPayload = courses.map((course) => ({
        courseCode: course.code,
        courseName: course.name,
        maxMarks: parseFloat(course.maxMarks),
        obtainedMarks: parseFloat(course.marks),
        grade: course.grade,
      }));

      const requestBody = {
        // student : initialMarksheetData?.student?._id,
        subjects: subjectsPayload,
        totalMaxMarks,
        totalObtainedMarks,
        overallGrade: overallGrade,
      };

      console.log(requestBody);

      // Make PUT API call to update
      const { data } = await axios.put(
        `${baseUrl}/marksheet/${id}`, // Use the marksheet ID from params
        requestBody
      );

      if (data && data.message) {
        // Adjust based on your API's success response
        toast.success(data.message);
        navigate(`/marksheet/${data.marksheet._id}`);
      } else {
        toast.error("Failed to update marksheet. Unknown response.");
      }
    } catch (error) {
      console.error("Error submitting marksheet update:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to update marksheet. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !initialMarksheetData) {
    // Show loading spinner only on initial load
    return <div className="loading-container">Loading Marksheet Data...</div>;
  }

  return (
    <div className="markSheet">
      <div className="markSheet-top">
        <Link to="#" onClick={() => navigate(-1)} className="back-icon">
          {" "}
          {/* Corrected Link usage */}
          <MdKeyboardBackspace size={35} />
        </Link>
        <h1>Update Marksheet</h1>
      </div>
      <div className="markSheet-container">
        {/* Student Information Section - Consider making this read-only for update */}
        <div className="student-info-section">
          <div className="student-info-section-top">
            <h3>Student Information (Fixed for this Marksheet)</h3>
            {/* 
              For "Update", student search might be confusing. 
              If student must be fixed, remove or disable search.
            */}
            {/* <div className="student-info-section-top-right">
              <IoSearchSharp className="searh-icon" />
              <input
                type="search"
                placeholder="Search student by name..."
                value={searchKeyword}
                onChange={handleSearchChange}
                disabled // Disable student search for update
              />
              {searchKeyword && searchResults.length > 0 && (
                <div className="search-data" ref={searchRef}>
                  {searchResults.map((item) => (
                    <div
                      key={item._id}
                      className="search-result-item"
                      onClick={() => handleStudentData(item)}
                    >
                      <span>{item.name} / </span>
                      <span className="fath-name">
                        Father: {item.fatherName}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {searchKeyword && searchResults.length === 0 && (
                 <p className="no-cust" ref={searchRef}>No students found</p>
              )}
            </div> */}
          </div>
          <div className="info-grid">
            {studentDetails.map((field) => (
              <div className="info-item" key={field.name}>
                <label>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={studentInfo[field.name] || ""} // studentInfo is populated from fetched marksheet
                  readOnly // Make student info fields read-only for update
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="marks-table-section">
          <div className="marks-table-section-top">
            <h3>Course Performance</h3>
            <div className="marks-table-section-top-right">
              {/* Search for courses to add */}
              <div className="marks-table-section-top-right-search">
                <IoSearchSharp className="searh-icon" />
                <input
                  type="search"
                  placeholder="Search course by name/code to add..."
                  value={searchCourseKeyword}
                  onChange={handleSearchCourseChange}
                />
                {searchCourseKeyword && (
                  <div className="search-data" ref={searchRef}>
                    {" "}
                    {/* You might need another ref for course search results dropdown */}
                    {searchCourseResults?.length > 0 ? (
                      <div className="search-results">
                        {searchCourseResults.map((item) => (
                          <div
                            key={item._id || item.courseCode} // Use a unique key
                            className="search-result-item"
                            onClick={() => handleCourseData(item)}
                          >
                            <span>{item.courseName} / </span>
                            <span className="fath-name">{item.courseCode}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-cust">No courses found</p>
                    )}
                  </div>
                )}
              </div>
              {/* Select course from dropdown to add */}
              <div className="marks-table-section-top-right-select">
                <select
                  onChange={handleSelectChange}
                  defaultValue="Select Course"
                >
                  <option value="Select Course" disabled>
                    Select Course to Add
                  </option>
                  {courseData?.map((item, index) => (
                    <option
                      key={index}
                      value={`${item.courseName} - ${item.courseCode}`}
                    >
                      {item.courseName} - {item.courseCode} (Max: {item.marks})
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
                <col style={{ width: "10%" }} /> {/* Adjusted for actions */}
              </colgroup>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Course Name</th>
                  <th>Max Marks</th>
                  <th>Obtained Marks</th>
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
                    <tr key={course.code || index}>
                      {" "}
                      {/* Use a more stable key if possible */}
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
                          name="maxMarks" // Changed from maxInternal
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
                          max={course.maxMarks} // Max should be maxMarks of the course
                          placeholder="Obtained"
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="grade"
                          value={course.grade}
                          onChange={(e) => handleCourseChange(index, e)}
                          placeholder="e.g., A, B+"
                          required
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeCourse(index)}
                          // disabled={courses.length <= 1} // Allow removing to zero if needed
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
            <span>Total Max Marks:</span>
            <span>
              {courses.reduce(
                (sum, course) => sum + (parseFloat(course.maxMarks) || 0), // Correct: sum of maxMarks
                0
              )}
            </span>
          </div>
          <div className="summary-item">
            <span>Total Obtained Marks:</span>
            <span>
              {courses.reduce(
                (sum, course) => sum + (parseFloat(course.marks) || 0), // Correct: sum of obtained marks
                0
              )}
            </span>
          </div>
          {/* <div className="summary-item">
            <span>Percentage:</span>
            <span>{percentage}%</span>
          </div> */}
          <div className="summary-item">
            <span>Overall Grade:</span>
            <span className={`grade-${overallGrade.replace("+", "plus")}`}>
              {overallGrade}
            </span>
          </div>
        </div>

        <div className="marksheet-btns">
          <button
            type="button"
            onClick={handleSubmit}
            className="success-btn"
            disabled={loading}
          >
            {loading ? "Saving..." : "Update Marksheet"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateMarkSheet;
