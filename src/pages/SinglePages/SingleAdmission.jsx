import { useEffect, useRef, useState } from "react";
import "./SinglePage.scss";
import DeleteCard from "../../components/DeleteCard/DeleteCard";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import { baseUrl } from "../../main";
import { Link, Links, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { MdKeyboardBackspace } from "react-icons/md";

const SingleAdmission = () => {
  const [openDeleteCard, setDeleteCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const cardRef = useRef(null);

  const [singleData, setSingleData] = useState({});
  const [approveCard, setApproveCard] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const getSingleData = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/admission/${id}`);
        if (data && data.admission) {
          setSingleData(data.admission);
        }
      } catch (error) {
        console.error("Failed to fetch admission:", error);
        toast.error("Failed to fetch admission form.");
      }
    };
    getSingleData();
  }, [id]);

  console.log(singleData);

  const {
    _id,
    name,
    email,
    phoneNumber,
    profile,
    selectCourse,
    selectState,
    district,
    city,
    approved,
    message,
    photo,
    document,
  } = singleData;

  console.log(singleData);

  const admissionDetails = [
    { label: "Name", value: name },
    { label: "Email", value: email },
    { label: "Phone Number", value: phoneNumber },
    { label: "Qualification", value: profile },
    { label: "Course", value: selectCourse },
    { label: "State", value: selectState },
    { label: "District", value: district },
    { label: "City", value: city },
    { label: "Message", value: message },
    { label: "Photo", value: <img src={photo} alt="Student" /> },
    {
      label: "Documents",
      value: (
        <ul>
          {document?.map((docUrl, i) => (
            <li key={i} className="document-item">
              <a href={docUrl} target="_blank" rel="noopener noreferrer">
                View Document {i + 1}
              </a>
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: "Approved",
      value: approved ? "Approved" : "Not Approved",
    },
  ];

  // ✅ Approve admission Handler

  const handleApprove = async () => {
    if (approved) {
      toast.info("Form is already approved."); // ✅ Toast if already approved
      return;
    }

    setApproving(true);

    try {
      const { data } = await axios.put(
        `${baseUrl}/admission/admission-approve/${_id}`,
        {
          withCredentials: true,
        }
      );

      if (data && data.result === 1) {
        toast.success(data.message);

        setSingleData((prev) => ({
          ...prev,
          approved: true,
        }));
      } else {
        toast.error("Failed to approve form.");
      }
    } catch (error) {
      console.error("Error approving form:", error);
      toast.error(error.response.data.message);
    } finally {
      setApproving(false);
      setApproveCard(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="single-page">
      <div className="single-page-top">
        <Link onClick={() => navigate(-1)} className="back-icon">
          <MdKeyboardBackspace size={35} />
        </Link>
        <h1>Admission Form</h1>
      </div>

      {openDeleteCard && (
        <DeleteCard
          onClose={() => setDeleteCard(false)}
          id={_id}
          path="admission"
        />
      )}

      <div className="single-page-content">
        <h2 className="single-page-form-title">Student Details</h2>
        <div className="single-page-form-content">
          <ul className="single-page-form-list">
            {admissionDetails.map((item, index) => (
              <li key={index} className="single-page-form-item">
                <span className="single-page-form-label">
                  <strong>{item.label} :</strong>
                </span>
                <span className="single-page-form-value">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="single-page-btns">
        <button
          className="success-btn"
          onClick={() => {
            if (approved) {
              toast.info("admission is already approved.");
            } else {
              setApproveCard(true);
            }
          }}
          disabled={approving}
        >
          <AiOutlineCheckCircle className="btn-icon" />
          {approved ? "Already Approved" : "Approve Form"}
        </button>

        <Link to={`/update-admission/${_id}`} className="success-btn update-ad">
          Update
        </Link>
        <button
          className="delete-btn"
          onClick={() => setDeleteCard(!openDeleteCard)}
        >
          <AiOutlineCloseCircle className="btn-icon" />
          {loading ? "Rejecting..." : "Reject Form"}
        </button>
      </div>

      {approveCard && (
        <div className="approve-card">
          <div className="approve-desc" ref={cardRef}>
            <h3>Are you sure you want to approve this form?</h3>

            <p className="approve-note">
              Note: Approving this form will send a confirmation email to the
              student.
            </p>
            <div className="approve-btns">
              <button className="success-btn" onClick={handleApprove}>
                {approving ? "Approving..." : "Yes"}
              </button>

              <button
                className="delete-btn"
                onClick={() => setApproveCard(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleAdmission;
