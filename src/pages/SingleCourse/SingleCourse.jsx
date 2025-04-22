import "./SingleCourse.scss";

import { useEffect, useRef, useState } from "react";


import { MdKeyboardBackspace } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../main";
import axios from "axios";
import { toast } from "sonner";

const SingleCourse = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [deleteImg, setDeleteImg] = useState(false);
  const [deleteData, setDeleteData] = useState();

  const [course, setCourse] = useState({});
  const cardRef = useRef(null);

  useEffect(() => {
    const fetchSingleCourse = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/course/${id}`);
        if (data && data.course) {
          setCourse(data.course);
        }
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch course:", error);
        toast.error(error?.response?.data?.message);
      }
    };

    if (id) {
      fetchSingleCourse();
    }
  }, [id]);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`${baseUrl}/course/${id}`);

      if (data) {
        toast.success(data?.message || "Course deleted successfully");
        navigate(-1);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error?.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setDeleteImg(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [deleteImg]);

  const {
    bannerImage,
    bannerTitle,
    courseDescription,
    courseListDesc,
    courseListTitle,
    courseLists,
    courseTitle,
    courseType,
    courseOfCoursesTitle,
    courseOfCoursesLists,
    topicTitle,
    topicLists,
    careerTitle,
    careerLists,
    overviewTitle,
    overviewDesc,
  } = course;

  const DeleteCourse = ({ id, onClose }) => (
    <div className="deleteImage">
      <div className="deleteImage-desc" ref={cardRef}>
        <h3>Delete this course?</h3>
        <div className="deleteImage-btns">
          <button
            className="delete-btn"
            onClick={() => handleDelete(id)}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes"}
          </button>
          <button className="success-btn" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="singleCourse">
      <div className="singleCourse-top">
        <Link onClick={() => navigate(-1)} className="top-link">
          <h1>
            <MdKeyboardBackspace size={35} /> {courseTitle}
          </h1>
        </Link>
        <div className="singleCourse-btns">
          <Link
            to={`/course/update-course/${course._id}/${course.bannerTitle || ""}`}
            className="success-btn"
          >
            Update Course
          </Link>

          <button
            className="delete-btn"
            onClick={() => {
              setDeleteData({ id: course._id });
              setDeleteImg(true);
            }}
          >
            Delete Course
          </button>
        </div>
      </div>
      <div className="singleCourse-banner interior-design">
        <img src={bannerImage} alt="" />

        <div className="singleCourse-banner-title">
          <label htmlFor="">Banner Title&nbsp;-</label>
          <h3>&nbsp; {bannerTitle}</h3>
        </div>

        <div className="singleCourse-banner-title">
          <label htmlFor="">Course Type&nbsp;-</label>
          <h3>&nbsp; {courseType}</h3>
        </div>
      </div>

      <div className="singleCourse-content">
        <div className="singleCourse-content-left">
          <h2>{courseTitle}</h2>
          <p style={{ whiteSpace: "pre-line" }}>{courseDescription}</p>


          <h3>{courseOfCoursesTitle}</h3>

          {courseOfCoursesLists?.some((item) => item.item?.trim() !== "") && (
            <ul>
              {courseOfCoursesLists
                .filter((item) => item.item?.trim() !== "")
                .map((item, index) => (
                  <li key={index}>{item.item}</li>
                ))}
            </ul>
          )}

          <h3>{topicTitle}</h3>
          {topicLists?.some((item) => item.item?.trim() !== "") && (
            <ul>
              {topicLists?.map((item, index) => (
                <li key={index}>{item.item}</li>
              ))}
            </ul>
          )}

          <h3>{careerTitle}</h3>
          {careerLists?.some((item) => item.item?.trim() !== "") && (
            <ul>
              {careerLists?.map((item, index) => (
                <li key={index}>{item.item}</li>
              ))}
            </ul>
          )}

          <h3>{courseListTitle}</h3>
          <p>{courseListDesc}</p>

          {courseLists?.some((item) => item.title?.trim() !== "") && (
            <ul>
              {courseLists?.map((item, index) => (
                <li key={index}>
                  <span>{item.title}</span>
                  <br />
                  {item.desc}
                </li>
              ))}
            </ul>
          )}

          <h3>{overviewTitle}</h3>
          <p style={{ whiteSpace: "pre-line" }}>{overviewDesc}</p>
        </div>
      </div>

      {deleteImg && (
        <DeleteCourse id={deleteData.id} onClose={() => setDeleteImg(false)} />
      )}
    </div>
  );
};

export default SingleCourse;
