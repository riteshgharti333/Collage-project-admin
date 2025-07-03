import "./AboutContent.scss";
import founder_img from "../../assets/images/founder.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../main";

const AboutContent = () => {
  const [aboutData, setAboutData] = useState([]);

  useEffect(() => {
    const aboutData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/about/about-content`);
        if (data && data.about) {
          setAboutData(data?.about?.content);
        }
      } catch (error) {
        console.log(error);
      }
    };

    aboutData();
  }, []);

  return (
    <div className="about">
      <div className="about-top">
        <h1> About Content</h1>
        <Link to={"/update-about-content"} className="success-btn">
          Update Content
        </Link>
      </div>
      <div className="about-content">
        <div className="about-content-left">
          <div className="about-content-right-desc">
            {aboutData?.slice(0, 2)?.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>

          <div className="about-content-right">
            <img src={founder_img} alt="" />
            <p>
              {" "}
              <span>Sumit Kumar</span> <span>Founder</span>
            </p>
          </div>
        </div>

        {aboutData?.slice(2)?.map((item, index) => (
          <p key={index + 2}>{item}</p>
        ))}
      </div>
    </div>
  );
};

export default AboutContent;
