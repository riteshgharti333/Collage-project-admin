import "./CorComp.scss";
import { Link } from "react-router-dom";

const course_img =
  "https://foundr.com/wp-content/uploads/2021/09/Best-online-course-platforms.png";

const CorComp = ({ courses }) => {
  return (
    <div className="course-comp">
      <div className="course-cards">
        {courses.map((item, index) => (
          <Link to={`/course/${item._id}/${item.bannerTitle}`} className="course-card" key={index}>
            <img src={course_img} alt="" />
            <h3>{item.courseTitle}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CorComp;
