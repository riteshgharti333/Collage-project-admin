import "./AdmissionForm.scss";
import { formCourse } from "../../assets/data";
import { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../main";
import { toast } from "sonner";

import { states } from "../../assets/state";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

const AdmissionForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    profile: "",
    selectCourse: "",
    selectState: "",
    district: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      phoneNumber,
      profile,
      selectCourse,
      selectState,
      district,
      city,
    } = formData;

    if (
      !name ||
      !email ||
      !phoneNumber ||
      !profile ||
      !selectCourse ||
      !selectState ||
      !district ||
      !city
    ) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${baseUrl}/admission/new-admission`,
        formData
      );

      if (data.result === 1) {
        toast.success(data.message);
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          profile: "",
          selectCourse: "",
          selectState: "",
          district: "",
          city: "",
        });
        navigate(`/admission/${data?.admission?._id}`);
      }
    } catch (error) {
      console.error("Admission submission error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admissionForm">
      <div className="admissionForm-top">
        <Link onClick={() => navigate(-1)} className="back-icon">
          <MdKeyboardBackspace size={35} />
        </Link>
        <h1>Admission Form</h1>
      </div>
      <div className="admission-wrapper">
        <form onSubmit={handleSubmit} method="POST">
          <div className="form-group">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="name">Name</label>
            <div className="underline"></div>
          </div>

          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email</label>
            <div className="underline"></div>
          </div>

          <div className="form-group">
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
            <label htmlFor="phoneNumber">Phone Number</label>
            <div className="underline"></div>
          </div>

          <div className="form-group">
            <select
              name="profile"
              id="profile"
              value={formData.profile}
              onChange={handleChange}
              required
            >
              <option value="">Qualification </option>
              <option value="10+2">10+2</option>
              <option value="Under Graduate">Under Graduate</option>
              <option value="Post Graduate">Post Graduate</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="form-group">
            <select
              name="selectCourse"
              id="course"
              value={formData.selectCourse}
              onChange={handleChange}
              required
            >
              <option value="">Select Course</option>
              {formCourse.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <select
              name="selectState"
              id="state"
              value={formData.selectState}
              onChange={handleChange}
              required
            >
              <option value="">Select State</option>
              {states
                .sort((a, b) => a.state.localeCompare(b.state))
                .map((item, index) => (
                  <option key={index} value={item.state}>
                    {item.state}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <select
              name="district"
              id="district"
              value={formData.district}
              onChange={handleChange}
              required
            >
              <option value="">Select District</option>
              {states
                .find((item) => item.state === formData.selectState)
                ?.districts.map((district, idx) => (
                  <option key={idx} value={district}>
                    {district}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <label htmlFor="city">City</label>
            <div className="underline"></div>
          </div>

          <div className="form-group">
            <button type="submit" className="success-btn" disabled={loading}>
              {loading ? "Sending..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmissionForm;
