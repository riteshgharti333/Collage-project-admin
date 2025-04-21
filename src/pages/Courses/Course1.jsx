import "./Course.scss";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CorComp from "../../components/CorComp/CorComp";
import {baseUrl} from "../../main";
import axios from "axios";

const Course1 = () => {

  const [mainCourses, setMainCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const {data} = await axios.get(`${baseUrl}/course/all-course`);
        console.log(data)
        const filtered = data?.courses?.filter(
          (course) => course.courseType === "Main Course"
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
        <h1>Main Course</h1>
        <Link to="/courses/new-course" className="success-btn">
          Add New Course
        </Link>
      </div>

      <CorComp courses={mainCourses} />
    </div>
  );
};

export default Course1;
