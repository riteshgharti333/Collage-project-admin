import { useEffect, useRef, useState } from "react";
import "./SingleMarksheet.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../main";
import axios from "axios";
import { MdKeyboardBackspace } from "react-icons/md";
import { toast } from "sonner";
import jsPDF from "jspdf";

const SingleMarksheet = () => {
  const [activeTab, setActiveTab] = useState("details");
  const { id } = useParams();
  const [marksheet, setMarksheet] = useState({});
  const [marksheetImage, setMarksheetImage] = useState("");
  const [certificateImage, setCertificateImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch marksheet data
        const { data } = await axios.get(`${baseUrl}/marksheet/${id}`);
        if (data?.marksheet) {
          setMarksheet(data.marksheet);

          // Fetch marksheet image
          const marksheetRes = await axios.get(
            `${baseUrl}/print-marksheet/${id}`,
            {
              responseType: "blob",
            }
          );
          const marksheetUrl = URL.createObjectURL(marksheetRes.data);
          setMarksheetImage(marksheetUrl);

          // Fetch certificate image if enrollmentId exists
          if (data.marksheet.student?.enrollmentId) {
            const certRes = await axios.get(
              `${baseUrl}/second-certificate/${data.marksheet.student.enrollmentId}`,
              { responseType: "blob" }
            );
            const certUrl = URL.createObjectURL(certRes.data);
            setCertificateImage(certUrl);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load data. Please try again.");
      }
    };

    fetchData();
  }, [id]);

  const printDocuments = () => {
    if (!marksheetImage || !certificateImage) {
      toast.error("Documents are still loading");
      return;
    }

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Documents</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }
            html, body {
              margin: 0;
              padding: 0;
            }
            .page {
              page-break-after: always;
              width: 100%;
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .page:last-child {
              page-break-after: auto;
            }
            img {
              max-width: 100%;
              max-height: 100vh;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <div class="page">
            <img src="${certificateImage}" />
          </div>
          <div class="page">
            <img src="${marksheetImage}" />
          </div>
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
                window.close();
              }, 1000);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const downloadPdf = async () => {
    if (!marksheetImage || !certificateImage) {
      toast.error("Documents are still loading");
      return;
    }

    setLoading(true);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const compressImage = async (imageUrl) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Allow CORS if hosted
        img.src = imageUrl;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set canvas width to A4 width in pixels (595pt at 72dpi = ~794px)
          const MAX_WIDTH = 794;
          const scale = MAX_WIDTH / img.width;
          const width = MAX_WIDTH;
          const height = img.height * scale;

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7); // Adjust quality here
          resolve({ dataUrl: compressedDataUrl, width, height });
        };
      });
    };

    try {
      const cert = await compressImage(certificateImage);
      const mark = await compressImage(marksheetImage);

      const pageWidth = pdf.internal.pageSize.getWidth();
      const certHeight = (cert.height * pageWidth) / cert.width;
      const markHeight = (mark.height * pageWidth) / mark.width;

      pdf.addImage(cert.dataUrl, "JPEG", 0, 0, pageWidth, certHeight);
      pdf.addPage();
      pdf.addImage(mark.dataUrl, "JPEG", 0, 0, pageWidth, markHeight);

      pdf.save(`${marksheet.student?.name || "student"}_documents.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { data } = await axios.delete(`${baseUrl}/marksheet/${id}`);
      console.log(data)

      if (data && data.result == 1) {
        toast.success(data.message);
        navigate("/marksheets");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.messaage);
    } finally {
      setLoading(false);
    }
  };

    const cardRef = useRef();
  
   useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setShowDeleteModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

     const DeleteModal = () => (
    <div className="deleteImage">
      <div className="deleteImage-desc" ref={cardRef}>
        <h3>Are you sure you want to delete this?</h3>
        <div className="deleteImage-btns">
          <button
            className="delete-btn"
            disabled={loading}
            onClick={handleDelete}
          >
            {loading ? "Deleting..." : "Yes"}
          </button>
          <button
            className="success-btn"
            onClick={() => setShowDeleteModal(false)}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );



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

        <div className="action-buttons">
          <Link
            to={`/update-marksheet/${marksheet?._id}`}
            className="success-btn"
          >
            Update
          </Link>
          <button
            className="success-btn"
            onClick={printDocuments}
            disabled={loading || !marksheetImage || !certificateImage}
          >
            {loading ? "Loading..." : "Print Transcript & Certificate"}
          </button>
          <button
            className="success-btn"
            onClick={downloadPdf}
            disabled={loading || !marksheetImage || !certificateImage}
          >
            {loading ? "Preparing..." : "Download PDF"}
          </button>
          <button
            disabled={loading}
            className="delete-btn"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>
        </div>

        {showPreview && (
          <div className="preview-modal">
            <div className="preview-content">
              <h2>Document Preview</h2>
              <div className="preview-images">
                {certificateImage && (
                  <div className="preview-page">
                    <h3>Certificate</h3>
                    <img src={certificateImage} alt="Certificate Preview" />
                  </div>
                )}
                {marksheetImage && (
                  <div className="preview-page">
                    <h3>Marksheet</h3>
                    <img src={marksheetImage} alt="Marksheet Preview" />
                  </div>
                )}
              </div>
              <div className="preview-actions">
                <button onClick={() => setShowPreview(false)}>Cancel</button>
                <button onClick={printDocuments}>Print</button>
                <button onClick={downloadPdf}>Download PDF</button>
                <button
                  disabled={loading}
                  className="delete-btn"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {showDeleteModal && <DeleteModal />}

    </div>
  );
};

export default SingleMarksheet;
