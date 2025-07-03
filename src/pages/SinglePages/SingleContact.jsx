import { useEffect, useRef, useState } from "react";
import "./SinglePage.scss";
import DeleteCard from "../../components/DeleteCard/DeleteCard";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import { baseUrl } from "../../main";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { MdKeyboardBackspace } from "react-icons/md";

const SingleContact = () => {
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
        const { data } = await axios.get(`${baseUrl}/contact/${id}`);
        console.log(data);
        if (data && data.contact) {
          setSingleData(data.contact);
        }
      } catch (error) {
        console.error("Failed to fetch contact:", error);
        toast.error("Failed to fetch contact form.");
      }
    };
    getSingleData();
  }, [id]);

  const { _id, name, email, phoneNumber, message, approved } = singleData;

  const studentDetails = [
    { label: "Name", value: name },
    { label: "Email", value: email },
    { label: "Phone Number", value: phoneNumber },
    { label: "Message", value: message },
    {
      label: "Approved",
      value: approved ? "Approved" : "Not Approved",
    },
  ];

  const handleApprove = async () => {
    if (approved) {
      toast.info("Form is already approved.");
      return;
    }

    setApproving(true);

    try {
      const { data } = await axios.put(`${baseUrl}/contact/approve/${_id}`, {
        withCredentials: true,
      });

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
        <h1>Contact Form</h1>
      </div>

      {openDeleteCard && (
        <DeleteCard
          onClose={() => setDeleteCard(false)}
          id={_id}
          path="contact"
        />
      )}

      <div className="single-page-content">
        <h2 className="single-page-form-title">Contact Details</h2>
        <div className="single-page-form-content">
          <ul className="single-page-form-list">
            {studentDetails.map((item, index) => (
              <li key={index} className="single-page-form-item">
                <span className="single-page-form-label">
                  <strong>{item.label} :</strong>
                </span>
                <span
                  className="single-page-form-value"
                  data-label={item.label === "Message" ? "Message" : ""}
                >
                  {item.value}
                </span>
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
              toast.info("Form is already approved.");
            } else {
              setApproveCard(true);
            }
          }}
          disabled={approving}
        >
          <AiOutlineCheckCircle className="btn-icon" />
          {approved
            ? "Already Approved"
            : approving
            ? "Approving..."
            : "Approve Form"}
        </button>

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
              <button
                className="success-btn"
                onClick={handleApprove}
                disabled={approving}
              >
                {approving ? "Approving..." : "Yes"}
              </button>
              <button
                className="delete-btn"
                onClick={() => setApproveCard(false)}
                disabled={approving}
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

export default SingleContact;
