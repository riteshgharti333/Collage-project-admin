import { useEffect, useRef, useState } from "react";
import "./SinglePage.scss";
import DeleteCard from "../../components/DeleteCard/DeleteCard";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import { baseUrl } from "../../main";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const SingleEnquiry = () => {
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
        const { data } = await axios.get(`${baseUrl}/enquiry/${id}`);
        if (data && data.enquiry) {
          setSingleData(data.enquiry);
        }
      } catch (error) {
        console.error("Failed to fetch enquiry:", error);
        toast.error("Failed to fetch enquiry form.");
      }
    };
    getSingleData();
  }, [id]);

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
  } = singleData;

  const enquiryDetails = [
    { label: "Name", value: name },
    { label: "Email", value: email },
    { label: "Phone Number", value: phoneNumber },
    { label: "Profile", value: profile },
    { label: "Course", value: selectCourse },
    { label: "State", value: selectState },
    { label: "District", value: district },
    { label: "City", value: city },
    { label: "Message", value: message },

    {
      label: "Approved",
      value: approved ? "Approved" : "Not Approved",
    },
  ];

  const handleApprove = async () => {
    if (approved) {
      toast.info("Enquiry is already approved.");
      return;
    }

    setApproving(true);

    try {
      const { data } = await axios.put(`${baseUrl}/enquiry/approve/${_id}`);

      if (data && data.result === 1) {
        toast.success(data.message);

        // ✅ Update local state
        setSingleData((prev) => ({
          ...prev,
          approved: true,
        }));
      } else {
        toast.error("Failed to approve enquiry.");
      }
    } catch (error) {
      console.error("Error approving enquiry:", error);
      toast.error("Failed to approve the enquiry. Please try again.");
    } finally {
      setApproving(false);
      setApproveCard(false);
    }
  };

  return (
    <div className="single-page">
      <div className="single-page-top">
        <h1>Enquiry Form</h1>
      </div>

      {openDeleteCard && (
        <DeleteCard
          onClose={() => setDeleteCard(false)}
          id={_id}
          path="enquiry"
        />
      )}

      <div className="single-page-content">
        <h2 className="single-page-form-title">Enquiry Details</h2>
        <div className="single-page-form-content">
          <ul className="single-page-form-list">
            {enquiryDetails.map((item, index) => (
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
              toast.info("Enquiry is already approved.");
            } else {
              setApproveCard(true);
            }
          }}
          disabled={approving}
        >
          <AiOutlineCheckCircle className="btn-icon" />
          {approved ? "Already Approved" : "Approve Form"}
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
              Note: Approving this form will add to a admission data
            </p>
            <div className="approve-btns">
              <button className="success-btn" onClick={handleApprove}>
                Yes
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

export default SingleEnquiry;
