import "./UpdateAbout.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import { toast } from "sonner";

const UpdateAbout = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/about/about-content`);
        setContent(data?.about?.content || []);
      } catch (error) {
        console.error("Failed to fetch about content", error);
      }
    };

    fetchAbout();
  }, []);

  // Handle content update
  const handleChange = (index, value) => {
    const updated = [...content];
    updated[index] = value;
    setContent(updated);
  };

  // Add a new paragraph
  const addParagraph = () => {
    setContent([...content, ""]);
  };

  // Remove a paragraph
  const removeParagraph = (index) => {
    const updated = [...content];
    updated.splice(index, 1);
    setContent(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${baseUrl}/about/about-content`,
        { content },
        {
          withCredentials: true,
        }
      );

      if (data && data.result == 1) {
        toast.success(data.message);
        navigate("/about-content");
      }
    } catch (error) {
      console.error("Failed to update", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="updateAbout">
      <div className="updateAbout-top">
        <Link onClick={() => navigate(-1)} className="back-icon">
          <MdKeyboardBackspace size={35} />
        </Link>
        <h1>Update About Content</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {content.map((para, index) => (
          <div key={index} className="about-paragraph">
            <textarea
              value={para}
              onChange={(e) => handleChange(index, e.target.value)}
              rows="4"
              placeholder={`Paragraph ${index + 1}`}
            />
            <button
              type="button"
              className="remove-btn"
              onClick={() => removeParagraph(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <button type="button" className="add-btn" onClick={addParagraph}>
          + Add Paragraph
        </button>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Updating..." : "Update About"}
        </button>
      </form>
    </div>
  );
};

export default UpdateAbout;
