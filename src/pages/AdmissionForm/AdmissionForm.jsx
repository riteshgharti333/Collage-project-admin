import "./AdmissionForm.scss";
import { formCourse } from "../../assets/data";
import { useState, useRef } from "react";
import axios from "axios";
import { baseUrl } from "../../main";
import { toast } from "sonner";
import { states } from "../../assets/state";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace, MdCloudUpload, MdClose } from "react-icons/md";

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

  const [passportPhoto, setPassportPhoto] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const passportRef = useRef();
  const documentsRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePassportPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Passport photo should be less than 2MB");
        return;
      }
      setPassportPhoto(file);
    }
  };

  const handleDocuments = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024); // 5MB limit

      if (validFiles.length !== files.length) {
        toast.error("Some files were too large (max 5MB each)");
      }

      setDocuments((prev) => [...prev, ...validFiles]);
    }
  };

  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
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

      // Create FormData for file uploads
      const formDataObj = new FormData();
      formDataObj.append("name", name);
      formDataObj.append("email", email);
      formDataObj.append("phoneNumber", phoneNumber);
      formDataObj.append("profile", profile);
      formDataObj.append("selectCourse", selectCourse);
      formDataObj.append("selectState", selectState);
      formDataObj.append("district", district);
      formDataObj.append("city", city);
      console.log(passportPhoto);

      if (passportPhoto) {
        formDataObj.append("photo", passportPhoto);
      }

      documents.forEach((doc, index) => {
        formDataObj.append(`document`, doc);
      });

      const { data } = await axios.post(
        `${baseUrl}/admission/new-admission`,
        formDataObj,
        {
          withCredentials: true,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data && data.success) {
        toast.success(data.message);
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
        <form
          onSubmit={handleSubmit}
          method="POST"
          encType="multipart/form-data"
        >
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="profile">Qualification</label>
            <select
              name="profile"
              id="profile"
              value={formData.profile}
              onChange={handleChange}
              required
            >
              <option value="">Select Qualification</option>
              <option value="10+2">10+2</option>
              <option value="Under Graduate">Under Graduate</option>
              <option value="Post Graduate">Post Graduate</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="course">Select Course</label>
            <select
              name="selectCourse"
              id="course"
              value={formData.selectCourse}
              onChange={handleChange}
              required
            >
              <option value="">Choose a course</option>
              {formCourse.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="state">State</label>
            <select
              name="selectState"
              id="state"
              value={formData.selectState}
              onChange={handleChange}
              required
            >
              <option value="">Select your state</option>
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
            <label htmlFor="district">District</label>
            <select
              name="district"
              id="district"
              value={formData.district}
              onChange={handleChange}
              required
              disabled={!formData.selectState}
            >
              <option value="">Select your district</option>
              {formData.selectState &&
                states
                  .find((item) => item.state === formData.selectState)
                  ?.districts.map((district, idx) => (
                    <option key={idx} value={district}>
                      {district}
                    </option>
                  ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
              required
            />
          </div>

          <div className="form-group">
            <label>Passport Size Photo (Recommended size : 300 x 300)</label>
            <div className="file-upload-container">
              <div
                className="file-upload-box"
                onClick={() => passportRef.current.click()}
              >
                <input
                  type="file"
                  ref={passportRef}
                  onChange={handlePassportPhoto}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <label className="upload-label">
                  <MdCloudUpload />
                  <span>
                    {passportPhoto ? (
                      <strong>{passportPhoto.name}</strong>
                    ) : (
                      "Click to upload passport photo (max 2MB)"
                    )}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Documents</label>
            <div className="file-upload-container">
              <div
                className="file-upload-box"
                onClick={() => documentsRef.current.click()}
              >
                <input
                  type="file"
                  ref={documentsRef}
                  onChange={handleDocuments}
                  multiple
                  style={{ display: "none" }}
                />
                <label className="upload-label">
                  <MdCloudUpload />
                  <span>
                    {documents.length > 0 ? (
                      <strong>Add more documents</strong>
                    ) : (
                      "Click to upload documents (max 5MB each)"
                    )}
                  </span>
                </label>
              </div>

              {documents.length > 0 && (
                <div className="file-preview">
                  {documents.map((file, index) => (
                    <div key={index} className="file-item">
                      <span className="file-name">{file.name}</span>
                      <MdClose
                        className="remove-file"
                        onClick={() => removeDocument(index)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <button type="submit" className="success-btn" disabled={loading}>
              {loading ? "Processing..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmissionForm;
