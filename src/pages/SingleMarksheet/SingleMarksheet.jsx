import { useEffect, useState } from "react";
import "./SingleMarksheet.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../main";
import axios from "axios";
import { MdKeyboardBackspace } from "react-icons/md";

const SingleMarksheet = () => {
  const [activeTab, setActiveTab] = useState("details");

  const { id } = useParams();

  const [marksheet, setMarksheet] = useState({});

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(`${baseUrl}/marksheet/${id}`);
      console.log(data);
      if (data && data?.marksheet) {
        setMarksheet(data?.marksheet);
      }
    };
    getData();
  }, []);

  const navigate = useNavigate();

  const [marsheetImage, setMarksheetImage] = useState("");
  const [loading, setLoading] = useState(false);

  const getMarksheet = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${baseUrl}/print-marksheet/${id}`, {
        responseType: "blob",
      });

      const imageUrl = URL.createObjectURL(data);
      setMarksheetImage(imageUrl);
      toast.success("Marksheet loaded successfully!");
    } catch (error) {
      console.error("Failed to get marksheet:", error);

      try {
        // If error response is a blob, parse it
        const blob = error.response?.data;
        if (blob instanceof Blob && blob.type === "application/json") {
          const text = await blob.text();
          const json = JSON.parse(text);
          toast.error(json.message || "Something went wrong.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMarksheet();
  }, []);

  const printMarksheet = () => {
    if (!marsheetImage) {
      toast.error("Marksheet is still loading");
      return;
    }

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
    <html>
      <head>
        <title>Print Marksheet</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
          }
          body {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          img {
            max-width: 100%;
            max-height: 100%;
            width: 100%;
            height: auto;
            object-fit: contain;
            page-break-inside: avoid;
          }
        </style>
      </head>
      <body>
        <img src="${marsheetImage}" onload="window.print(); window.close();" />
      </body>
    </html>
  `);
    printWindow.document.close();
  };

  const [showPreview, setShowPreview] = useState(false);

  const handlePrint = () => {
    setShowPreview(true);
  };

  const handlePrintConfirmed = () => {
    setShowPreview(false);
    printMarksheet();
  };

  return (
    <div className="singleMarksheet">
      <div className="singleMarksheet-top">
        <Link onClick={() => navigate(-1)} className="back-icon">
          <MdKeyboardBackspace size={35} />
        </Link>
        <h1>Marksheet</h1>
      </div>
      <div className="singleMarksheet-container">
        <div className="student-info-section">
          <div className="info-grid">
            <div className="info-item">
              <label>Student Name</label>
              <p>{marksheet?.student?.name}</p>
            </div>
            <div className="info-item">
              <label>Father's Name</label>
              <p>{marksheet?.student?.fatherName}</p>
            </div>
            <div className="info-item">
              <label>Enrollment ID</label>
              <p>{marksheet?.student?.enrollmentId}</p>
            </div>
            <div className="info-item">
              <label>Certificate No.</label>
              <p>{marksheet?.student?.certificateNo}</p>
            </div>
            <div className="info-item">
              <label>Program</label>
              <p>{marksheet?.student?.course}</p>
            </div>
            <div className="info-item">
              <label>Duration</label>
              <p>{marksheet?.student?.duration} Year</p>
            </div>
          </div>
        </div>

        <div className="marksheet-tabs">
          <button
            className={`tab-btn ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Academic Details
          </button>
          <button
            className={`tab-btn ${activeTab === "performance" ? "active" : ""}`}
            onClick={() => setActiveTab("performance")}
          >
            Performance
          </button>
        </div>

        {activeTab === "details" && (
          <div className="marks-details">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Max Marks</th>
                    <th>Obtained Marks</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {marksheet?.subjects?.map((subject, index) => (
                    <tr key={index}>
                      <td>{subject.courseCode}</td>
                      <td>{subject.courseName}</td>
                      <td>{subject.maxMarks}</td>
                      <td>{subject.obtainedMarks}</td>
                      <td className={`grade-${subject.grade}`}>
                        {subject.grade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="performance-summary">
            <div className="summary-cards">
              <div className="summary-card">
                <h3>Total Marks</h3>
                <div className="value">{marksheet.totalMaxMarks}</div>
              </div>
              <div className="summary-card">
                <h3>Obtained Marks</h3>
                <div className="value">{marksheet.totalObtainedMarks}</div>
              </div>
              <div className="summary-card">
                <h3>Percentage</h3>
                <div className="value">
                  {(
                    (marksheet.totalObtainedMarks / marksheet.totalMaxMarks) *
                    100
                  ).toFixed(2)}
                  %
                </div>
              </div>
              <div className="summary-card">
                <h3>Overall Grade</h3>
                <div className={`value grade-${marksheet.overallGrade}`}>
                  {marksheet.overallGrade}
                </div>
              </div>
            </div>

            <div className="performance-graph">
              <div className="graph-bar">
                <div
                  className="fill"
                  style={{
                    width: `${
                      (marksheet.totalObtainedMarks / marksheet.totalMaxMarks) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="graph-labels">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        )}

        {showPreview && (
          <div className="preview-modal">
            <div className="preview-content">
              <img src={marsheetImage} alt="Marksheet Preview" />
              <div className="preview-actions">
                <button onClick={() => setShowPreview(false)}>Cancel</button>
                <button onClick={handlePrintConfirmed}>Print</button>
              </div>
            </div>
          </div>
        )}
        <div className="action-buttons">
          <Link
            to={`/update-marksheet/${marksheet?._id}`}
            className="success-btn"
          >
            Update
          </Link>
          <button className="success-btn" onClick={handlePrint}>
            Print Transcript
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleMarksheet;
