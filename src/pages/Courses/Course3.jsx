import "./Course.scss";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CorComp from "../../components/CorComp/CorComp";
import {baseUrl} from "../../main";
import axios from "axios";

const Course3 = () => {

  const [mainCourses, setMainCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const {data} = await axios.get(`${baseUrl}/course/all-course`);
        console.log(data)
        const filtered = data?.courses?.filter(
          (course) => course.courseType === "PG Course"
        );
        setMainCourses(filtered || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="course">
      <div className="course-top">
        <h1>PG Course</h1>
        <Link to="/courses/new-course" className="success-btn">
          Add New Course
        </Link>
      </div>

      <CorComp courses={mainCourses} />
    </div>
  );
};

export default Course3;
